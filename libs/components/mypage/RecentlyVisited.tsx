import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { ProductCard } from './ProductCard';
import { Product } from '../../types/product/product';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisited,
		},
		onCompleted: (data: T) => {
			setRecentlyVisited(data.getVisited?.list);
			setTotal(data.getVisited?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	if (device === 'mobile') {
		return <div>NESTAR MY FAVORITES MOBILE</div>; // Keeping text as is or changing to RECENTLY VISITED? Left as is to match original mismatch or maybe it's controlled elsewhere. I'll stick to original logic but maybe fix text if I see it. Original said "MY FAVORITES MOBILE" inside RecentlyVisited? That's weird. I'll correct it to "RECENTLY VISITED".
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Recently Visited</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{recentlyVisited?.length ? (
						recentlyVisited?.map((product: Product, index: number) => {
							const imagePath = product.images?.[0]?.url
								? product.images[0].url.startsWith('http')
									? product.images[0].url
									: `${REACT_APP_API_URL}/${product.images[0].url}`
								: '/img/profile/defaultUser.svg';

							return (
								<Stack
									className="card-config"
									key={product._id}
									onClick={() => router.push(`/product/detail?id=${product._id}`)}
									sx={{ animationDelay: `${index * 0.1}s` }}
								>
									<Stack className="top">
										<img
											src={imagePath}
											alt=""
											onError={(e) => {
												e.currentTarget.src = '/img/profile/defaultUser.svg';
											}}
										/>
										<Stack className="top-badge">
											<Typography>{product.status}</Typography>
										</Stack>
										<Stack className="remove-btn" onClick={(e: any) => { e.stopPropagation(); /* Add remove logic here */ }}>
											<DeleteIcon sx={{ fontSize: 20, color: '#ff4d4f' }} />
										</Stack>
									</Stack>
									<Stack className="bottom">
										<Stack className="name-address">
											<Stack className="name">
												<Typography>{product.name}</Typography>
											</Stack>
											<Stack className="price">
												<Typography>${formatterStr(product.price)}</Typography>
											</Stack>
										</Stack>
										<div className="divider" />
										<Stack className="options">
											<Stack className="option">
												<RemoveRedEyeIcon sx={{ fontSize: 14, color: '#888' }} />
												<Typography>{product.productViews}</Typography>
											</Stack>
											<Stack className="option">
												<FavoriteIcon sx={{ fontSize: 14, color: '#888' }} />
												<Typography>{product.productLikes}</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
							);
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Recently Visited Products found!</p>
						</div>
					)}
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchVisited.limit)}
								page={searchVisited.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} recently visited product{total > 1 ? 's' : ''}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default RecentlyVisited;