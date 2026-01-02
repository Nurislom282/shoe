import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Stack, MenuItem } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import CommunityCardGrid from '../../../libs/components/admin/community/CommunityCardGrid';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { AllBoardArticlesInquiry } from '../../../libs/types/board-article/board-article.input';
import { BoardArticle } from '../../../libs/types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../../libs/enums/board-article.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { BoardArticleUpdate } from '../../../libs/types/board-article/board-article.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOARD_ARTICLE_BY_ADMIN, UPDATE_BOARD_ARTICLE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { Button } from '@mui/material';

const AdminCommunity: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [communityInquiry, setCommunityInquiry] = useState<AllBoardArticlesInquiry>(initialInquiry);
	const [articles, setArticles] = useState<BoardArticle[]>([]);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [value, setValue] = useState(
		communityInquiry?.search?.articleStatus ? communityInquiry?.search?.articleStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateBoardArticleByAdmin] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
	const [removeBoardArticleByAdmin] = useMutation(REMOVE_BOARD_ARTICLE_BY_ADMIN);

	const {
		loading: getAllBoardArticlesByAdminLoading,
		data: getAllBoardArticlesByAdminData,
		error: getAllBoardArticlesByAdminError,
		refetch: getAllBoardArticlesByAdminRefetch,
	} = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: communityInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getAllBoardArticlesByAdmin?.list);
			setArticleTotal(data?.getAllBoardArticlesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllBoardArticlesByAdminRefetch({ input: communityInquiry }).then();
	}, [communityInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		communityInquiry.page = newPage + 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		communityInquiry.limit = parseInt(event.target.value, 10);
		communityInquiry.page = 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setCommunityInquiry({ ...communityInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setCommunityInquiry({ ...communityInquiry, search: { articleStatus: BoardArticleStatus.ACTIVE } });
				break;
			case 'DELETE':
				setCommunityInquiry({ ...communityInquiry, search: { articleStatus: BoardArticleStatus.DELETE } });
				break;
			default:
				delete communityInquiry?.search?.articleStatus;
				setCommunityInquiry({ ...communityInquiry });
				break;
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setCommunityInquiry({
					...communityInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...communityInquiry.search,
						articleCategory: newValue as BoardArticleCategory,
					},
				});
			} else {
				delete communityInquiry?.search?.articleCategory;
				setCommunityInquiry({ ...communityInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateArticleHandler = async (updateData: BoardArticleUpdate) => {
		try {
			await updateBoardArticleByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const removeArticleHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeBoardArticleByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	console.log('+communityInquiry', communityInquiry);
	console.log('+articles', articles);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Arricle List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'} sx={{ display: 'flex', flexDirection: 'row', gap: '10px', mb: 3 }}>
								<ListItem
									onClick={(e: T) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'ALL' ? '#1a1f36' : 'transparent',
										color: value === 'ALL' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'ALL' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: T) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'ACTIVE' ? '#1a1f36' : 'transparent',
										color: value === 'ACTIVE' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'ACTIVE' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: T) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'DELETE' ? '#1a1f36' : 'transparent',
										color: value === 'DELETE' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'DELETE' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(BoardArticleCategory).map((category: string) => (
										<MenuItem value={category} onClick={() => searchTypeHandler(category)} key={category}>
											{category}
										</MenuItem>
									))}
								</Select>

								<Button
									variant="contained"
									color="primary"
									startIcon={<AddCircleRoundedIcon />}
									sx={{ height: '56px', borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
									onClick={() => console.log('Add Article Clicked')}
								>
									Add Article
								</Button>
							</Stack>
							<Divider />
						</Box>
						<CommunityCardGrid
							articles={articles}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateArticleHandler={updateArticleHandler}
							removeArticleHandler={removeArticleHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={articleTotal}
							rowsPerPage={communityInquiry?.limit}
							page={communityInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminCommunity.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminCommunity);