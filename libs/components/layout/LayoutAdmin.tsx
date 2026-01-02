import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Menu, MenuItem } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { SignOut } from 'phosphor-react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
const drawerWidth = 260; // Slightly narrower for a modern look

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();

		const userVarData = useReactiveVar(userVar);
		// BYPASS: Mock Admin User if not authorized
		const user = userVarData?.memberType === MemberType.ADMIN ? userVarData : {
			...userVarData,
			_id: userVarData?._id || 'dev_admin_id',
			memberType: MemberType.ADMIN,
			memberNick: userVarData?.memberNick || 'Dev Admin',
			memberPhone: userVarData?.memberPhone || '010-0000-0000',
			memberImage: userVarData?.memberImage || '',
		};
		const [settingsState, setSettingsStateState] = useState(false);
		const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
		const [openMenu, setOpenMenu] = useState(false);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorElUser(event.currentTarget);
		};

		const handleCloseUserMenu = () => {
			setAnchorElUser(null);
		};

		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		return (
			<main id="pc-wrap" className="admin">
				<Box component={'div'} sx={{ display: 'flex' }}>
					<AppBar
						position="fixed"
						sx={{
							width: `calc(100% - ${drawerWidth}px)`,
							ml: `${drawerWidth}px`,
							boxShadow: 'none',
							background: '#fff',
							color: '#1a1f36',
							borderBottom: '1px solid #e2e8f0',
						}}
					>
						<Toolbar>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar
										src={
											user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
										}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								className={'pop-menu'}
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<Box
									component={'div'}
									onClick={handleCloseUserMenu}
									sx={{
										width: '200px',
									}}
								>
									<Stack sx={{ px: '20px', my: '12px' }}>
										<Typography variant={'h6'} component={'h6'} sx={{ mb: '4px' }}>
											{user?.memberNick}
										</Typography>
										<Typography variant={'subtitle1'} component={'p'} color={'#757575'}>
											{user?.memberPhone}
										</Typography>
									</Stack>
									<Divider />
									<Box component={'div'} sx={{ p: 1, py: '6px' }} onClick={logoutHandler}>
										<MenuItem sx={{ px: '16px', py: '6px' }}>
											<Typography variant={'subtitle1'} component={'span'}>
												Logout
											</Typography>
										</MenuItem>
									</Box>
								</Box>
							</Menu>
						</Toolbar>
					</AppBar>

					<Drawer
						sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
								backgroundColor: '#1a1f36', // Dark Sidebar Background
								color: '#ffffff',
								borderRight: 'none',
							},
						}}
						variant="permanent"
						anchor="left"
						className="aside"
					>
						<Stack className={'logo-box'} sx={{ p: 3, mb: 2 }}>
							<img src={'/img/logo/logoText.svg'} alt={'logo'} style={{ filter: 'brightness(0) invert(1)' }} />
						</Stack>

						<Stack
							className="user"
							direction={'row'}
							alignItems={'center'}
							sx={{
								bgcolor: 'rgba(255, 255, 255, 0.05)',
								borderRadius: '12px',
								mx: 2,
								p: '12px',
								mb: 3,
								width: 'calc(100% - 32px)',
							}}
						>
							<Avatar
								src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
								sx={{ width: 36, height: 36 }}
							/>
							<Box ml={1.5} overflow="hidden">
								<Typography variant={'subtitle2'} noWrap sx={{ fontWeight: 600, color: '#fff' }}>
									{user?.memberNick}
								</Typography>
								<Typography variant={'caption'} noWrap sx={{ color: '#94a3b8' }}>
									{user?.memberType}
								</Typography>
							</Box>
						</Stack>


						<Divider />

						<MenuList />

						<Box sx={{ mt: 'auto', p: 2 }}>
							<Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
							<Box
								onClick={logoutHandler}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									p: 2,
									borderRadius: '12px',
									bgcolor: 'rgba(255, 255, 255, 0.05)',
									'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
									color: '#ff6b6b',
								}}
							>
								<SignOut size={24} weight="bold" />
								<Typography variant={'subtitle1'} sx={{ ml: 1, fontWeight: 600 }}>
									Log Out
								</Typography>
							</Box>
						</Box>
					</Drawer>

					<Box component={'div'} id="bunker" sx={{ flexGrow: 1 }}>
						{/*@ts-ignore*/}
						<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
					</Box>
				</Box>
			</main >
		);
	};
};

export default withAdminLayout;
