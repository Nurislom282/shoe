import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    Button,
    Menu,
    MenuItem,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Grid,
    Box,
    Stack,
    Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Product } from '../../../types/product/product';
import { REACT_APP_API_URL } from '../../../config';
import { ProductStatus } from '../../../enums/product.enum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface ProductPanelListType {
    products: Product[];
    anchorEl: any;
    menuIconClickHandler: any;
    menuIconCloseHandler: any;
    updateProductHandler: any;
    removeProductHandler: any;
}

export const ProductCardGrid = (props: ProductPanelListType) => {
    const {
        products,
        anchorEl,
        menuIconClickHandler,
        menuIconCloseHandler,
        updateProductHandler,
        removeProductHandler,
    } = props;
    const router = useRouter();

    if (products.length === 0) {
        return (
            <div style={{ padding: '32px', textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    No products found.
                </Typography>
            </div>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product: Product, index: number) => {
                const productImage = product?.images?.[0]?.url
                    ? product.images[0].url.startsWith('http') || product.images[0].url.startsWith('/')
                        ? product.images[0].url
                        : `${REACT_APP_API_URL}/${product.images[0].url}`
                    : '/img/logo/logo.png';

                return (
                    <Grid item xs={12} sm={6} md={3} lg={2} key={product._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                borderRadius: '16px',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                                <Link href={`/product/detail?id=${product?._id}`}>
                                    <img
                                        src={productImage}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', backgroundColor: '#f8f9fa' }}
                                    />
                                </Link>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: product.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {product.status}
                                </div>
                            </div>
                            <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                                <Link href={`/product/detail?id=${product?._id}`}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#1a1f36',
                                            textDecoration: 'none',
                                            mb: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                </Link>
                                <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ${Number(product.price).toLocaleString()}
                                </Typography>
                                {/* <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <LocationOnIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                    <Typography variant="body2" color="textSecondary" noWrap>
                                        {product.productLocation}
                                    </Typography>
                                </Stack> */}
                            </CardContent>
                            <CardActions
                                sx={{
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #f0f2f5',
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                                    <Typography variant="caption" color="textSecondary">
                                        ID: {product._id.slice(0, 8).toUpperCase()}
                                    </Typography>
                                </div>
                                <div onClick={(e: any) => e.stopPropagation()}>
                                    <IconButton
                                        size="small"
                                        onClick={(e: any) => menuIconClickHandler(e, product._id)}
                                        aria-controls={Boolean(anchorEl[product._id]) ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={Boolean(anchorEl[product._id]) ? 'true' : undefined}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </CardActions>

                            <Menu
                                anchorEl={anchorEl[product._id]}
                                open={Boolean(anchorEl[product._id])}
                                onClose={menuIconCloseHandler}
                                onClick={menuIconCloseHandler}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <div style={{ padding: '8px' }}>
                                    <MenuItem
                                        onClick={() => {
                                            menuIconCloseHandler();
                                            router.push(`/_admin/products/${product._id}`);
                                        }}
                                    >
                                        <Typography variant={'body2'}>Edit Product</Typography>
                                    </MenuItem>

                                    {product.status !== ProductStatus.SOLD && (
                                        <MenuItem
                                            onClick={() => updateProductHandler({ _id: product._id, status: ProductStatus.SOLD })}
                                        >
                                            <Typography variant={'body2'}>Mark as Sold</Typography>
                                        </MenuItem>
                                    )}

                                    {product.status === ProductStatus.SOLD && (
                                        <MenuItem
                                            onClick={() => updateProductHandler({ _id: product._id, status: ProductStatus.ACTIVE })}
                                        >
                                            <Typography variant={'body2'}>Mark as Active</Typography>
                                        </MenuItem>
                                    )}

                                    <MenuItem
                                        onClick={() => removeProductHandler(product._id)}
                                    >
                                        <Typography variant={'body2'} color={'error'}>Delete Product</Typography>
                                    </MenuItem>
                                </div>
                            </Menu>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};
