import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { Box, Stack, Typography } from '@mui/material';
import { Direction } from '../../enums/common.enum';
import { ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';
import { useTranslation } from 'next-i18next';

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
    const { t } = useTranslation('common');

    return (
        <div
            className="shoe-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {onSale && <span className="sale-badge">{t('home.latest.sale')}</span>}
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
                        <button className="view-product-btn">{t('home.latest.view_product')}</button>
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
    const router = useRouter();
    const { t } = useTranslation('common');
    const [products, setProducts] = useState<Product[]>([]);
    const categoryQuery = router.query.category as string;
    const activeCategory = categoryQuery || 'LATEST';

    const { loading, error, refetch } = useQuery(GET_PRODUCTS, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                page: 1,
                limit: 3,
                sort: 'createdAt',
                direction: Direction.DESC,
                search: activeCategory === 'LATEST' ? {} : { text: activeCategory },
            },
        },
        onCompleted: (data) => {
            if (data?.getProducts?.list) {
                // If filtering, prioritize fetched data. If not filtering (LATEST), show mix with mock or just fetched?
                // The original code appended mock data.
                // Dynamic behavior: if we have fetched data, show it.
                // If it's a specific category and we have results, show them.
                // Keeping original behavior of appending for now but maybe clearer to just show fetched if available.
                // However, user asked for dynamic. mixing mock might differ from real data.
                // Let's replace mock data if we have real data result, or if we are filtering.
                if (data.getProducts.list.length > 0) {
                    setProducts(data.getProducts.list);
                } else {
                    setProducts([]);
                }
            }
        },
    });

    // Effect to handle mock data fallback if needed or initial load
    useEffect(() => {
        if (activeCategory === 'LATEST' && !loading && products.length === 0) {
            // Fallback to mock if latest has no data?
            // Or maybe just for the initial render before data arrives.
            // Actually, the onCompleted handles the setProducts.
        }
    }, [activeCategory, loading]);


    const handleCategoryClick = (category: string) => {
        const { category: _category, ...rest } = router.query;
        const query = category === 'LATEST' ? { ...rest } : { ...rest, category };

        router.push(
            {
                pathname: router.pathname,
                query,
            },
            undefined,
            { scroll: false }
        );
    };

    if (loading) return (
        <div className="collection-latest-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Typography>{t('home.latest.loading')}</Typography>
                </div>
            </div>
        </div>
    );

    if (error) {
        console.log('Latest products error:', error);
        // Let it continue but maybe show error message?
    }

    const bgClasses = ['bg-default', 'bg-split', 'bg-grey', 'bg-blue'];
    const categories = ['LATEST', 'SNEAKERS', 'BOOTS', 'FORMAL', 'OXFORD', 'SPORTS SHOE', 'HIGH NECK', 'LOAFERS'];

    return (
        <section className="collection-latest-section">
            <header className="section-header">
                <h2 className="title">{t('home.latest.title')}</h2>
                <p className="subtitle">
                    {t('home.latest.subtitle')}
                </p>
            </header>
            <div className="container">
                <div className="collection-content">
                    <aside className="category-sidebar">
                        <ul>
                            {categories.map((cat) => (
                                <li
                                    key={cat}
                                    className={activeCategory === cat ? 'active' : ''}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {t(`home.latest.categories.${cat.toLowerCase().replace(' ', '_')}`)}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <div className="main-col">


                        <div className="product-grid">
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', width: '100%' }}>
                                    <Typography>{t('home.latest.loading')}</Typography>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="empty-list" style={{ textAlign: 'center', padding: '64px 0', width: '100%' }}>
                                    <Typography variant="h5" sx={{ color: '#999', mt: 2, fontStyle: 'italic', fontWeight: 500 }}>
                                        {t('home.latest.no_product')}
                                    </Typography>
                                </div>
                            ) : (
                                products.map((product, index) => (
                                    <div
                                        className="collection-shoe-card"
                                        key={product._id}
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                    >
                                        <div className={`card-image ${bgClasses[index % bgClasses.length]}`}>
                                            {false && <span className="sale-badge">{t('home.latest.sale')}</span>}
                                            <Link href={`/product/detail?id=${product._id}`} className="link-wrapper">
                                                <img
                                                    src={
                                                        product.images?.[0]?.url
                                                            ? product.images[0].url.startsWith('http')
                                                                ? product.images[0].url
                                                                : product.images[0].url.startsWith('localhost')
                                                                    ? `http://${product.images[0].url}`
                                                                    : product.images[0].url.startsWith('/')
                                                                        ? product.images[0].url
                                                                        : `${REACT_APP_API_URL}/${product.images[0].url}`
                                                            : '/img/logo/logo-vector.png'
                                                    }
                                                    alt={product.name}
                                                    className="shoe-img base-image"
                                                />
                                                <img
                                                    src={
                                                        product.images?.[1]?.url
                                                            ? product.images[1].url.startsWith('http')
                                                                ? product.images[1].url
                                                                : product.images[1].url.startsWith('localhost')
                                                                    ? `http://${product.images[1].url}`
                                                                    : product.images[1].url.startsWith('/')
                                                                        ? product.images[1].url
                                                                        : `${REACT_APP_API_URL}/${product.images[1].url}`
                                                            : product.images?.[0]?.url
                                                                ? product.images[0].url.startsWith('http')
                                                                    ? product.images[0].url
                                                                    : product.images[0].url.startsWith('localhost')
                                                                        ? `http://${product.images[0].url}`
                                                                        : product.images[0].url.startsWith('/')
                                                                            ? product.images[0].url
                                                                            : `${REACT_APP_API_URL}/${product.images[0].url}`
                                                                : '/img/logo/logo-vector.png'
                                                    }
                                                    alt={product.name}
                                                    className="shoe-img hover-image"
                                                />
                                            </Link>
                                        </div>
                                        <div className="card-info">
                                            <h3 className="shoe-title">{product.name}</h3>
                                            <span className="shoe-category">Sneakers</span>
                                            <div className="price-row">
                                                <span className="shoe-price">${product.price.toLocaleString()} USD</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShoeCollection; 