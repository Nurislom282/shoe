import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { NoticeCardGrid } from '../../../libs/components/admin/cs/NoticeCardGrid';
import { T } from '../../../libs/types/common';

const AdminNotice: NextPage = (props: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [value, setValue] = useState('all');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/
	const handleTabChange = (event: any, newValue: string) => {
		setValue(newValue);
	};

	const mockNotices = [
		{
			_id: '1',
			noticeCategory: 'System',
			noticeTitle: 'Scheduled Maintenance',
			noticeContent: 'We will be down for maintenance.',
			noticeStatus: 'ACTIVE',
			createdAt: new Date().toISOString(),
			mb_id: 'admin1',
			mb_nick: 'SysAdmin',
			views: 120
		},
		{
			_id: '2',
			noticeCategory: 'Event',
			noticeTitle: 'New Year Event!',
			noticeContent: 'Join us for the event.',
			noticeStatus: 'ACTIVE',
			createdAt: new Date().toISOString(),
			mb_id: 'admin2',
			mb_nick: 'Marketing',
			views: 350
		},
		{
			_id: '3',
			noticeCategory: 'Update',
			noticeTitle: 'Policy Updates',
			noticeContent: 'Please read our new terms.',
			noticeStatus: 'ACTIVE',
			createdAt: new Date().toISOString(),
			mb_id: 'admin1',
			mb_nick: 'Legal',
			views: 50
		}
	];

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>

			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: T) => handleTabChange(e, 'all')}
									value="all"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'all' ? '#1a1f36' : 'transparent',
										color: value === 'all' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'all' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									All (0)
								</ListItem>
								<ListItem
									onClick={(e: T) => handleTabChange(e, 'active')}
									value="active"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'active' ? '#1a1f36' : 'transparent',
										color: value === 'active' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'active' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Active (0)
								</ListItem>
								<ListItem
									onClick={(e: T) => handleTabChange(e, 'blocked')}
									value="blocked"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'blocked' ? '#1a1f36' : 'transparent',
										color: value === 'blocked' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'blocked' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Blocked (0)
								</ListItem>
								<ListItem
									onClick={(e: T) => handleTabChange(e, 'deleted')}
									value="deleted"
									sx={{
										width: 'auto',
										borderRadius: '20px',
										cursor: 'pointer',
										bgcolor: value === 'deleted' ? '#1a1f36' : 'transparent',
										color: value === 'deleted' ? '#fff' : '#64748b',
										px: 3,
										py: 1,
										'&:hover': { bgcolor: value === 'deleted' ? '#1a1f36' : '#f1f5f9' }
									}}
								>
									Deleted (0)
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
								<Stack direction="row" alignItems="center">
									<Select sx={{ width: '160px', mr: '20px' }} value={'searchCategory'}>
										<MenuItem value={'mb_nick'}>mb_nick</MenuItem>
										<MenuItem value={'mb_id'}>mb_id</MenuItem>
									</Select>

									<OutlinedInput
										value={'searchInput'}
										sx={{ width: '300px' }}
										className={'search'}
										placeholder="Search user name"
										endAdornment={
											<>
												{true && <CancelRoundedIcon onClick={() => { }} />}
												<InputAdornment position="end" onClick={() => { }}>
													<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
												</InputAdornment>
											</>
										}
									/>
								</Stack>
								<Button
									className="btn_add"
									variant={'contained'}
									size={'medium'}
									sx={{ height: '56px', borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
								>
									<AddRoundedIcon sx={{ mr: '8px' }} />
									ADD NOTICE
								</Button>
							</Stack>
							<Divider />
						</Box>
						<NoticeCardGrid
							notices={mockNotices} // Use mock data for verification
							anchorEl={anchorEl}
							menuIconClickHandler={() => { }}
							menuIconCloseHandler={() => { }}
							updateNoticeHandler={() => { }}
							removeNoticeHandler={() => { }}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={4}
							rowsPerPage={10}
							page={1}
							onPageChange={() => { }}
							onRowsPerPageChange={() => { }}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminNotice);
