import React, { useState } from 'react';
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
    Theme,
    SxProps
} from '@mui/material';
import { BoardArticleInput } from '../../../types/board-article/board-article.input';
import { BoardArticleCategory } from '../../../enums/board-article.enum';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@apollo/client';
import { UPLOAD_IMAGE } from '../../../../apollo/user/mutation';
import { REACT_APP_API_URL } from '../../../config';
import { sweetErrorHandling } from '../../../sweetAlert';

interface BoardArticleFormProps {
    initialValues?: BoardArticleInput;
    onSubmit: (data: BoardArticleInput) => void;
    loading?: boolean;
}

const BoardArticleForm: React.FC<BoardArticleFormProps> = ({ initialValues, onSubmit, loading }) => {
    const [formData, setFormData] = useState<BoardArticleInput>({
        articleTitle: '',
        articleContent: '',
        articleCategory: BoardArticleCategory.FREE,
        articleImage: '',
        ...initialValues,
    });

    // Image Upload Logic
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const handleImageUpload = async (e: any) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            const { data } = await uploadImage({
                variables: {
                    file: file,
                    target: 'article',
                },
            });

            const newImage = data.imageUploader;
            setFormData((prev) => ({
                ...prev,
                articleImage: newImage,
            }));
        } catch (err) {
            sweetErrorHandling(err).then();
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            articleImage: '',
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Define style to avoid complex union type error
    const imageBoxStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        height: 250,
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa' // bgcolor -> backgroundColor
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={4}>
                {/* Image Section */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Article Image</Typography>
                    <div style={imageBoxStyle}>
                        {formData.articleImage ? (
                            <>
                                <img
                                    src={formData.articleImage.startsWith('http') ? formData.articleImage : `${REACT_APP_API_URL}/${formData.articleImage}`}
                                    alt="article"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveImage}
                                    sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.7)' }}
                                >
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </>
                        ) : (
                            <Button
                                component="label"
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}
                            >
                                <AddPhotoAlternateIcon sx={{ fontSize: 48, color: '#ccc' }} />
                                <Typography variant="caption" color="textSecondary">Upload Cover Image</Typography>
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </Button>
                        )}
                    </div>
                </Grid>

                {/* Info Section */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <TextField
                            label="Article Title"
                            name="articleTitle"
                            value={formData.articleTitle}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="articleCategory"
                                value={formData.articleCategory}
                                label="Category"
                                onChange={handleChange}
                            >
                                {Object.values(BoardArticleCategory).map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Content"
                            name="articleContent"
                            value={formData.articleContent}
                            onChange={handleChange}
                            multiline
                            rows={12}
                            fullWidth
                            required
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => onSubmit(formData)}
                        disabled={loading}
                        sx={{ minWidth: 200 }}
                    >
                        {loading ? 'Saving...' : 'Save Article'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BoardArticleForm;
