import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper component for scroll animations
const FadeInWhenVisible = ({ children, delay = 0, animation = 'animate__fadeInUp' }: { children: React.ReactNode, delay?: number, animation?: string }) => {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target); // Trigger once
				}
			});
		});
		if (domRef.current) observer.observe(domRef.current);
		return () => {
			if (domRef.current) observer.unobserve(domRef.current);
		};
	}, []);

	return (
		<div
			ref={domRef}
			className={`animate__animated ${isVisible ? animation : ''}`}
			style={{
				opacity: isVisible ? 1 : 0,
				animationDelay: `${delay}ms`,
				transition: 'opacity 0.1s' // Let animate.css handle main transition, this prevents FOUC
			}}
		>
			{children}
		</div>
	);
};

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);

	// MOCK DATA INITIALIZATION
	const [boardArticle, setBoardArticle] = useState<BoardArticle>({
		_id: 'mock-id',
		articleCategory: 'NEWS',
		articleTitle: 'Step into Style: Your Guide to Perfect Shoes',
		articleContent: `Finding the perfect pair of shoes can be a daunting task, but it doesn't have to be. Whether you're looking for comfort, style, or a mix of both, there are a few key things to keep in mind.

## Understanding Your Lifestyle

The first step in finding the perfect shoes is to consider your lifestyle. Do you spend most of your day on your feet? Are you an avid runner? Or do you work in a corporate environment? Your daily activities will dictate the type of support and cushioning you need.

## Balancing Aesthetics with Functionality

It's easy to get caught up in the latest trends, but it's important to remember that functionality is just as important as aesthetics. Detailed attention to the fit and material can prevent long-term foot issues.
`,
		articleImage: '/img/community/articleImg.png',
		articleLikes: 35,
		articleViews: 120,
		articleStatus: 'ACTIVE',
		articleComments: 0,
		memberId: 'mock-member',
		memberData: {
			_id: 'mock-member',
			memberNick: 'Harold Kozey',
			memberImage: '',
		},
		meLiked: [],
		createdAt: new Date('2024-01-28'),
		updatedAt: new Date('2024-01-28'),
	} as any);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: articleId,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			if (data?.getBoardArticle) {
				setBoardArticle(data?.getBoardArticle);
				if (data?.getBoardArticle?.memberData?.memberImage) {
					setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
				}
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeBoardArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			// if (!id) return; // Allow mock id
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR_likeBoardArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);

			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};

			await createComment({
				variables: {
					input: commentInput,
				},
			});

			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						<div className="community-detail-config">
							<Stack className="config">
								<Stack className="first-box-config">
									<FadeInWhenVisible>
										<Stack className="article-header">
											<Stack className="category-and-date">
												<span className="category-tag">{articleCategory || 'NEWS'}</span>
												<span className="date-text">
													<Moment format={'MMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
												</span>
											</Stack>
											<Typography className="article-title">{boardArticle?.articleTitle}</Typography>
											<div className="author-info">
												<span className="by-text">By</span>
												<span className="author-name" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</span>
											</div>
										</Stack>
									</FadeInWhenVisible>
									<FadeInWhenVisible delay={100}>
										<Stack className="image-box">
											<img
												src={
													boardArticle?.articleImage
														? (boardArticle.articleImage.startsWith('/') ? boardArticle.articleImage : `${process.env.REACT_APP_API_URL}/${boardArticle?.articleImage}`)
														: '/img/community/articleImg.png'
												}
												alt="Article Hero"
												className="article-hero-img"
											/>
										</Stack>
									</FadeInWhenVisible>
									<FadeInWhenVisible delay={200}>
										<Stack className="content-box">
											<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
										</Stack>
									</FadeInWhenVisible>
									<FadeInWhenVisible delay={300}>
										<div className="article-footer-actions">
											<div className="like-action">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon
														onClick={() => likeBoardArticleHandler(user, boardArticle?._id)}
														className="like-icon liked"
													/>
												) : (
													<ThumbUpOffAltIcon
														onClick={() => likeBoardArticleHandler(user, boardArticle?._id)}
														className="like-icon"
													/>
												)}
												<span>{boardArticle?.articleLikes} Likes</span>
											</div>
											<div className="view-action">
												<VisibilityIcon className="view-icon" />
												<span>{boardArticle?.articleViews} Views</span>
											</div>
										</div>
									</FadeInWhenVisible>
								</Stack>
								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #eee', border: '1px solid #eee' }}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography>{wordsCnt}/100</Typography>
											<Button onClick={createCommentHandler}>Post Comment</Button>
										</Stack>
									</Stack>
								</Stack>
								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={(e: any) => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="inherit"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="inherit"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</Stack>
						</div>
						<Stack className="right-config">
							<FadeInWhenVisible delay={400}>
								<Stack className="search-box">
									<input type="text" placeholder="Search" />
									<IconButton className="search-icon">
										<SearchIcon />
									</IconButton>
								</Stack>
							</FadeInWhenVisible>
							<FadeInWhenVisible delay={500}>
								<Stack className="sidebar-section">
									<Typography className="sidebar-title">Categories</Typography>
									<Tabs
										orientation="vertical"
										aria-label="lab API tabs example"
										TabIndicatorProps={{
											style: { display: 'none' },
										}}
										onChange={tabChangeHandler}
										value={articleCategory}
										className="category-tabs"
									>
										<Tab
											value={'FREE'}
											label={'Free Board'}
											className={`tab-button ${articleCategory === 'FREE' ? 'active' : ''}`}
										/>
										<Tab
											value={'RECOMMEND'}
											label={'Recommendation'}
											className={`tab-button ${articleCategory === 'RECOMMEND' ? 'active' : ''}`}
										/>
										<Tab
											value={'NEWS'}
											label={'News'}
											className={`tab-button ${articleCategory === 'NEWS' ? 'active' : ''}`}
										/>
										<Tab
											value={'HUMOR'}
											label={'Humor'}
											className={`tab-button ${articleCategory === 'HUMOR' ? 'active' : ''}`}
										/>
									</Tabs>
								</Stack>
							</FadeInWhenVisible>
							<FadeInWhenVisible delay={600}>
								<Stack className="sidebar-section">
									<Typography className="sidebar-title">Related Posts</Typography>
									<Stack className="related-posts-list">
										<div className="related-post-item">
											<img src="/img/community/articleImg.png" alt="" />
											<div className="info">
												<div className="date">Jan 28, 2024</div>
												<div className="title">Comfort in Style: Best Shoes...</div>
											</div>
										</div>
										<div className="related-post-item">
											<img src="/img/community/articleImg.png" alt="" />
											<div className="info">
												<div className="date">Jan 25, 2024</div>
												<div className="title">Top 10 Sneakers for Running...</div>
											</div>
										</div>
										<div className="related-post-item">
											<img src="/img/community/articleImg.png" alt="" />
											<div className="info">
												<div className="date">Jan 20, 2024</div>
												<div className="title">Why You Need Specialized Shoe...</div>
											</div>
										</div>
									</Stack>
								</Stack>
							</FadeInWhenVisible>
							<FadeInWhenVisible delay={700}>
								<Stack className="sidebar-section">
									<Typography className="sidebar-title">Popular Tags</Typography>
									<div className="tags-cloud">
										<span className="tag-item">Shoes</span>
										<span className="tag-item">Fashion</span>
										<span className="tag-item">Style</span>
										<span className="tag-item">Comfort</span>
										<span className="tag-item">Running</span>
										<span className="tag-item">Sport</span>
										<span className="tag-item">Casual</span>
									</div>
								</Stack>
							</FadeInWhenVisible>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
