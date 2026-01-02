import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Badge from '@mui/material/Badge';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar, cartVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

import MiniBasket from './MiniBasket';

const Top = () => {
	const device = useDeviceDetect();
	// const user = useReactiveVar(userVar);
	const user = {
		_id: 'mock_id',
		memberNick: 'Mock User',
		memberImage: '',
		memberType: 'AGENT',
	};
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const cartCount = useReactiveVar(cartVar);
	const [hoverBasket, setHoverBasket] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langChoice = useCallback(
		async (locale: string) => {
			setLang(locale);
			localStorage.setItem('locale', locale);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: locale });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 40) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const toggleSearch = () => {
		setSearchOpen(!searchOpen);
	};

	const handleSearch = () => {
		if (searchQuery.trim()) {
			router.push({
				pathname: '/shop',
				query: { text: searchQuery },
			});
			setSearchOpen(false);
			setSearchQuery('');
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/about'}>
					<div>{t('About')}</div>
				</Link>
				<Link href={'/shop'}>
					<div> {t('Shop')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Blog')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('Contact')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`topbar ${colorChange ? 'hide' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'topbar-left'}>
							<MailOutlineOutlinedIcon className={'icon'} />
							<span>nxshoez@webflow.com</span>
							<LocalPhoneOutlinedIcon className={'icon'} />
							<span>+555 555 5555</span>
						</Box>
						<Box component={'div'} className={'topbar-right'}>
							<Link href={'/property'}>
								<div className={'on-sale'}>
									<span>On Sale</span>
									<WhatshotIcon className={'icon-fire'} />
								</div>
							</Link>
						</Box>
					</Stack>
				</Stack>
				<Stack
					className={`navbar-main ${colorChange ? 'sticky' : ''} ${bgColor ? 'transparent' : ''}`}
				>
					<Stack className={'container'}>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className="nav-link">
									<span className="nav-text">{t('Home')}</span>
									<span className="nav-text-hover">{t('Home')}</span>
								</div>
							</Link>
							<Link href={'/about'}>
								<div className="nav-link">
									<span className="nav-text">{t('About')}</span>
									<span className="nav-text-hover">{t('About')}</span>
								</div>
							</Link>
							<Link href={'/shop'}>
								<div className="nav-link">
									<span className="nav-text">{t('Shop')}</span>
									<span className="nav-text-hover">{t('Shop')}</span>
								</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className="nav-link">
									<span className="nav-text">{t('Blog')}</span>
									<span className="nav-text-hover">{t('Blog')}</span>
								</div>
							</Link>
							<Link href={'/cs'}>
								<div className="nav-link">
									<span className="nav-text">{t('Contact')}</span>
									<span className="nav-text-hover">{t('Contact')}</span>
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'logo-box center'}>
							<Link href={'/'}>
								<div className={'logo-text'}>
									<img
										src="/img/logo/logoText.svg"
										alt="ShoeZ"
										style={{ width: 'auto', height: '40px' }}
									/>
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							<div onClick={(e: any) => setAnchorEl2(e.currentTarget)}>
								<img
									className={'img-flag'}
									src={lang ? `/img/flag/lang${lang}.png` : '/img/flag/langen.png'}
									alt={'lang'}
									style={{ width: 30, height: 20, cursor: 'pointer' }}
								/>
							</div>
							<Menu
								anchorEl={anchorEl2}
								open={drop}
								onClose={() => setAnchorEl2(null)}
								sx={{ mt: '5px' }}
							>
								<MenuItem onClick={() => langChoice('en')}>
									<img
										className={'img-flag'}
										src={'/img/flag/langen.png'}
										onClick={() => langChoice('en')}
										alt={'usa'}
										style={{ width: 30, height: 20, marginRight: 10 }}
									/>
									English
								</MenuItem>
								<MenuItem onClick={() => langChoice('kr')}>
									<img
										className={'img-flag'}
										src={'/img/flag/langkr.png'}
										onClick={() => langChoice('kr')}
										alt={'korea'}
										style={{ width: 30, height: 20, marginRight: 10 }}
									/>
									Korean
								</MenuItem>
								<MenuItem onClick={() => langChoice('ru')}>
									<img
										className={'img-flag'}
										src={'/img/flag/langru.png'}
										onClick={() => langChoice('ru')}
										alt={'russia'}
										style={{ width: 30, height: 20, marginRight: 10 }}
									/>
									Russian
								</MenuItem>
							</Menu>
							<div onClick={toggleSearch} style={{ cursor: 'pointer' }}>
								<SearchIcon className={'icon'} />
							</div>
							<div
								className="basket-hover-wrapper"
								style={{ position: 'relative' }}
								onMouseEnter={() => setHoverBasket(true)}
								onMouseLeave={() => setHoverBasket(false)}
							>
								<Box component={'div'} className={'basket-icon'} style={{ cursor: 'pointer' }}>
									<Badge color="error" badgeContent={cartCount} overlap="circular">
										<ShoppingCartOutlinedIcon className={'icon'} />
									</Badge>
								</Box>
								<MiniBasket open={hoverBasket} setOpen={setHoverBasket} />
							</div>
							{user?._id ? (
								<>
									<div
										className={'login-user'}
										onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
									>
										<img
											src={
												user?.memberImage
													? `${REACT_APP_API_URL}/${user?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem
											onClick={() => {
												router.push('/mypage');
												setLogoutAnchor(null);
											}}
										>
											<AccountCircleOutlinedIcon
												fontSize="small"
												style={{ color: 'blue', marginRight: '10px' }}
											/>
											My Profile
										</MenuItem>
										<MenuItem onClick={() => logOut()}>
											<Logout
												fontSize="small"
												style={{ color: 'blue', marginRight: '10px' }}
											/>
											Leave
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<AccountCircleOutlinedIcon className={'icon'} />
								</Link>
							)}
						</Box>
					</Stack>
				</Stack>

				{/* Search Overlay */}
				<div className={`search-overlay ${searchOpen ? 'open' : ''}`}>
					<div className="search-content">
						<SearchIcon className="search-icon" onClick={handleSearch} />
						<input
							type="text"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSearch();
							}}
						/>
						<div className="close-btn" onClick={toggleSearch}>
							&#10005;
						</div>
					</div>
				</div>
			</Stack>
		);
	}
};

export default withRouter(Top);