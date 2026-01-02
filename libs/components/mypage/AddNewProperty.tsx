
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { REACT_APP_API_URL, propertySquare } from '../../config';
import { PropertyInput } from '../../types/property/property.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PROPERTY, UPDATE_PROPERTY } from '../../../apollo/user/mutation';
import { GET_PROPERTY } from '../../../apollo/user/query';

const AddProperty = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertPropertyData, setInsertPropertyData] = useState<PropertyInput>(initialValues);
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const token = getJwtToken();
	// const user = useReactiveVar(userVar);
	const user = {
		_id: 'mock_id',
		memberNick: 'Mock User',
		memberImage: '',
		memberType: 'AGENT',
	};

	/** APOLLO REQUESTS **/
	const [createProperty] = useMutation(CREATE_PROPERTY);
	const [updateProperty] = useMutation(UPDATE_PROPERTY);

	const {
		loading: getPropertyLoading,
		data: getPropertyData,
		error: getPropertyError,
		refetch: getPropertyRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'network-only',
		variables: {
			input: router.query.propertyId,
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		setInsertPropertyData({
			...insertPropertyData,
			propertyTitle: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyTitle : '',
			propertyPrice: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyPrice : 0,
			propertyType: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyType : '',
			propertyLocation: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyLocation : '',
			propertyAddress: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyAddress : '',
			propertyBarter: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyBarter : false,
			propertyRent: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyRent : false,
			propertyRooms: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyRooms : 0,
			propertyBeds: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyBeds : 0,
			propertySquare: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertySquare : 0,
			propertyDesc: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyDesc : '',
			propertyImages: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyImages : [],
		});
	}, [getPropertyLoading, getPropertyData]);

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
						target: 'property',
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
			setInsertPropertyData({ ...insertPropertyData, propertyImages: responseImages });
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}

	}

	const deleteImage = useCallback(
		async (image: string) => {
			console.log('deleteImage:', image);
			setInsertPropertyData({
				...insertPropertyData,
				propertyImages: insertPropertyData.propertyImages.filter((img: string) => img !== image),
			});
		},
		[insertPropertyData],
	);

	const doDisabledCheck = () => {
		if (
			insertPropertyData.propertyTitle === '' ||
			insertPropertyData.propertyPrice === 0 || // @ts-ignore
			insertPropertyData.propertyType === '' || // @ts-ignore
			insertPropertyData.propertyLocation === '' || // @ts-ignore
			insertPropertyData.propertyAddress === '' || // @ts-ignore
			insertPropertyData.propertyBarter === '' || // @ts-ignore
			insertPropertyData.propertyRent === '' ||
			insertPropertyData.propertyRooms === 0 ||
			insertPropertyData.propertyBeds === 0 ||
			insertPropertyData.propertySquare === 0 ||
			insertPropertyData.propertyDesc === '' ||
			insertPropertyData.propertyImages.length === 0
		) {
			return true;
		}
	};

	const insertPropertyHandler = useCallback(async () => {
		try {
			const result = await createProperty({
				variables: {
					input: insertPropertyData,
				},
			});

			await sweetMixinSuccessAlert('This property has been created successfully. ');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProperties',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertPropertyData]);

	const updatePropertyHandler = useCallback(async () => {
		try {
			//@ts-ignore
			insertPropertyData._id = getPropertyData?.getProperty?._id;
			const result = await updateProperty({
				variables: {
					input: insertPropertyData,
				},
			});

			await sweetMixinSuccessAlert('This property has been updated successfully. ');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProperties',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertPropertyData]);

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	console.log('+insertPropertyData', insertPropertyData);

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
									value={insertPropertyData.propertyTitle}
									onChange={({ target: { value } }) =>
										setInsertPropertyData({ ...insertPropertyData, propertyTitle: value })
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
										value={insertPropertyData.propertyPrice}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyPrice: parseInt(value) })
										}
									/>
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Select Type</Typography>
									<select
										className={'select-description'}
										defaultValue={insertPropertyData.propertyType || 'select'}
										value={insertPropertyData.propertyType || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertPropertyData({ ...insertPropertyData, propertyType: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{propertyType.map((type: any) => (
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
										defaultValue={insertPropertyData.propertyLocation || 'select'}
										value={insertPropertyData.propertyLocation || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertPropertyData({ ...insertPropertyData, propertyLocation: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{propertyLocation.map((location: any) => (
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
										value={insertPropertyData.propertyAddress}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyAddress: value })
										}
									/>
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Barter</Typography>
									<select
										className={'select-description'}
										value={insertPropertyData.propertyBarter ? 'yes' : 'no'}
										defaultValue={insertPropertyData.propertyBarter ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyBarter: value === 'yes' })
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
										value={insertPropertyData.propertyRent ? 'yes' : 'no'}
										defaultValue={insertPropertyData.propertyRent ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyRent: value === 'yes' })
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
										value={insertPropertyData.propertyRooms || 'select'}
										defaultValue={insertPropertyData.propertyRooms || 'select'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyRooms: parseInt(value) })
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
										value={insertPropertyData.propertyBeds || 'select'}
										defaultValue={insertPropertyData.propertyBeds || 'select'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertyBeds: parseInt(value) })
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
										value={insertPropertyData.propertySquare || 'select'}
										defaultValue={insertPropertyData.propertySquare || 'select'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, propertySquare: parseInt(value) })
										}
									>
										<option disabled={true} selected={true} value={'select'}>
											Select
										</option>
										{propertySquare.map((square: number) => {
											if (square !== 0) {
												return <option value={`${square}`}>{square}</option>;
											}
										})}
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
									value={insertPropertyData.propertyDesc}
									onChange={({ target: { value } }) =>
										setInsertPropertyData({ ...insertPropertyData, propertyDesc: value })
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
									{insertPropertyData?.propertyImages.map((image: string, index: number) => {
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
							{router.query.propertyId ? (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={updatePropertyHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							) : (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={insertPropertyHandler}>
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

AddProperty.defaultProps = {
	initialValues: {
		propertyTitle: '',
		propertyPrice: 0,
		propertyType: '',
		propertyLocation: '',
		propertyAddress: '',
		propertyBarter: false,
		propertyRent: false,
		propertyRooms: 0,
		propertyBeds: 0,
		propertySquare: 0,
		propertyDesc: '',
		propertyImages: [],
	},
};

export default AddProperty;
