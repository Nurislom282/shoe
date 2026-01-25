import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    IconButton,
    FormHelperText,
    Chip
} from '@mui/material';
import { ProductInput } from '../../../types/product/product.input';
import { ProductStatus, ProductType, ProductSeason } from '../../../enums/product.enum';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { REACT_APP_API_URL } from '../../../config';
import { sweetErrorHandling, sweetMixinErrorAlert } from '../../../sweetAlert';
import { useImageUpload } from '../../../hooks/useImageUpload';

interface ProductFormProps {
    initialValues?: ProductInput;
    onSubmit: (data: ProductInput) => void;
    loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit, loading }) => {
    const [formData, setFormData] = useState<ProductInput>({
        name: '',
        price: 0,
        discountPrice: 0,
        category: '' as any,
        brand: '',
        status: 'ACTIVE',
        description: '',
        images: [],
        colors: [],
        stock: {
            total: 0,
            sizes: []
        },
        season: '' as any,
        gender: [],
        ...initialValues,
    });

    // Image Upload Logic
    const { uploadImages } = useImageUpload();

    const handleImageUpload = async (e: any) => {
        try {
            const selectedFiles = e.target.files;

            if (!selectedFiles || selectedFiles.length === 0) return;
            if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

            const images = await uploadImages(Array.from(selectedFiles), 'products');

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...images],
            }));
        } catch (err: any) {
            console.log('err: ', err.message);
            await sweetMixinErrorAlert(err.message);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Handlers
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    };

    // Stock/Size Logic (Simple implementation for now)
    const [sizeInput, setSizeInput] = useState('');
    const [countInput, setCountInput] = useState(0);

    const addSize = () => {
        if (sizeInput && countInput > 0) {
            const newSizes = [...(formData.stock?.sizes || []), { size: Number(sizeInput), count: countInput }];
            const newTotal = newSizes.reduce((acc: any, curr: any) => acc + curr.count, 0);
            setFormData((prev) => ({
                ...prev,
                stock: {
                    sizes: newSizes,
                    total: newTotal
                }
            }));
            setSizeInput('');
            setCountInput(0);
        }
    };

    const removeSize = (index: number) => {
        const newSizes = formData.stock?.sizes.filter((_: any, i: number) => i !== index) || [];
        const newTotal = newSizes.reduce((acc: any, curr: any) => acc + curr.count, 0);
        setFormData((prev) => ({
            ...prev,
            stock: {
                sizes: newSizes,
                total: newTotal
            }
        }));
    };

    // Color Logic
    const [colorInput, setColorInput] = useState('');
    const addColor = () => {
        if (colorInput) {
            setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), colorInput] }));
            setColorInput('');
        }
    };



    const doDisabledCheck = () => {
        if (
            formData.name === '' ||
            formData.price === 0 ||
            formData.images.length === 0 ||
            formData.category === '' ||
            formData.season === '' ||
            formData.gender.length === 0 ||
            formData.colors?.length === 0 ||
            formData.stock?.total === 0
        ) {
            return true;
        }
    };

    return (
        <form noValidate autoComplete="off">
            <Grid container spacing={4}>
                {/* Images Section */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Product Images</Typography>
                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', p: 1 }}>
                        {formData.images.map((img, index) => (
                            <div key={index} style={{ position: 'relative', width: 100, height: 100, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <img
                                    src={img.startsWith('http') ? img : `${REACT_APP_API_URL}/${img}`}
                                    alt="product"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                                >
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </div>
                        ))}
                        <Button
                            component="label"
                            variant="outlined"
                            sx={{ width: 100, height: 100, borderRadius: '8px', display: 'flex', flexDirection: 'column' }}
                        >
                            <AddPhotoAlternateIcon />
                            <Typography variant="caption">Upload</Typography>
                            <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                        </Button>
                    </Stack>
                </Grid>

                {/* Basic Info */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select name="category" value={formData.category} label="Category" onChange={handleChange}>
                                <MenuItem value="" disabled>Select</MenuItem>
                                {Object.values(ProductType).map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Brand" name="brand" value={formData.brand} onChange={handleChange} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                                {Object.values(ProductStatus).map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Season</InputLabel>
                            <Select name="season" value={formData.season || ''} label="Season" onChange={handleChange}>
                                <MenuItem value="" disabled>Select</MenuItem>
                                {Object.values(ProductSeason).map((season) => (
                                    <MenuItem key={season} value={season}>{season}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender?.[0] || ''}
                                label="Gender"
                                onChange={(e) => setFormData({ ...formData, gender: [e.target.value] })}
                            >
                                <MenuItem value="" disabled>Select</MenuItem>
                                {['MEN', 'WOMEN', 'UNISEX', 'KIDS'].map((gender) => (
                                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Grid>

                {/* Pricing & Stock */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleNumberChange} fullWidth required />
                        <TextField label="Discount Price" name="discountPrice" type="number" value={formData.discountPrice} onChange={handleNumberChange} fullWidth />

                        {/* Colors */}
                        <div>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField label="Add Color" value={colorInput} onChange={(e) => setColorInput(e.target.value)} size="small" />
                                <Button onClick={addColor} variant="contained" size="small">Add</Button>
                            </Stack>
                            <Stack direction="row" spacing={1} mt={1}>
                                {formData.colors?.map((color, idx) => (
                                    <Chip key={idx} label={color} onDelete={() => setFormData(prev => ({ ...prev, colors: prev.colors?.filter((_, i) => i !== idx) }))} />
                                ))}
                            </Stack>
                        </div>

                        {/* Sizes */}
                        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <Typography variant="subtitle2" gutterBottom>Stock Management (Total: {formData.stock?.total})</Typography>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <TextField label="Size" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} size="small" sx={{ width: 100 }} />
                                <TextField label="Count" type="number" value={countInput} onChange={(e) => setCountInput(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                                <Button onClick={addSize} variant="contained" size="small">Add</Button>
                            </Stack>
                            <Stack spacing={1}>
                                {formData.stock?.sizes?.map((item: any, idx: number) => (
                                    <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: '4px' }}>
                                        <Typography>{item.size} - {item.count} units</Typography>
                                        <IconButton size="small" onClick={() => removeSize(idx)}><DeleteIcon fontSize="small" /></IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                        </div>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => onSubmit(formData)}
                        disabled={loading || doDisabledCheck()}
                        sx={{ minWidth: 200 }}
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProductForm;
