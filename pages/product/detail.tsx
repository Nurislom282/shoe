import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar, cartItemsVar, cartVar } from '../../apollo/store';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import Adds from '../../libs/components/homepage/adds';
import Swal from 'sweetalert2';
import { GET_PRODUCT } from '../../apollo/user/query';
import { Product } from '../../libs/types/product/product';
import { REACT_APP_API_URL } from '../../libs/config';
import { ProductStatus } from '../../libs/enums/product.enum';
import { Box, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { id } = router.query;
	const [activeTab, setActiveTab] = useState('description');
	const [quantity, setQuantity] = useState(1);
	const [activeImage, setActiveImage] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [product, setProduct] = useState<Product | null>(null);

	/** APOLLO REQUESTS **/
	const {
		loading,
		data,
		error,
		refetch: refetchProduct,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: id as string },
		skip: !id,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			if (data?.getProduct) {
				setProduct(data.getProduct);
			}
		},
	});

	if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}>Loading...</Box>;
	if (error || !product) return <Box sx={{ p: 5, textAlign: 'center' }}>Product not found!</Box>;

	const handleAddToCart = () => {
		const currentItems = cartItemsVar();
		const existingItemIndex = currentItems.findIndex((item) => item.id === product._id);

		let newItems;
		if (existingItemIndex > -1) {
			newItems = [...currentItems];
			newItems[existingItemIndex] = {
				...newItems[existingItemIndex],
				quantity: newItems[existingItemIndex].quantity + quantity,
			};
		} else {
			newItems = [
				...currentItems,
				{
					id: product._id,
					quantity: quantity,
					price: product.productPrice,
					image: product.productImages?.[0] || '',
					name: product.productTitle,
				},
			];
		}

		cartItemsVar(newItems);
		cartVar(newItems.reduce((acc, item) => acc + item.quantity, 0));

		Swal.fire({
			icon: 'success',
			title: 'Added to cart!',
			text: `${quantity} pair(s) added.`,
			showConfirmButton: false,
			timer: 1500,
		});
	};

	return (
		<div id="product-detail-page">
			<div className="container">
				{/* Breadcrumb */}
				<div className="breadcrumb animate-fade-in-down">
					<Link href="/">
						<div className="breadcrumb-link">Home</div>
					</Link>
					<span className="separator">{'>'}</span>
					<span>{product.productTitle}</span>
				</div>

				{/* Main Product Section */}
				<div className="product-main animate-fade-in-up">
					{/* Left Column - Images */}
					<div className="image-gallery">
						<div
							className="main-image"
							onClick={() => setIsOpen(true)}
							onMouseMove={(e) => {
								const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
								const x = ((e.clientX - left) / width) * 100;
								const y = ((e.clientY - top) / height) * 100;
								const img = e.currentTarget.querySelector('img');
								if (img) {
									img.style.transformOrigin = `${x}% ${y}%`;
									img.style.transform = 'scale(2)';
								}
							}}
							onMouseLeave={(e) => {
								const img = e.currentTarget.querySelector('img');
								if (img) {
									img.style.transformOrigin = 'center center';
									img.style.transform = 'scale(1)';
								}
							}}
						>
							<img src={`${REACT_APP_API_URL}/${product.productImages?.[activeImage]}`} alt={product.productTitle} />
						</div>
						<div className="thumbnails">
							{product.productImages?.map((img, index) => (
								<div
									key={index}
									className={`thumb ${activeImage === index ? 'active' : ''}`}
									onClick={() => setActiveImage(index)}
								>
									<img src={`${REACT_APP_API_URL}/${img}`} alt={`Thumbnail ${index + 1}`} />
								</div>
							))}
						</div>
					</div>

					{/* Right Column - Product Info */}
					<div className="product-info">
						<h1 className="product-title">{product.productTitle}</h1>
						<div className="price-box">
							<span className="price">$ {product.productPrice.toLocaleString()} USD</span>
						</div>
						<div className="divider animate-width"></div>
						<p className="description-text">{product.productDesc}</p>

						{/* Actions */}
						<div className="actions">
							<div className="quantity-selector">
								<input
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(Number(e.target.value))}
									min="1"
								/>
							</div>
							<button className="add-to-cart" onClick={handleAddToCart} disabled={product.productStatus !== ProductStatus.ACTIVE}>
								Add to Cart
							</button>
						</div>
						<div className="divider animate-width"></div>

						<div className="meta-info">
							<div>
								ID: <span>{product._id}</span>
							</div>
							<div>
								Address: <span>{product.productAddress}</span>
							</div>
							<div className="payment-icons">
								Payment Method:
								<img
									src="/img/payment/visa.svg"
									alt="visa"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
								<img
									src="/img/payment/mastercard.svg"
									alt="master"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
								<img
									src="/img/payment/paypal.svg"
									alt="paypal"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
								<img
									src="/img/payment/amex.svg"
									alt="amex"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Product Tabs */}
				<div className="product-tabs animate-fade-in-up">
					<div className="tab-headers">
						<button
							className={activeTab === 'description' ? 'active' : ''}
							onClick={() => setActiveTab('description')}
						>
							Description
						</button>
						<button
							className={activeTab === 'specification' ? 'active' : ''}
							onClick={() => setActiveTab('specification')}
						>
							Information
						</button>
					</div>
					<div className="tab-content">
						{activeTab === 'description' && (
							<div className="description-tab">
								<p>{product.productDesc || 'No description available.'}</p>
							</div>
						)}
						{activeTab === 'specification' && (
							<div className="specification-tab">
								<ul>
									<li>
										<strong>Address:</strong> {product.productAddress}
									</li>
									<li>
										<strong>Beds:</strong> {product.productBeds}
									</li>
									<li>
										<strong>Rooms:</strong> {product.productRooms}
									</li>
									<li>
										<strong>Square:</strong> {product.productSquare} m2
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* Mock Suggested Products (Static for now as requested) */}
				{/* <div className="featured-products animate-fade-in-up">
					<h2>Featured Products</h2>
                    <p>Coming soon...</p>
				</div> */}
			</div>

			<Adds />

			{/* Lightbox */}
			{isOpen && (
				<div className="lightbox-overlay" onClick={() => setIsOpen(false)}>
					<button className="close-btn" onClick={() => setIsOpen(false)}>
						&times;
					</button>
					<div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
						<div className="main-display">
							<button
								className="nav-btn prev"
								onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : (product.productImages?.length || 1) - 1))}
							>
								&#10094;
							</button>
							<img src={`${REACT_APP_API_URL}/${product.productImages?.[activeImage]}`} alt="Full view" />
							<button
								className="nav-btn next"
								onClick={() => setActiveImage((prev) => (prev < (product.productImages?.length || 1) - 1 ? prev + 1 : 0))}
							>
								&#10095;
							</button>
						</div>

						<div className="thumbnails">
							{product.productImages?.map((img, index) => (
								<div
									key={index}
									className={`thumb ${activeImage === index ? 'active' : ''}`}
									onClick={() => setActiveImage(index)}
								>
									<img src={`${REACT_APP_API_URL}/${img}`} alt={`Thumbnail ${index + 1}`} />
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default withLayoutFull(ProductDetail);