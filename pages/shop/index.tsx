import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography, Slider, Checkbox, FormControlLabel, SwipeableDrawer, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { ProductType } from '../../libs/enums/product.enum';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const [cartOpen, setCartOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [filter, setFilter] = useState<ProductsInquiry>({
		page: 1,
		limit: 6,
		sort: "createdAt",
		direction: Direction.DESC,
		search: {
			pricesRange: { start: 0, end: 2000 },
		},
	});
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const device = useDeviceDetect();
	const router = useRouter();

	// New State for Filters
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
	const [seasons, setSeasons] = useState({
		Spring: false,
		Summer: false,
		Autumn: false,
		Winter: false,
	});
	const [onSale, setOnSale] = useState(false);

	const {
		loading,
		data,
		error,
		refetch: refetchProducts,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: filter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setProducts(data?.getProducts?.list || []);
			setTotal(data?.getProducts?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (router.query.page || router.query.category || router.query.text || router.query.minPrice || router.query.seasons || router.query.sale) {
			const { page, category, text, minPrice, maxPrice, seasons: seasonsQuery, sale } = router.query;
			console.log('DEBUG: Shop useEffect query:', router.query);
			setFilter((prevFilter: ProductsInquiry) => {
				const newFilter = { ...prevFilter, page: Number(page) || 1 };
				const search = { ...newFilter.search };

				if (category) {
					const categoryStr = String(category);
					let typeList: ProductType[] | undefined;
					let searchText: string | undefined;

					switch (categoryStr) {
						case 'Sneakers':
							typeList = [ProductType.SNEAKERS];
							break;
						case 'Boots':
							typeList = [ProductType.BOOTS];
							break;
						case 'Sandals':
							typeList = [ProductType.SANDALS];
							break;
						case 'Shoes':
							typeList = [ProductType.SHOES];
							break;
						case 'Oxford':
							typeList = [ProductType.OXFORD];
							break;
						case 'Formal':
							typeList = [ProductType.FORMAL];
							break;
						case 'Turfs':
							typeList = [ProductType.TURF];
							break;
						case 'High Neck':
							typeList = [ProductType.HIGH_NECK];
							break;
						case 'Sports Shoe':
							typeList = [ProductType.SPORTS_SHOE];
							break;
						case 'Other':
							typeList = [ProductType.OTHER];
							break;
						default:
							searchText = categoryStr;
							break;
					}

					search.typeList = typeList;
					search.text = searchText;
				} else {
					delete search.typeList;
					delete search.text;
				}

				if (text) {
					search.text = String(text);
				}

				// Price Range
				if (minPrice && maxPrice) {
					search.pricesRange = { start: Math.floor(Number(minPrice)), end: Math.ceil(Number(maxPrice)) };
					setPriceRange([Number(minPrice), Number(maxPrice)]);
				} else {
					search.pricesRange = { start: 0, end: 2000 };
					setPriceRange([0, 2000]);
				}

				// Options (Sale)
				const options: string[] = [];
				if (sale === 'true') {
					options.push('sale');
					setOnSale(true);
				} else {
					setOnSale(false);
				}
				if (options.length > 0) search.options = options;
				else delete search.options;

				// Seasons
				const seasonsList: string[] = [];
				if (seasonsQuery) {
					const sList = String(seasonsQuery).split(',').filter(s => s); // Filter empty strings
					seasonsList.push(...sList);
					const newSeasons = { Spring: false, Summer: false, Autumn: false, Winter: false };
					sList.forEach(s => { if (newSeasons.hasOwnProperty(s)) (newSeasons as any)[s] = true; });
					setSeasons(newSeasons);
				} else {
					setSeasons({ Spring: false, Summer: false, Autumn: false, Winter: false });
				}

				if (seasonsList.length > 0) {
					search.seasons = seasonsList;
				} else {
					delete search.seasons;
				}

				newFilter.search = search;
				console.log('DEBUG: New Filter:', newFilter);
				return newFilter;
			});
		}
	}, [router.query]);

	/** HANDLERS **/
	const handlePaginationChange = (event: ChangeEvent<unknown>, value: number) => {
		router.push(
			{
				pathname: '/shop',
				query: { ...router.query, page: value },
			},
			undefined,
			{ scroll: false }
		);
	};

	const updateQueryParams = (currentSeasons: any, currentPrice: number[], currentSale: boolean) => {
		const query: any = { ...router.query };
		const activeSeasons = Object.keys(currentSeasons).filter(k => currentSeasons[k]);

		if (activeSeasons.length > 0) query.seasons = activeSeasons.join(',');
		else delete query.seasons;

		if (currentSale) query.sale = 'true';
		else delete query.sale;

		query.minPrice = currentPrice[0];
		query.maxPrice = currentPrice[1];
		query.page = 1; // Reset to page 1 on filter change

		router.push({
			pathname: '/shop',
			query: query,
		}, undefined, { scroll: false });
	};

	const handleSeasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newSeasons = { ...seasons, [event.target.name]: event.target.checked };
		setSeasons(newSeasons);
		updateQueryParams(newSeasons, priceRange, onSale);
	};

	const handleSaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOnSale(event.target.checked);
		updateQueryParams(seasons, priceRange, event.target.checked);
	};

	const handlePriceChange = (event: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handlePriceChangeCommitted = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
		updateQueryParams(seasons, newValue as number[], onSale);
	}


	const categories = [
		'Sneakers',
		'Boots',
		'Sandals',
		'Shoes',
		'Oxford',
		'Formal',
		'Turfs',
		'High Neck',
		'Sports Shoe',
		'Other',
	];
	const seasonNames = ['Spring', 'Summer', 'Autumn', 'Winter'];

	const brands = [
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfe_customers_7.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc01_customers_6.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbff_customers_2.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc03_customers_5.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc00_bronx.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfd_customers_8.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc02_customers_4.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfa_customers_9.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfc_customers_1.svg',
		'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbf9_customers_3.svg'
	];

	if (device === 'mobile') {
		return (
			<div className="shop-page">
				{/* Mobile Hero */}
				<section className="shop-hero" style={{
					backgroundImage: `url('/img/banner/shoes.jpg')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
					<div className="hero-content">
						<h1>SHOP</h1>
						<div className="breadcrumb">
							<Link href="/">Home</Link>
							<span>/</span>
							<span>Shop</span>
						</div>
					</div>
				</section>

				{/* Controls */}
				<div className="mobile-controls">
					<button className="filter-btn" onClick={() => setMobileMenuOpen(true)}>
						<FilterListIcon />
						Filter
					</button>
					<div className="result-count">
						{total} Products
					</div>
				</div>

				{/* Products Grid */}
				<div className="products-section">
					<div className="products-grid">
						{products.length > 0 ? (
							products.map((product) => (
								<div
									key={product._id}
									className="product-card"
									onClick={() => router.push(`/product/detail?id=${product._id}`)}
								>
									<div className="product-image-wrapper">
										<img
											src={(() => {
												const url = product.images?.[0]?.url;
												if (!url) return '/img/logo/logoText.svg';
												if (url.startsWith('http')) return url;
												if (url.startsWith('localhost')) return `http://${url}`;
												return `${REACT_APP_API_URL}/${url}`;
											})()}
											alt={product.name}
										/>
										{/* Simple Logic for Sale Badge */}
										{product.price < 100 && <span className="sale-badge">Sale</span>}
									</div>
									<div className="product-info">
										<h3 className="product-name">{product.name}</h3>
										<div className="product-category">{product.category}</div>
										<p className="product-price">$ {product.price.toLocaleString()}</p>
									</div>
								</div>
							))
						) : (
							<div className="no-products">No products found</div>
						)}
					</div>

					<div className="pagination">
						<Pagination
							count={Math.ceil(total / filter.limit)}
							page={filter.page}
							shape="rounded"
							color="primary"
							size="small"
							onChange={handlePaginationChange}
						/>
					</div>
				</div>

				{/* Filter Drawer */}
				<SwipeableDrawer
					anchor="right"
					open={mobileMenuOpen}
					onClose={() => setMobileMenuOpen(false)}
					onOpen={() => setMobileMenuOpen(true)}
					className="mobile-filter-drawer"
				>
					<div style={{ padding: '20px', width: '300px' }}>
						<div className="filter-header">
							<h3>Filters</h3>
							<IconButton onClick={() => setMobileMenuOpen(false)}>
								<CloseIcon />
							</IconButton>
						</div>

						{/* Categories */}
						<div className="filter-section">
							<h4>Categories</h4>
							<ul className="category-list">
								{categories.map((category, index) => (
									<li key={index}>
										<div
											className={router.query.category === category ? 'active' : ''}
											onClick={() => {
												router.push({
													pathname: '/shop',
													query: { ...router.query, page: 1, category: category },
												}, undefined, { scroll: false });
												setMobileMenuOpen(false);
											}}
										>
											{category}
										</div>
									</li>
								))}
							</ul>
						</div>

						{/* Seasons */}
						<div className="filter-section">
							<h4>Seasons</h4>
							<div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column' }}>
								{seasonNames.map((season) => (
									<FormControlLabel
										key={season}
										control={
											<Checkbox
												checked={(seasons as any)[season]}
												onChange={handleSeasonChange}
												name={season}
												size="small"
												sx={{ color: '#ff4757', '&.Mui-checked': { color: '#ff4757' } }}
											/>
										}
										label={season}
									/>
								))}
							</div>
						</div>

						{/* Price */}
						<div className="filter-section">
							<h4>Price Range</h4>
							<Slider
								value={priceRange}
								onChange={handlePriceChange}
								onChangeCommitted={handlePriceChangeCommitted}
								valueLabelDisplay="auto"
								min={0}
								max={2000}
								sx={{ color: '#ff4757' }}
							/>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
								<span>${priceRange[0]}</span>
								<span>${priceRange[1]}</span>
							</div>
						</div>

						{/* Apply Button */}
						<button className="apply-btn" onClick={() => setMobileMenuOpen(false)}>
							Show Results
						</button>
					</div>
				</SwipeableDrawer>
			</div>
		);
	} else {
		return (
			<div className="shop-page">
				{/* Hero Section */}
				<section className="shop-hero" style={{
					backgroundImage: `url('/img/banner/shoes.jpg')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat'
				}}>
					<div className="hero-content">
						<h1 className="page-title">SHOP</h1>
						<div className="breadcrumb">
							<Link href="/">
								<div className="breadcrumb-link">Home</div>
							</Link>
							<span className="breadcrumb-separator">/</span>
							<span>Shop</span>
						</div>
					</div>
				</section>

				{/* Main Content */}
				<main className="main-content">
					<div className="container">
						<div className="shop-layout">
							{/* Sidebar */}
							<aside className="sidebar">
								<div className="sidebar-filter">
									<div className="filter-box">
										<div className="filter-header">Categories</div>
										<ul className="category-list">
											{categories.map((category, index) => (
												<li key={index}>
													<Link
														href={{
															pathname: '/shop',
															query: { page: 1, category: category },
														}}
														scroll={true}
													>
														{category}
														<span className="arrow">»</span>
													</Link>
												</li>
											))}
										</ul>
									</div>

									<div className="filter-box seasons-box">
										<h4 className="filter-title">Seasons</h4>
										<div className="checkbox-group">
											{seasonNames.map((season) => (
												<FormControlLabel
													key={season}
													control={
														<Checkbox
															checked={(seasons as any)[season]}
															onChange={handleSeasonChange}
															name={season}
															size="small"
															sx={{
																color: '#ff4757',
																'&.Mui-checked': {
																	color: '#ff4757',
																},
															}}
														/>
													}
													label={<span className="checkbox-label">{season}</span>}
												/>
											))}
										</div>
									</div>

									<div className="filter-box price-box">
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
											<h4 className="filter-title" style={{ marginBottom: 0 }}>Price Range</h4>
											<FormControlLabel
												control={
													<Checkbox
														checked={onSale}
														onChange={handleSaleChange}
														size="small"
														sx={{
															color: '#ff4757',
															'&.Mui-checked': {
																color: '#ff4757',
															},
														}}
													/>
												}
												label={<span className="checkbox-label" style={{ fontWeight: 600 }}>On Sale</span>}
												labelPlacement="start"
											/>
										</div>

										<div style={{ width: '100%', paddingLeft: '8px', paddingRight: '8px' }}>
											<Slider
												value={priceRange}
												onChange={handlePriceChange}
												onChangeCommitted={handlePriceChangeCommitted}
												valueLabelDisplay="auto"
												min={0}
												max={2000}
												sx={{
													color: '#ff4757',
													'& .MuiSlider-thumb': {
														boxShadow: '0 0 0 8px rgba(255, 71, 87, 0.16)',
													},
												}}
											/>
											<div className="price-inputs">
												<span>${priceRange[0]}</span>
												<span>-</span>
												<span>${priceRange[1]}</span>
											</div>
										</div>
									</div>
								</div>
							</aside>

							{/* Products Grid */}
							<div className="products-section">
								<div className="products-grid">
									{products.length > 0 ? (
										products.map((product, index) => (
											<div key={product._id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
												<div className="product-image-wrapper">
													<img
														src={(() => {
															const url = product.images?.[0]?.url;
															if (!url) return '/img/logo/logoText.svg';
															if (url.startsWith('http')) return url;
															if (url.startsWith('localhost')) return `http://${url}`;
															return `${REACT_APP_API_URL}/${url}`;
														})()}
														alt={product.name}
														className="product-image main"
													/>
													<img
														src={(() => {
															const url = product.images?.[1]?.url || product.images?.[0]?.url;
															if (!url) return '/img/logo/logoText.svg';
															if (url.startsWith('http')) return url;
															if (url.startsWith('localhost')) return `http://${url}`;
															return `${REACT_APP_API_URL}/${url}`;
														})()}
														alt={product.name}
														className="product-image hover"
													/>
													<div className="product-overlay">
														<button
															className="view-product-btn"
															onClick={() => router.push(`/product/detail?id=${product._id}`)}
														>
															View Product
														</button>
													</div>
													{product.status === 'ACTIVE' && false && <span className="sale-badge">Sale</span>}
													{/* Using onSale tag if available, else mocking logic or hiding */}
												</div>
												<div className="product-info">
													<h3 className="product-name">{product.name}</h3>
													<div className="product-category">{product.category}</div>
													<p className="product-price">$ {product.price.toLocaleString()} USD</p>
												</div>
											</div>
										))
									) : (
										<div className="no-products">No products found</div>
									)}
								</div>

								<div className="pagination">
									<Pagination
										count={Math.ceil(total / filter.limit)}
										page={filter.page}
										shape="circular"
										color="primary"
										onChange={handlePaginationChange}
									/>
								</div>
							</div>
						</div>
					</div>
				</main>

				{/* Brands Section */}
				<section className="brands-section">
					<div className="brands-slider">
						{[...brands, ...brands].map((brand, index) => (
							<div key={index} className="brand-item">
								<img src={brand} alt="Brand" />
							</div>
						))}
					</div>
				</section>

			</div>
		)
	}
};

PropertyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000,
			},
		},
	},
};

export default withLayoutBasic(PropertyList);
