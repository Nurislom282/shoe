import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { PropertyCardGrid } from '../../../libs/components/admin/properties/PropertyCardGrid';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AllPropertiesInquiry } from '../../../libs/types/property/property.input';
import { Property } from '../../../libs/types/property/property';
import { PropertyLocation, PropertyStatus } from '../../../libs/enums/property.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { PropertyUpdate } from '../../../libs/types/property/property.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_PROPERTY_BY_ADMIN, UPDATE_PROPERTY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_PROPERTIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { Button } from '@mui/material';

const AdminProperties: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [propertiesInquiry, setPropertiesInquiry] = useState<AllPropertiesInquiry>(initialInquiry);
	const [properties, setProperties] = useState<Property[]>([]);
	const [propertiesTotal, setPropertiesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		propertiesInquiry?.search?.propertyStatus ? propertiesInquiry?.search?.propertyStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updatePropertyByAdmin] = useMutation(UPDATE_PROPERTY_BY_ADMIN);
	const [removePropertyByAdmin] = useMutation(REMOVE_PROPERTY_BY_ADMIN);

	const {
		loading: getAllPropertiesByAdminLoading,
		data: getAllPropertiesByAdminData,
		error: getAllPropertiesByAdminError,
		refetch: getAllPropertiesByAdminRefetch,
	} = useQuery(GET_ALL_PROPERTIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: propertiesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getAllPropertiesByAdmin?.list);
			setPropertiesTotal(data?.getAllPropertiesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllPropertiesByAdminRefetch({ input: propertiesInquiry }).then();
	}, [propertiesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		propertiesInquiry.page = newPage + 1;
		await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
		setPropertiesInquiry({ ...propertiesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		propertiesInquiry.limit = parseInt(event.target.value, 10);
		propertiesInquiry.page = 1;
		await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
		setPropertiesInquiry({ ...propertiesInquiry });
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

		setPropertiesInquiry({ ...propertiesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setPropertiesInquiry({ ...propertiesInquiry, search: { propertyStatus: PropertyStatus.ACTIVE } });
				break;
			case 'SOLD':
				setPropertiesInquiry({ ...propertiesInquiry, search: { propertyStatus: PropertyStatus.SOLD } });
				break;
			case 'DELETE':
				setPropertiesInquiry({ ...propertiesInquiry, search: { propertyStatus: PropertyStatus.DELETE } });
				break;
			default:
				delete propertiesInquiry?.search?.propertyStatus;
				setPropertiesInquiry({ ...propertiesInquiry });
				break;
		}
	};

	const removePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removePropertyByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
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
				setPropertiesInquiry({
					...propertiesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...propertiesInquiry.search,
						propertyLocationList: [newValue as PropertyLocation],
					},
				});
			} else {
				delete propertiesInquiry?.search?.propertyLocationList;
				setPropertiesInquiry({ ...propertiesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updatePropertyHandler = async (updateData: PropertyUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updatePropertyByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Product Management</Typography>
			</Box>
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
									{Object.values(PropertyLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
								<Button
									variant="contained"
									color="primary"
									sx={{ height: '56px', borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
									onClick={() => console.log('Add Property Clicked')}
								>
									<AddRoundedIcon sx={{ mr: '8px' }} />
									ADD PRODUCT
								</Button>
							</Stack>
							<Divider />
						</Box>
						<PropertyCardGrid
							properties={properties}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updatePropertyHandler={updatePropertyHandler}
							removePropertyHandler={removePropertyHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={propertiesTotal}
							rowsPerPage={propertiesInquiry?.limit}
							page={propertiesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminProperties.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminProperties);