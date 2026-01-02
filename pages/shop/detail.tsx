import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { userVar, cartVar, cartItemsVar } from '../../apollo/store';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import Adds from '../../libs/components/homepage/adds';
import Swal from 'sweetalert2';

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('description');
	const [quantity, setQuantity] = useState(1);
	const [activeImage, setActiveImage] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	// Mock data for Eclipse Stride
	const product = {
		id: 1,
		name: 'Eclipse Stride',
		price: 95.00,
		oldPrice: 120.00,
		description: 'Step into a world of sophistication and agility with Eclipse Stride. These sleek, black sneakers seamlessly blend style and performance. Designed for the urban explorer, Eclipse Stride ensures you make a statement with every step, whether you\'re hitting the streets or running errands.',
		images: [
			'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b7275dbb9d61e703400_6407.jpg',
			'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b78071e059bd3c75642_7555.webp',
			'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b85ff2b5651b1624108_2601.jpg',
			'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b93377b625d5d019456_3993.webp'
		],
		sku: 'SM1439722'
	};

	const relatedProducts = [
		{
			id: 1,
			name: 'Eclipse Stride',
			price: 95.00,
			category: 'Oxfords',
			image: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b7275dbb9d61e703400_6407.jpg',
			hoverImage: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00b78071e059bd3c75642_7555.webp',
			badge: 'Sale'
		},
		{
			id: 2,
			name: 'LunarPulse',
			price: 80.00,
			category: 'Oxfords',
			image: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a75e19c88e19a53ed79_10847.webp',
			hoverImage: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65f00a7f0c66f75a12299835_10980.webp',
			badge: 'Sale'
		},
		{
			id: 3,
			name: 'Luxe Vista',
			price: 62.50,
			category: 'Loafers',
			image: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef5075a8040d3a222349d4_101515.webp',
			hoverImage: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef58a597574d9bb64d67bb_mikhail-tyrsyna-R8IfCCtAweE-unsplash.webp',
			badge: 'Sale'
		},
		{
			id: 4,
			name: 'Mystic Glide',
			price: 95.00,
			category: 'Oxfords',
			image: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65eeff58834a0e1c401e23c8_37552.webp',
			hoverImage: 'https://cdn.prod.website-files.com/65a6294a580c5ed45b48f81a/65ef5075a8040d3a222349d4_101515.webp', // Using a placeholder as specific hover img wasn't instantly available in simple list
			badge: 'Sale'
		}
	];

	const handleAddToCart = () => {
		const currentItems = cartItemsVar();
		const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

		let newItems;
		if (existingItemIndex > -1) {
			newItems = [...currentItems];
			newItems[existingItemIndex] = {
				...newItems[existingItemIndex],
				quantity: newItems[existingItemIndex].quantity + quantity
			};
		} else {
			newItems = [
				...currentItems,
				{
					id: product.id,
					name: product.name,
					price: product.price,
					image: product.images[0],
					quantity: quantity,
					sku: product.sku
				}
			];
		}

		cartItemsVar(newItems);
		cartVar(newItems.reduce((acc, item) => acc + item.quantity, 0));

		Swal.fire({
			icon: 'success',
			title: 'Added to cart!',
			text: `${quantity} pair(s) added.`,
			showConfirmButton: false,
			timer: 1500
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
					<span>{product.name}</span>
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
							<img src={product.images[activeImage]} alt={product.name} />
						</div>
						<div className="thumbnails">
							{product.images.map((img, index) => (
								<div
									key={index}
									className={`thumb ${activeImage === index ? 'active' : ''}`}
									onClick={() => setActiveImage(index)}
								>
									<img src={img} alt={`Thumbnail ${index + 1}`} />
								</div>
							))}
						</div>
					</div>

					{/* Right Column - Product Info */}
					<div className="product-info">
						<h1 className="product-title">{product.name}</h1>
						<div className="price-box">
							<span className="price">$ {product.price.toFixed(2)} USD</span>
						</div>
						<div className="divider animate-width"></div>
						<p className="description-text">{product.description}</p>


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
							<button className="add-to-cart" onClick={handleAddToCart}>
								Add to Cart
							</button>
						</div>
						<div className="divider animate-width"></div>

						<div className="meta-info">
							<div>SKU: <span>{product.sku}</span></div>
							<div className="payment-icons">
								Payment Method:
								<img src="/img/payment/visa.svg" alt="visa" onError={(e) => { e.currentTarget.style.display = 'none' }} />
								<img src="/img/payment/mastercard.svg" alt="master" onError={(e) => { e.currentTarget.style.display = 'none' }} />
								<img src="/img/payment/paypal.svg" alt="paypal" onError={(e) => { e.currentTarget.style.display = 'none' }} />
								<img src="/img/payment/amex.svg" alt="amex" onError={(e) => { e.currentTarget.style.display = 'none' }} />
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
							Specification
						</button>
					</div>
					<div className="tab-content">
						{activeTab === 'description' && (
							<div className="description-tab">
								<p>Step into a world of sophistication and agility with Eclipse Stride. These sleek, black sneakers seamlessly blend style and performance. Designed for the urban explorer, Eclipse Stride ensures you make a statement with every step, whether you&apos;re hitting the streets or running errands.</p>
							</div>
						)}
						{activeTab === 'specification' && (
							<div className="specification-tab">
								<ul>
									<li><strong>Material:</strong> Premium Synthetic Leather</li>
									<li><strong>Sole:</strong> Durable Rubber</li>
									<li><strong>Weight:</strong> 0.8kg</li>
									<li><strong>Fit:</strong> True to size</li>
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* Featured Products */}
				<div className="featured-products animate-fade-in-up">
					<h2>Featured Products</h2>
					<div className="products-grid">
						{relatedProducts.map((prod) => (
							<div key={prod.id} className="product-card">
								<a href={`/shop/detail?id=${prod.id}`} className="image-wrapper">
									<div className="badge">{prod.badge}</div>
									<img className="main-img" src={prod.image} alt={prod.name} />
									{prod.hoverImage && (
										<img className="show-on-hover" src={prod.hoverImage} alt={`${prod.name} hover`} />
									)}
									<div className="product-button">
										<div className="button-text">View Product</div>
									</div>
								</a>
								<div className="card-info">
									<div className="title-link-wrapper">
										<h3>{prod.name}</h3>
									</div>
									<div className="price-line">
										<span className="price">$ {prod.price.toFixed(2)} USD</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>


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
								onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
							>
								&#10094;
							</button>
							<img src={product.images[activeImage]} alt="Full view" />
							<button
								className="nav-btn next"
								onClick={() => setActiveImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
							>
								&#10095;
							</button>
						</div>

						<div className="thumbnails">
							{product.images.map((img, index) => (
								<div
									key={index}
									className={`thumb ${activeImage === index ? 'active' : ''}`}
									onClick={() => setActiveImage(index)}
								>
									<img src={img} alt={`Thumbnail ${index + 1}`} />
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