import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory, BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { userVar } from '../../apollo/store';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});






// Helper component for scroll animations
const FadeInWhenVisible = ({ children, delay = 0, animation = 'animate__fadeInUp' }: { children: React.ReactNode, delay?: number, animation?: string }) => {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = React.useRef<HTMLDivElement>(null);

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

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getboardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0].total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.articleCategory) {
			const category = router.query.articleCategory as BoardArticleCategory;
			setSearchCommunity((prev) => ({
				...prev,
				search: { ...prev.search, articleCategory: category },
			}));
		}
	}, [router.query]);

	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				undefined,
				{ shallow: true },
			);
	}, [query, router]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			undefined,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: { input: id },
			});
			await boardArticlesRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<div className="community-page">
				<TabContext value={searchCommunity.search.articleCategory}>
					<div className="category-tabs">
						<TabList onChange={tabChangeHandler} aria-label="blog category tabs" variant="scrollable" scrollButtons={false}>
							<Tab value={'FREE'} label={'Board'} />
							<Tab value={'RECOMMEND'} label={'Recs'} />
							<Tab value={'NEWS'} label={'News'} />
							<Tab value={'HUMOR'} label={'Humor'} />
						</TabList>
					</div>

					<div className="articles-list">
						{totalCount ? (
							boardArticles?.map((boardArticle: BoardArticle) => {
								const imagePath = boardArticle?.articleImage
									? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${boardArticle?.articleImage}`
									: '/img/community/articleImg.png';

								return (
									<div
										key={boardArticle?._id}
										className="article-card"
										onClick={() => {
											router.push({
												pathname: '/community/detail',
												query: { id: boardArticle?._id, articleCategory: boardArticle?.articleCategory ?? 'FREE' }
											});
										}}
									>
										<div className="card-image">
											<img src={imagePath} alt={boardArticle?.articleTitle} />
											<span className="category-tag">{boardArticle?.articleCategory}</span>
										</div>
										<div className="card-content">
											<h3>{boardArticle?.articleTitle}</h3>
											<div className="meta">
												<span className="date">{new Date(boardArticle?.createdAt).toLocaleDateString('en-US')}</span>
												<span className="views">See More</span>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div className="no-data">
								<p>No Articles found!</p>
							</div>
						)}
						{totalCount > 0 && (
							<Stack spacing={2} alignItems="center" mt={2}>
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="rounded"
									color="primary"
									size='small'
									onChange={paginationHandler}
								/>
							</Stack>
						)}
					</div>
				</TabContext>

				<div
					className="write-btn-fixed"
					onClick={() => {
						if (!user?._id) sweetMixinErrorAlert('You are not authorized!').then();
						else
							router.push({
								pathname: '/mypage',
								query: {
									category: 'writeArticle',
								},
							});
					}}
				>
					<EditIcon />
				</div>
			</div>
		);
	} else {
		return (
			<div id="community-list-page">
				<div className="blog-wrapper">
					<div className="banner">
						<div className="banner-image">
							<img src="/img/banner/blog.jpg" alt="Blog Banner" />
						</div>
						<div className="container">
							<div className="banner-text">
								<h1>BLOG</h1>
								<Link href="/">Home</Link> <span>/</span> <p>Blog</p>
							</div>
						</div>
					</div>

					<div className="section">
						<div className="container">
							<TabContext value={searchCommunity.search.articleCategory}>
								<div className="filter-tabs">
									<TabList onChange={tabChangeHandler} aria-label="blog category tabs" centered>
										<Tab value={'FREE'} label={'Board'} />
										<Tab value={'RECOMMEND'} label={'Recommendation'} />
										<Tab value={'NEWS'} label={'News'} />
										<Tab value={'HUMOR'} label={'Humor'} />
									</TabList>
									<Button
										onClick={() => {
											if (!user?._id) sweetMixinErrorAlert('You are not authorized!').then();
											else
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												});
										}}
										className="write-btn"
									>
										Write Article
									</Button>
								</div>

								<div className="blog-grid">
									{totalCount ? (
										boardArticles?.map((boardArticle: BoardArticle, index) => {
											const imagePath = boardArticle?.articleImage
												? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${boardArticle?.articleImage}`
												: '/img/community/articleImg.png';

											return (
												<FadeInWhenVisible key={boardArticle?._id} delay={index * 100}>
													<div
														className="blog-card"
														onClick={() => {
															router.push({
																pathname: '/community/detail',
																query: { id: boardArticle?._id, articleCategory: boardArticle?.articleCategory ?? 'FREE' }
															});
														}}
													>
														<div className="image-wrapper">
															<div className="mask">
																<img src={imagePath} alt={boardArticle?.articleTitle} />
															</div>
															<div className="category-tag">
																{boardArticle?.articleCategory}
															</div>
														</div>
														<div className="content">
															<h3 className="card-title">{boardArticle?.articleTitle}</h3>
															<div className="meta">
																<span className="date">{new Date(boardArticle?.createdAt).toLocaleDateString('en-US')}</span>
																<span className="read-more">View Details</span>
															</div>
														</div>
													</div>
												</FadeInWhenVisible>
											);
										})
									) : (
										<Stack className={'no-data'}>
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Article found!</p>
										</Stack>
									)}
								</div>
							</TabContext>

							{totalCount > 0 && (
								<Stack className="pagination-config">
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(totalCount / searchCommunity.limit)}
											page={searchCommunity.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
									<Stack className="total-result">
										<Typography>
											Total {totalCount} article{totalCount > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								</Stack>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
