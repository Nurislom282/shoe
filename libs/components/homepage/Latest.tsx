import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { Box, Stack, Typography } from '@mui/material';
import { Direction } from '../../enums/common.enum';

interface ShoeCardProps {
    id: string;
    image: string;
    hoverImage: string;
    title: string;
    category: string;
    price: string;
    onSale: boolean;
    className?: string;
}

const ShoeCard: React.FC<ShoeCardProps> = ({ id, image, hoverImage, title, category, price, onSale, className }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="shoe-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {onSale && <span className="sale-badge">Sale</span>}
            <div className={`shoe-image ${className || ''}`}>
                <img
                    src={image}
                    alt={title}
                    className={`shoe-img base-image ${isHovered ? 'fade-out' : ''}`}
                />
                <img
                    src={hoverImage}
                    alt={title}
                    className={`shoe-img hover-image ${isHovered ? 'fade-in' : ''}`}
                />
                <div className="hover-overlay">
                    <Link href={`/product/detail?id=${id}`}>
                        <button className="view-product-btn">View Product</button>
                    </Link>
                </div>
            </div>
            <div className="shoe-info">
                <h3 className="shoe-title">{title}</h3>
                <div className="shoe-details">
                    <span className="shoe-category">{category}</span>
                    <span className="shoe-price">{price}</span>
                </div>
            </div>
        </div>
    );
};

const ShoeCollection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const { loading, error } = useQuery(GET_PRODUCTS, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                page: 1,
                limit: 3,
                sort: 'createdAt',
                direction: Direction.DESC,
                search: {},
            },
        },
        onCompleted: (data) => {
            if (data?.getProducts?.list) {
                setProducts(data.getProducts.list);
            }
        },
    });

    if (loading) return (
        <div className="latest-section">
            <div className="container">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </div>
        </div>
    );

    if (error) {
        console.log('Latest products error:', error);
        // Let it continue to render empty state
    }

    const bgClasses = ['bg-default', 'bg-split', 'bg-grey', 'bg-blue'];

    return (
        <div className="latest-section">
            <div className="container">
                <header className="header">
                    <h1 className="main-title">Latest Shoes</h1>
                    <p className="subtitle">
                        Explore our latest shoe collection - blending fashion and functionality<br />
                        for every step you take.
                    </p>
                </header>
            </div>
            <div className="container">
                <div className="shoe-grid">
                    {products.length === 0 ? (
                        <Box className="empty-list" sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No products found. Please check back later!
                            </Typography>
                        </Box>
                    ) : (
                        products.map((product, index) => (
                            <ShoeCard
                                key={product._id}
                                id={product._id}
                                image={product.productImages?.[0] ? `${REACT_APP_API_URL}/${product.productImages[0]}` : '/img/logo/logo-vector.png'}
                                hoverImage={product.productImages?.[1] ? `${REACT_APP_API_URL}/${product.productImages[1]}` : (product.productImages?.[0] ? `${REACT_APP_API_URL}/${product.productImages[0]}` : '/img/logo/logo-vector.png')}
                                title={product.productTitle}
                                category="Sneakers"
                                price={`$${product.productPrice.toLocaleString()}`}
                                onSale={false}
                                className={bgClasses[index % bgClasses.length]}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoeCollection;