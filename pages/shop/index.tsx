import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const [cartOpen, setCartOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [page, setPage] = useState(1);
	const device = useDeviceDetect();
	const router = useRouter();

	const products = [
		{
			id: 1,
			name: 'Eclipse Stride',
			category: 'Oxford',
			price: 95.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b7275dbb9d61e703400_6407.jpg',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b78071e059bd3c75642_7555.webp'
			],
			sale: true
		},
		{
			id: 2,
			name: 'LunarPulse',
			category: 'Oxford',
			price: 80.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a75e19c88e19a53ed79_10847.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a7f0c66f75a12299835_10980.webp'
			],
			sale: true
		},
		{
			id: 3,
			name: 'Luxe Vista',
			category: 'Loafers',
			price: 62.50,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef5075a8040d3a222349d4_101515.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef58a597574d9bb64d67bb_mikhail-tyrsyna-R8IfCCtAweE-unsplash.webp'
			],
			sale: true
		},
		{
			id: 4,
			name: 'Mystic Glide',
			category: 'Oxford',
			price: 95.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65eeff58834a0e1c401e23c8_37552.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef5075a8040d3a222349d4_101515.webp'
			],
			sale: true
		},
		{
			id: 5,
			name: 'Nebula Nectar',
			category: 'Oxford',
			price: 80.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef50a9e0db5d8eafa37f7e_%E2%80%94Pngtree%E2%80%94men%27s%20shoes%20sports%20shoes_6784833.png',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f496d214cdaa244dc53141_Shoe%20Black.webp'
			],
			sale: true
		},
		{
			id: 6,
			name: 'NovaGrip Blaze',
			category: 'Oxford',
			price: 95.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef50b0a5118a45e8b8163e_pngwing.com%20(3).webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b93377b625d5d019456_3993.webp'
			],
			sale: true
		},
		{
			id: 7,
			name: 'Rogue Rhythm',
			category: 'Oxford',
			price: 210.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65e80455799429dd369e5809_23442.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65e804591bd6c4851877d823_691.webp'
			],
			sale: true
		},
		{
			id: 8,
			name: 'Serene Sole',
			category: 'Loafers',
			price: 95.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65eeff68809007162783fd79_1093.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65aebff57a4070d781987d83_wengang-zhai-_fOL6ebfECQ-unsplash.jpg'
			],
			sale: true
		},
		{
			id: 9,
			name: 'SprintWave',
			category: 'Loafers',
			price: 95.00,
			images: [
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a26ebd39df85e9e00a4_619.webp',
				'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a2d74e889325c53532d_2078.webp'
			],
			sale: true
		}
	];

	const { text } = router.query;
	const filteredProducts = products.filter((product) => {
		if (!text) return true;
		const searchText = String(text).toLowerCase();
		return (
			product.name.toLowerCase().includes(searchText) ||
			product.category.toLowerCase().includes(searchText)
		);
	});


	const categories = [
		'Sneakers',
		'Loafers',
		'Boots',
		'Oxford',
		'Formal',
		'Turfs',
		'High Neck',
		'Sports Shoe'
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
											<Link href={`/category/${category.toLowerCase().replace(' ', '-')}`}>
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
									{filteredProducts.slice((page - 1) * 6, page * 6).map((product, index) => (
										<div key={product.id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
											<div className="product-image-wrapper">
												<img src={product.images[0]} alt={product.name} className="product-image main" />
												<img src={product.images[1]} alt={product.name} className="product-image hover" />
												<div className="product-overlay">
													<button className="view-product-btn" onClick={() => router.push(`/shop/detail?id=${product.id}`)}>
														View Product
													</button>
												</div>
												{product.sale && <span className="sale-badge">Sale</span>}
											</div>
											<div className="product-info">
												<h3 className="product-name">{product.name}</h3>
												<Link href={`/category/${product.category.toLowerCase()}`} className="product-category">
													{product.category}
												</Link>
												<p className="product-price">$ {product.price.toFixed(2)} USD</p>
											</div>
										</div>
									))}
								</div>

								<div className="pagination">
									<div className="pagination-box">
										<button
											className="pagination-btn"
											onClick={() => setPage((p) => Math.max(1, p - 1))}
											disabled={page === 1}
										>
											<KeyboardArrowLeftRoundedIcon />
										</button>
										<span className="pagination-info">
											{page} of {Math.max(1, Math.ceil(filteredProducts.length / 6))}
										</span>
										<button
											className="pagination-btn"
											onClick={() => setPage((p) => Math.min(Math.ceil(filteredProducts.length / 6), p + 1))}
											disabled={page === Math.ceil(filteredProducts.length / 6)}
										>
											<KeyboardArrowRightRoundedIcon />
										</button>
									</div>
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
