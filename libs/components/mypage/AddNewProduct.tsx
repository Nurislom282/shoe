
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductType } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';
import { ProductInput } from '../../types/product/product.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';

const AddProduct = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);
	const [productType, setProductType] = useState<ProductType[]>(Object.values(ProductType));
	const [productLocation, setProductLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const token = getJwtToken();
	// const user = useReactiveVar(userVar);
	const user = {
		_id: 'mock_id',
		memberNick: 'Mock User',
		memberImage: '',
		memberType: 'AGENT',
	};

	/** APOLLO REQUESTS **/
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: {
			input: router.query.productId,
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		setInsertProductData({
			...insertProductData,
			productTitle: getProductData?.getProduct ? getProductData?.getProduct?.productTitle : '',
			productPrice: getProductData?.getProduct ? getProductData?.getProduct?.productPrice : 0,
			productType: getProductData?.getProduct ? getProductData?.getProduct?.productType : '',
			productLocation: getProductData?.getProduct ? getProductData?.getProduct?.productLocation : '',
			productAddress: getProductData?.getProduct ? getProductData?.getProduct?.productAddress : '',
			productBarter: getProductData?.getProduct ? getProductData?.getProduct?.productBarter : false,
			productRent: getProductData?.getProduct ? getProductData?.getProduct?.productRent : false,
			productRooms: getProductData?.getProduct ? getProductData?.getProduct?.productRooms : 0,
			productBeds: getProductData?.getProduct ? getProductData?.getProduct?.productBeds : 0,
			productSquare: getProductData?.getProduct ? getProductData?.getProduct?.productSquare : 0,
			productDesc: getProductData?.getProduct ? getProductData?.getProduct?.productDesc : '',
			productImages: getProductData?.getProduct ? getProductData?.getProduct?.productImages : [],
		});
	}, [getProductLoading, getProductData]);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: [null, null, null, null, null],
						target: 'product',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;

			console.log('+responseImages: ', responseImages);
			setInsertProductData({ ...insertProductData, productImages: responseImages });
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}

	}

	const deleteImage = useCallback(
		async (image: string) => {
			console.log('deleteImage:', image);
			setInsertProductData({
				...insertProductData,
				productImages: insertProductData.productImages.filter((img: string) => img !== image),
			});
		},
		[insertProductData],
	);

	const doDisabledCheck = () => {
		if (
			insertProductData.productTitle === '' ||
			insertProductData.productPrice === 0 || // @ts-ignore
			insertProductData.productType === '' || // @ts-ignore
			insertProductData.productLocation === '' || // @ts-ignore
			insertProductData.productAddress === '' || // @ts-ignore
			insertProductData.productBarter === '' || // @ts-ignore
			insertProductData.productRent === '' ||
			insertProductData.productRooms === 0 ||
			insertProductData.productBeds === 0 ||
			insertProductData.productSquare === 0 ||
			insertProductData.productDesc === '' ||
			insertProductData.productImages.length === 0
		) {
			return true;
		}
	};

	const insertProductHandler = useCallback(async () => {
		try {
			const result = await createProduct({
				variables: {
					input: insertProductData,
				},
			});

			await sweetMixinSuccessAlert('This product has been created successfully. ');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {
		try {
			//@ts-ignore
			insertProductData._id = getProductData?.getProduct?._id;
			const result = await updateProduct({
				variables: {
					input: insertProductData,
				},
			});

			await sweetMixinSuccessAlert('This product has been updated successfully. ');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData]);

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	console.log('+insertProductData', insertProductData);

	if (device === 'mobile') {
		return <div>ADD NEW PRODUCT MOBILE PAGE</div>;
	} else {
		return (
			<div id="add-property-page">
				<Stack className="main-title-box">
					<Typography className="main-title">Add New Product</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>

				<div>
					<Stack className="config">
						<Stack className="description-box">
							<Stack className="config-column">
								<Typography className="title">Title</Typography>
								<input
									type="text"
									className="description-input"
									placeholder={'Title'}
									value={insertProductData.productTitle}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productTitle: value })
									}
								/>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Price</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Price'}
										value={insertProductData.productPrice}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productPrice: parseInt(value) })
										}
									/>
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Select Type</Typography>
									<select
										className={'select-description'}
										defaultValue={insertProductData.productType || 'select'}
										value={insertProductData.productType || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertProductData({ ...insertProductData, productType: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{productType.map((type: any) => (
												<option value={`${type}`} key={type}>
													{type}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Select Location</Typography>
									<select
										className={'select-description'}
										defaultValue={insertProductData.productLocation || 'select'}
										value={insertProductData.productLocation || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertProductData({ ...insertProductData, productLocation: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{productLocation.map((location: any) => (
												<option value={`${location}`} key={location}>
													{location}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Address</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Address'}
										value={insertProductData.productAddress}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productAddress: value })
										}
									/>
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Barter</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productBarter ? 'yes' : 'no'}
										defaultValue={insertProductData.productBarter ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productBarter: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Rent</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productRent ? 'yes' : 'no'}
										defaultValue={insertProductData.productRent ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productRent: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Rooms</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productRooms || 'select'}
										defaultValue={insertProductData.productRooms || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productRooms: parseInt(value) })
										}
									>
										<option disabled={true} selected={true} value={'select'}>
											Select
										</option>
										{[1, 2, 3, 4, 5].map((room: number) => (
											<option value={`${room}`}>{room}</option>
										))}
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Bed</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productBeds || 'select'}
										defaultValue={insertProductData.productBeds || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productBeds: parseInt(value) })
										}
									>
										<option disabled={true} selected={true} value={'select'}>
											Select
										</option>
										{[1, 2, 3, 4, 5].map((bed: number) => (
											<option value={`${bed}`}>{bed}</option>
										))}
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Square</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productSquare || 'select'}
										defaultValue={insertProductData.productSquare || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productSquare: parseInt(value) })
										}
									>
										<option disabled={true} selected={true} value={'select'}>
											Select
										</option>
										{[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((square: number) => (
											<option value={`${square}`}>{square}</option>
										))}
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
							</Stack>

							<Typography className="property-title">Product Description</Typography>
							<Stack className="config-column">
								<Typography className="title">Description</Typography>
								<textarea
									name=""
									id=""
									className="description-text"
									value={insertProductData.productDesc}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productDesc: value })
									}
								></textarea>
							</Stack>
						</Stack>

						<Stack className="media-upload-card">
							<Stack className="card-header">
								<Typography className="title">Images</Typography>
							</Stack>
							<Stack className="card-content">
								<Stack
									className="upload-dropzone"
									onClick={() => {
										inputRef.current.click();
									}}
								>
									<Button className="upload-button">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="17 8 12 3 7 8" />
											<line x1="12" y1="3" x2="12" y2="15" />
										</svg>
										Upload
									</Button>
									<Typography className="dnd-text">Choose images or drag & drop it here.</Typography>
									<Typography className="format-text">JPG, JPEG, PNG and WEBP. Max 20 MB.</Typography>
									<input
										ref={inputRef}
										type="file"
										hidden={true}
										onChange={uploadImages}
										multiple={true}
										accept="image/jpg, image/jpeg, image/png"
									/>
								</Stack>
								<Stack className="gallery-box">
									{insertProductData?.productImages.map((image: string, index: number) => {
										const imagePath: string = `${process.env.REACT_APP_API_URL}/${image}`;
										return (
											<Stack className="image-box" key={index}>
												<img src={imagePath} alt="" />
												<Stack className="absolute-box" onClick={() => deleteImage(image)}>
													<CloseIcon sx={{ color: '#000', width: '16px' }} />
												</Stack>
											</Stack>
										);
									})}
								</Stack>
							</Stack>
						</Stack>
						<Stack className="buttons-row">
							{router.query.productId ? (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							) : (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={insertProductHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							)}
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

AddProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productType: '',
		productLocation: '',
		productAddress: '',
		productBarter: false,
		productRent: false,
		productRooms: 0,
		productBeds: 0,
		productSquare: 0,
		productDesc: '',
		productImages: [],
	},
};

export default AddProduct;
