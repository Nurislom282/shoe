
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductType } from '../../enums/product.enum';
import { REACT_APP_API_URL, REACT_APP_API_GRAPHQL_URL } from '../../config';
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
	const user = useReactiveVar(userVar);

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
			name: getProductData?.getProduct ? getProductData?.getProduct?.name : '',
			price: getProductData?.getProduct ? getProductData?.getProduct?.price : 0,
			category: getProductData?.getProduct ? getProductData?.getProduct?.category : '',
			description: getProductData?.getProduct ? getProductData?.getProduct?.description : '',
			images: getProductData?.getProduct ? getProductData?.getProduct?.images?.map((img: any) => img.url) : [],
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

			const response = await axios.post(`${REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;

			console.log('+responseImages: ', responseImages);
			setInsertProductData({ ...insertProductData, images: responseImages });
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
				images: insertProductData.images.filter((img: string) => img !== image),
			});
		},
		[insertProductData],
	);

	const doDisabledCheck = () => {
		if (
			insertProductData.name === '' ||
			insertProductData.price === 0 || // @ts-ignore
			insertProductData.category === '' ||
			insertProductData.description === '' ||
			insertProductData.images.length === 0
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
			// @ts-ignore
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
									value={insertProductData.name}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, name: value })
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
										value={insertProductData.price}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, price: parseInt(value) })
										}
									/>
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Select Category</Typography>
									<select
										className={'select-description'}
										defaultValue={insertProductData.category || 'select'}
										value={insertProductData.category || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertProductData({ ...insertProductData, category: value })
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

							{/* Real estate fields removed */}

							<Typography className="property-title">Product Description</Typography>
							<Stack className="config-column">
								<Typography className="title">Description</Typography>
								<textarea
									name=""
									id=""
									className="description-text"
									value={insertProductData.description}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, description: value })
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
									{insertProductData?.images.map((image: string, index: number) => {
										const imagePath: string = `${REACT_APP_API_URL}/${image}`;
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
		name: '',
		price: 0,
		category: '',
		description: '',
		images: [],
	},
};

export default AddProduct;
