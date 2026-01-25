import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { ProductCardGrid } from '../../../libs/components/admin/products/ProductCardGrid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { ProductLocation, ProductStatus } from '../../../libs/enums/product.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { ProductUpdate } from '../../../libs/types/product/product.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_PRODUCT_BY_ADMIN, UPDATE_PRODUCT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { Button } from '@mui/material';

const AdminProducts: NextPage = ({ initialInquiry, ...props }: any) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [productsInquiry, setProductsInquiry] = useState<AllProductsInquiry>(initialInquiry);
	const [products, setProducts] = useState<Product[]>([]);
	const [productsTotal, setProductsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		productsInquiry?.search?.productStatus ? productsInquiry?.search?.productStatus : 'ACTIVE',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
	const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

	const {
		loading: getAllProductsByAdminLoading,
		data: getAllProductsByAdminData,
		error: getAllProductsByAdminError,
		refetch: getAllProductsByAdminRefetch,
	} = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: productsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getAllProductsByAdmin?.list);
			setProductsTotal(data?.getAllProductsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllProductsByAdminRefetch({ input: productsInquiry }).then();
	}, [productsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		productsInquiry.page = newPage + 1;
		await getAllProductsByAdminRefetch({ input: productsInquiry });
		setProductsInquiry({ ...productsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		productsInquiry.limit = parseInt(event.target.value, 10);
		productsInquiry.page = 1;
		await getAllProductsByAdminRefetch({ input: productsInquiry });
		setProductsInquiry({ ...productsInquiry });
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

		setProductsInquiry({ ...productsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.ACTIVE } });
				break;
			case 'SOLD':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.SOLD } });
				break;
			case 'DELETE':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.DELETE } });
				break;
			default:
				delete productsInquiry?.search?.productStatus;
				setProductsInquiry({ ...productsInquiry });
				break;
		}
	};

	const removeProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeProductByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllProductsByAdminRefetch({ input: productsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setProductsInquiry({
					...productsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...productsInquiry.search,
						productLocationList: [newValue as ProductLocation],
					},
				});
			} else {
				delete productsInquiry?.search?.productLocationList;
				setProductsInquiry({ ...productsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateProductHandler = async (updateData: ProductUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateProductByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllProductsByAdminRefetch({ input: productsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<div className={'content'}>
			<div className={'title flex_space'}>
				<Typography variant={'h2'}>Product Management</Typography>
			</div>
			<div className={'table-wrap'}>
				<div style={{ width: '100%' }}>
					<TabContext value={value}>
						<div>
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
									onClick={(e: T) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'SOLD' ? '#1a1f36' : 'transparent',
										color: value === 'SOLD' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'SOLD' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Out of Stock
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
									{Object.values(ProductLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
								<Button
									variant="contained"
									color="primary"
									sx={{ height: '56px', borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
									onClick={() => router.push('/_admin/products/add')}
								>
									<AddRoundedIcon sx={{ mr: '8px' }} />
									ADD PRODUCT
								</Button>
							</Stack>
							<Divider />
						</div>
						<ProductCardGrid
							products={products}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateProductHandler={updateProductHandler}
							removeProductHandler={removeProductHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={productsTotal}
							rowsPerPage={productsInquiry?.limit}
							page={productsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</div>
			</div>
		</div>
	);
};

AdminProducts.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default withAdminLayout(AdminProducts);