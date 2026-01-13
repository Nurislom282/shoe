import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
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
			squaresRange: { start: 0, end: 500 },
			pricesRange: { start: 0, end: 2000000 },
		},
	});
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const device = useDeviceDetect();
	const router = useRouter();
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
		if (router.query.page || router.query.category || router.query.text) {
			const { page, category, text } = router.query;
			const newFilter = { ...filter, page: Number(page) || 1 };

			if (category) {
				const categoryStr = String(category);
				let typeList: ProductType[] | undefined;
				let searchText: string | undefined;

				switch (categoryStr) {
					case 'Sneakers':
						typeList = [ProductType.SNEAKER];
						break;
					case 'Boots':
						typeList = [ProductType.BOOT];
						break;
					case 'Sandals':
						typeList = [ProductType.SANDAL];
						break;
					case 'Shoes':
						typeList = [ProductType.SHOE];
						break;
					default:
						searchText = categoryStr;
						break;
				}

				newFilter.search = {
					...newFilter.search,
					typeList,
					text: searchText,
				};
			} else {
				// If category is removed from URL, clear typeList and text from filter.search
				newFilter.search = {
					...newFilter.search,
					typeList: undefined,
					text: undefined,
				};
			}

			if (text) {
				newFilter.search.text = String(text);
			}

			setFilter(newFilter);
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
	];

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
		return <h1>PROPERTIES MOBILE</h1>;
	} else {
		return (
			<div className="shop-page">
				{/* Hero Section */}
				<section className="shop-hero">
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
								<h2>Categories</h2>
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
							</aside>

							{/* Products Grid */}
							<div className="products-section">
								<div className="products-grid">
									{products.length > 0 ? (
										products.map((product, index) => (
											<div key={product._id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
												<div className="product-image-wrapper">
													<img
														src={`${REACT_APP_API_URL}/${product.productImages[0]}`}
														alt={product.productTitle}
														className="product-image main"
													/>
													<img
														src={`${REACT_APP_API_URL}/${product.productImages[1] || product.productImages[0]}`}
														alt={product.productTitle}
														className="product-image hover"
													/>
													<div className="product-overlay">
														<button
															className="view-product-btn"
															onClick={() => router.push(`/shop/detail?id=${product._id}`)}
														>
															View Product
														</button>
													</div>
													{/* {product.sale && <span className="sale-badge">Sale</span>} */}
												</div>
												<div className="product-info">
													<h3 className="product-name">{product.productTitle}</h3>
													<div className="product-category">{product.productType}</div>
													<p className="product-price">$ {product.productPrice.toLocaleString()} USD</p>
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
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(PropertyList);
