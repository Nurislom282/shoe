import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import ArticleIcon from '@mui/icons-material/Article';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyProducts from '../../libs/components/mypage/MyProducts';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddProduct from '../../libs/components/mypage/AddNewProduct';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Messages } from '../../libs/config';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import MemberFollowings from '../../libs/components/member/MemberFollowings';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id: ', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		console.log(id);
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		return (
			<div className="mypage-mobile">
				<div className="profile-header">
					<div className="avatar-wrapper">
						<img src={user.memberImage ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'} alt="" />
						<div className="edit-icon"><EditIcon style={{ fontSize: 14 }} /></div>
					</div>
					<h2>{user.memberNick}</h2>
					<p>{user.memberType}</p>
				</div>

				<div className="stats-row">
					<div className="stat-item">
						<span className="val">{user.memberFollowers}</span>
						<span className="label">Followers</span>
					</div>
					<div className="stat-item">
						<span className="val">{user.memberFollowings}</span>
						<span className="label">Following</span>
					</div>
					<div className="stat-item">
						<span className="val">{user.memberPoints}</span>
						<span className="label">Points</span>
					</div>
				</div>

				<div className="menu-list">
					<div className="menu-item" onClick={() => router.push('/mypage?category=myProfile')}>
						<div className="icon"><PersonIcon /></div>
						<div className="text">My Profile</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=myProducts')}>
						<div className="icon"><StoreIcon /></div>
						<div className="text">My Products</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=writeArticle')}>
						<div className="icon"><EditIcon /></div>
						<div className="text">Write Article</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=myArticles')}>
						<div className="icon"><ArticleIcon /></div>
						<div className="text">My Articles</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=myFavorites')}>
						<div className="icon"><FavoriteIcon /></div>
						<div className="text">My Favorites</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=recentlyVisited')}>
						<div className="icon"><HistoryIcon /></div>
						<div className="text">Recently Visited</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=followers')}>
						<div className="icon"><GroupIcon /></div>
						<div className="text">Followers</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
					<div className="menu-item" onClick={() => router.push('/mypage?category=followings')}>
						<div className="icon"><GroupIcon /></div>
						<div className="text">Followings</div>
						<div className="arrow"><ArrowForwardIosIcon style={{ fontSize: 12 }} /></div>
					</div>
				</div>

				{/* Basic implementation for sub-pages if category is present */}
				{category && category !== 'myProfile' && (
					<div className="mobile-subpage-content" style={{ padding: '20px' }}>
						{/* Reusing existing components but wrapped for mobile padding */}
						{category === 'addProduct' && <AddProduct />}
						{category === 'myProducts' && <MyProducts />}
						{category === 'myFavorites' && <MyFavorites />}
						{category === 'recentlyVisited' && <RecentlyVisited />}
						{category === 'myArticles' && <MyArticles />}
						{category === 'writeArticle' && <WriteArticle />}
						{category === 'followers' && (
							<MemberFollowers
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
								likeMemberHandler={likeMemberHandler}
							/>
						)}
						{category === 'followings' && (
							<MemberFollowings
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
								likeMemberHandler={likeMemberHandler}
							/>
						)}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{category === 'addProduct' && <AddProduct />}
									{category === 'myProducts' && <MyProducts />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
											likeMemberHandler={likeMemberHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
											likeMemberHandler={likeMemberHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);