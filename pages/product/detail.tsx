import React, { useState } from 'react';
import { useRouter } from 'next/router';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useQuery, useMutation } from '@apollo/client';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { cartItemsVar, cartVar, userVar } from '../../apollo/store';
import { GET_PRODUCT, GET_PRODUCTS, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT } from '../../apollo/user/mutation';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Direction } from '../../libs/enums/common.enum';
import moment from 'moment';
import { sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Box, Container, Stack, Typography, Button, IconButton, Rating, Grid, Chip, Divider, Breadcrumbs, Link as MuiLink, Fade } from '@mui/material';
import Link from 'next/link';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { Product } from '../../libs/types/product/product';

import { TextField } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

const ProductDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [selectedImage, setSelectedImage] = useState<number>(0);

	// Data Fetching
	const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { productId: id }, skip: !id, fetchPolicy: 'network-only' });
	const { data: featuredData } = useQuery(GET_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'productViews',
				direction: Direction.DESC,
				search: {}
			}
		},
		fetchPolicy: 'cache-and-network',
	});

	// Comments Fetching
	const { data: commentsData, refetch: refetchComments } = useQuery(GET_COMMENTS, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: { commentRefId: id }
			}
		},
		skip: !id
	});

	const [createComment] = useMutation(CREATE_COMMENT);
	const featuredProducts: Product[] = featuredData?.getProducts?.list || [];
	console.log('DEBUG: Featured Products Data:', JSON.stringify(featuredProducts, null, 2));

	// Payment Icons (Mock)
	const paymentIcons = [
		'/img/icons/visa.png',
		'/img/icons/mastercard.png',
		'/img/icons/paypal.png',
		'/img/icons/amex.png',
	];

	// Interactivity State
	const [quantity, setQuantity] = useState(1);
	const [buttonAnimate, setButtonAnimate] = useState(false);
	const [reviewText, setReviewText] = useState('');
	const [reviewRating, setReviewRating] = useState<number | null>(5);

	const [tabValue, setTabValue] = useState(0);
	const [openLightbox, setOpenLightbox] = useState(false);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Zoom Logic State
	const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });



	const handleAddToCart = () => {
		setButtonAnimate(true);
		setTimeout(() => setButtonAnimate(false), 300); // Reset animation

		const currentItems = [...cartItemsVar()];
		const existingItem = currentItems.find((item) => item.id === product._id);
		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			currentItems.push({
				id: product._id,
				name: product.name,
				price: product.price,
				image: mainImageSrc,
				quantity: quantity,
			});
		}
		cartItemsVar(currentItems);
		cartVar(currentItems.reduce((acc, item) => acc + item.quantity, 0));
		sweetTopSmallSuccessAlert('Added to Cart!', 800);
	};

	// Submit Review Logic
	const handleSubmitReview = async () => {
		if (!reviewText.trim()) return;

		try {
			await createComment({
				variables: {
					input: {
						commentGroup: CommentGroup.PRODUCT,
						commentContent: reviewText,
						commentRefId: id,
					},
				},
			});
			setReviewText('');
			setReviewRating(5);
			sweetTopSmallSuccessAlert('Review Submitted!', 1000);
			refetchComments();
		} catch (err) {
			console.log('Error submitting review:', err);
		}
	};

	if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
	if (error) return <div style={{ padding: '40px', textAlign: 'center' }}>Error loading product.</div>;
	if (!data?.getProduct) return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found.</div>;

	const product: Product = data.getProduct;
	const mainImageSrc = (() => {
		const url = product.images?.[selectedImage]?.url;
		if (!url) return '/img/logo/logoText.svg';
		if (url.startsWith('http')) return url;
		if (url.startsWith('localhost')) return `http://${url}`;
		return `${REACT_APP_API_URL}/${url}`;
	})();

	// Zoom Logic
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
		const x = ((e.pageX - left) / width) * 100;
		const y = ((e.pageY - top) / height) * 100;
		setZoomStyle({
			display: 'block',
			backgroundPosition: `${x}% ${y}%`,
			backgroundImage: `url(${mainImageSrc})`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: '200%', // Zoom level
			position: 'absolute',
			top: 0, left: 0, width: '100%', height: '100%',
			zIndex: 10,
			pointerEvents: 'none', // Allow clicks to pass through to lightbox
		});
	};

	return (
		<Fade in={true} timeout={1000}>
			<Container maxWidth="lg" sx={{ pt: 16, pb: 10 }}>
				{/* Breadcrumbs */}
				<div style={{ marginBottom: '32px' }}>
					<Breadcrumbs aria-label="breadcrumb" separator="›">
						<Link href="/" passHref style={{ textDecoration: 'none' }}>
							<MuiLink underline="hover" color="text.secondary" sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								Home
							</MuiLink>
						</Link>
						<Link href="/shop" passHref style={{ textDecoration: 'none' }}>
							<MuiLink underline="hover" color="text.secondary" sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								Shop
							</MuiLink>
						</Link>
						<Typography color="text.primary" fontWeight="bold">
							{product.name}
						</Typography>
					</Breadcrumbs>
				</div>

				<Grid container spacing={5}>
					{/* LEFT: GALLERY SECTION */}
					<Grid item xs={12} md={7}>
						<Stack spacing={2}>
							{/* Main Image with Zoom & Lightbox Trigger */}
							<div
								style={{
									position: 'relative',
									borderRadius: '24px',
									overflow: 'hidden',
									backgroundColor: '#f8f9fa',
									cursor: 'zoom-in',
									border: '1px solid #eee',
									height: '500px', // Fixed height for consistency
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
								onMouseMove={handleMouseMove}
								onMouseLeave={() => setZoomStyle({ display: 'none' })}
								onClick={() => setOpenLightbox(true)}
							>
								<img
									src={mainImageSrc}
									alt={product.name}
									style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
								/>
								{/* Zoom Overlay */}
								<div style={zoomStyle} />
							</div>


							{/* Thumbnails */}
							<div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
								{product.images?.map((imgObj, index) => (
									<div
										key={index}
										onClick={() => setSelectedImage(index)}
										style={{
											width: 80,
											height: 80,
											minWidth: 80,
											borderRadius: '12px',
											overflow: 'hidden',
											cursor: 'pointer',
											border: selectedImage === index ? '2px solid #1976d2' : '1px solid transparent',
											backgroundColor: '#f8f9fa'
										}}
									>
										<img
											src={(() => {
												const url = imgObj.url;
												if (url.startsWith('http')) return url;
												if (url.startsWith('localhost')) return `http://${url}`;
												return `${REACT_APP_API_URL}/${url}`;
											})()}
											alt={`thumb-${index}`}
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
									</div>
								))}
							</div>
						</Stack>
					</Grid>

					{/* RIGHT: INFO SECTION */}
					<Grid item xs={12} md={5}>
						<Stack spacing={3}>
							<div>
								<Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
									{product.category?.toUpperCase() || 'SNEAKERS'}
								</Typography>
								<Typography variant="h3" fontWeight="800" sx={{ lineHeight: 1.2, mb: 1 }}>
									{product.name}
								</Typography>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Rating value={product.rating || 5} readOnly size="small" />
									<Typography variant="body2" color="text.secondary">
										({product.reviewsCount || 0} reviews)
									</Typography>
								</Stack>
							</div>

							<Stack direction="row" alignItems="center" spacing={2}>
								<Typography variant="h4" color="error.main" fontWeight="bold">
									$ {product.price?.toLocaleString()} USD
								</Typography>
								{product.price && <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
									$ {(product.price * 1.2).toFixed(0)} USD
								</Typography>}
							</Stack>

							<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
								{product.description}
							</Typography>

							{/* Colors */}
							<div>
								<Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Colors</Typography>
								<Stack direction="row" spacing={1}>
									{product.colors?.map((color, index) => (
										<Chip
											key={color}
											label={color}
											clickable
											onClick={() => {
												// If we have an image for this index, switch to it
												if (product.images && product.images[index]) {
													setSelectedImage(index);
												}
											}}
											sx={{
												borderRadius: '8px',
												fontWeight: 500,
												backgroundColor: selectedImage === index ? '#333' : '#eee',
												color: selectedImage === index ? '#fff' : '#000',
												'&:hover': { backgroundColor: selectedImage === index ? '#000' : '#ddd' }
											}}
										/>
									))}
								</Stack>
							</div>

							<Divider />

							{/* Add to Cart Check */}
							{/* Quantity and Add to Cart */}
							<Stack direction="row" spacing={2} alignItems="center">
								<Stack
									direction="row"
									alignItems="center"
									spacing={1}
									sx={{
										border: '1px solid #ddd',
										borderRadius: '50px',
										px: 1,
										py: 0.5
									}}
								>
									<IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
										<RemoveIcon fontSize="small" />
									</IconButton>
									<Typography fontWeight="bold" sx={{ minWidth: '20px', textAlign: 'center' }}>
										{quantity}
									</Typography>
									<IconButton size="small" onClick={() => setQuantity(quantity + 1)}>
										<AddIcon fontSize="small" />
									</IconButton>
								</Stack>

								<Button
									variant="contained"
									size="large"
									fullWidth
									startIcon={<AddShoppingCartIcon />}
									onClick={handleAddToCart}
									sx={{
										borderRadius: '50px',
										textTransform: 'none',
										fontSize: '1.1rem',
										fontWeight: 'bold',
										boxShadow: buttonAnimate ? '0 0 15px rgba(211, 47, 47, 0.6)' : 'none',
										backgroundColor: '#d32f2f',
										transform: buttonAnimate ? 'scale(0.95)' : 'scale(1)',
										transition: 'all 0.1s ease-in-out',
										'&:hover': { backgroundColor: '#b71c1c' }
									}}
								>
									Add to Cart
								</Button>
							</Stack>

							<Stack direction="row" spacing={1} sx={{ opacity: 0.6 }}>
								{/* Mock Payment Icons */}
								<Typography variant="caption">Guaranteed Safe Checkout</Typography>
								{/* <img src="/visa.png" height={20} /> ... */}
							</Stack>
						</Stack>
					</Grid>
				</Grid>

				{/* BOTTOM: TABS SECTION */}
				<div style={{ marginTop: '112px', marginBottom: '32px' }}>
					<div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
						{/* Custom Styling for Tabs would go here or use MUI Tabs */}
						<Stack direction="row" spacing={4}>
							{['Description', 'Specification', 'Reviews'].map((label, idx) => (
								<Typography
									key={label}
									onClick={(e: any) => handleTabChange(e, idx)}
									variant="h6"
									sx={{
										cursor: 'pointer',
										pb: 2,
										borderBottom: tabValue === idx ? '2px solid #000' : '2px solid transparent',
										fontWeight: tabValue === idx ? 'bold' : 'normal',
										color: tabValue === idx ? '#000' : '#888'
									}}
								>
									{label}
								</Typography>
							))}
						</Stack>
					</div>

					{tabValue === 0 && (
						<div style={{ maxWidth: '900px', margin: '0 auto' }}>
							<Typography variant="h5" fontWeight="bold" gutterBottom>Elevate Your Style</Typography>
							<Typography variant="body1" color="text.secondary" paragraph>
								{product.description}
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Designed for the modern urban explorer, featuring breathable materials and superior cushioning.
							</Typography>
						</div>
					)}

					{tabValue === 1 && (
						<div style={{ maxWidth: '900px', margin: '0 auto' }}>
							<Typography variant="h6" gutterBottom>Product Specifications</Typography>
							<Stack spacing={2}>
								<Stack direction="row" justifyContent="space-between" sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
									<Typography fontWeight="bold">Brand</Typography>
									<Typography color="text.secondary">{product.brand}</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between" sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
									<Typography fontWeight="bold">Material</Typography>
									<Typography color="text.secondary">{product.specifications?.material || 'Synthetic'}</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between" sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
									<Typography fontWeight="bold">Weight</Typography>
									<Typography color="text.secondary">{product.specifications?.weight || '0.8kg'}</Typography>
								</Stack>
							</Stack>
						</div>
					)}

					{tabValue === 2 && (
						<div style={{ maxWidth: '900px', margin: '0 auto' }}>
							{/* Review Form */}
							<div style={{ marginBottom: '40px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
								<Typography variant="h6" gutterBottom fontWeight="800" sx={{ mb: 2 }}>Write a Review</Typography>
								<Stack spacing={3}>
									<Stack direction="row" spacing={2} alignItems="center">
										<Typography component="legend" color="text.secondary" fontWeight="500">Your Rating:</Typography>
										<Rating
											value={reviewRating}
											onChange={(event, newValue) => {
												setReviewRating(newValue);
											}}
											size="large"
										/>
									</Stack>
									<TextField
										hiddenLabel
										placeholder="Share your thoughts about the product..."
										rows={4}
										variant="outlined"
										value={reviewText}
										onChange={(e) => setReviewText(e.target.value)}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: '12px',
												backgroundColor: '#f9f9f9',
												'& fieldset': { borderColor: '#e0e0e0' },
												'&:hover fieldset': { borderColor: '#bdbdbd' },
												'&.Mui-focused fieldset': { borderColor: '#333' }
											},
											'& .MuiInputBase-input': {
												fontSize: '1rem', // Ensure readable font size
											}
										}}
									/>
									<Button
										variant="contained"
										sx={{
											alignSelf: 'flex-start',
											borderRadius: '50px',
											textTransform: 'none',
											fontSize: '1rem',
											fontWeight: 'bold',
											py: 1.5,
											px: 4,
											bgcolor: '#d32f2f', // Red Button
											boxShadow: '0 4px 14px rgba(211, 47, 47, 0.2)',
											'&:hover': { bgcolor: '#b71c1c', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)' },
											transition: 'all 0.2s ease'
										}}
										onClick={handleSubmitReview}
									>
										Submit Review
									</Button>
								</Stack>
							</div>

							{/* Comments List */}
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Typography variant="h6" fontWeight="bold">Customer Reviews ({commentsData?.getComments?.metaCounter[0]?.total || 0})</Typography>
							</Stack>
							<Stack spacing={3}>
								{commentsData?.getComments?.list?.map((comment: any) => (
									<div key={comment._id} style={{ padding: '24px', backgroundColor: '#f9f9f9', borderRadius: '16px', marginBottom: '16px', transition: 'all 0.2s' }}>
										<Stack direction="row" justifyContent="space-between" mb={1}>
											<Stack direction="row" alignItems="center" spacing={1}>
												<Typography fontWeight="bold">{comment.memberData?.memberNick || 'User'}</Typography>
												{comment.memberId === userVar()._id && <Chip label="Verified Buyer" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />}
											</Stack>
											<Typography variant="caption" color="text.secondary">{moment(comment.createdAt).fromNow()}</Typography>
										</Stack>
										{/* Rating not available in comment schema yet */}
										<Rating value={5} readOnly size="small" sx={{ mb: 1 }} />
										<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{comment.commentContent}</Typography>
									</div>
								))}
								{(!commentsData?.getComments?.list || commentsData.getComments.list.length === 0) && (
									<Typography color="text.secondary" textAlign="center">No reviews yet. Be the first to write one!</Typography>
								)}
							</Stack>
						</div>
					)}
				</div>

				{/* FEATURED PRODUCTS PLACEHOLDER */}
				<div style={{ marginTop: '80px' }}>
					<Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">Featured Products</Typography>
					<Grid container spacing={3}>
						{featuredProducts.map((p) => {
							const imageUrl = p.images?.[0]?.url || '';
							// Handle various URL formats including user-provided 'localhost' without protocol
							const pImage = imageUrl
								? imageUrl.startsWith('http')
									? imageUrl
									: imageUrl.startsWith('localhost')
										? `http://${imageUrl}`
										: `${REACT_APP_API_URL}/${imageUrl}`
								: '/img/logo/logoText.svg';

							return (
								<Grid item xs={12} md={3} key={p._id}>
									<div
										onClick={() => router.push(`/product/detail?id=${p._id}`)}
										style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
										onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
										onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
									>
										<div style={{
											borderRadius: '20px', overflow: 'hidden', marginBottom: '16px',
											backgroundColor: '#f8f9fa', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center',
											boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
										}}>
											<img
												src={pImage}
												alt={p.name}
												style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
											/>
										</div>
										<Stack spacing={0.5} px={1}>
											<Typography fontWeight="bold" variant="h6">{p.name}</Typography>
											<Typography variant="body2" color="text.secondary">{p.category}</Typography>
											<Typography variant="h6" color="error.main" fontWeight="bold">
												$ {p.price.toLocaleString()}
											</Typography>
										</Stack>
									</div>
								</Grid>
							);
						})}
					</Grid>
				</div>

				{/* Lightbox Modal (Simple Implementation) */}
				{/* Lightbox Modal (Improvement Implementation) */}
				{openLightbox && (
					<div
						style={{
							position: 'fixed',
							top: 0, left: 0, width: '100%', height: '100%',
							backgroundColor: 'rgba(0,0,0,0.9)',
							zIndex: 1300,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
						onClick={() => setOpenLightbox(false)}
					>
						{/* Close Button */}
						<IconButton
							onClick={() => setOpenLightbox(false)}
							sx={{
								position: 'absolute',
								top: 20,
								right: 20,
								color: 'white',
								backgroundColor: 'rgba(255,255,255,0.1)',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
							}}
						>
							<CloseIcon fontSize="large" />
						</IconButton>

						{/* Previous Button */}
						<IconButton
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								const total = product.images?.length || 0;
								setSelectedImage((prev) => (prev - 1 + total) % total);
							}}
							sx={{
								position: 'absolute',
								left: 20,
								color: 'white',
								backgroundColor: 'rgba(255,255,255,0.1)',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
								display: (product.images?.length || 0) > 1 ? 'flex' : 'none'
							}}
						>
							<ArrowBackIosIcon fontSize="large" />
						</IconButton>


						<img
							src={mainImageSrc}
							alt="Fullscreen"
							style={{ maxHeight: '90%', maxWidth: '80%', objectFit: 'contain' }}
							onClick={(e: React.MouseEvent) => e.stopPropagation()}
						/>

						{/* Next Button */}
						<IconButton
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								const total = product.images?.length || 0;
								setSelectedImage((prev) => (prev + 1) % total);
							}}
							sx={{
								position: 'absolute',
								right: 20,
								color: 'white',
								backgroundColor: 'rgba(255,255,255,0.1)',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
								display: (product.images?.length || 0) > 1 ? 'flex' : 'none'
							}}
						>
							<ArrowForwardIosIcon fontSize="large" />
						</IconButton>
					</div>
				)}

			</Container>
		</Fade>
	);
};

/* Unchanged code block omitted for brevity, adding export at the end */

export default withLayoutBasic(ProductDetail);
