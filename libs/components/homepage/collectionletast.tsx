import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box, Typography, Button } from '@mui/material';

interface CollectionShoe {
    id: number;
    title: string;
    category: string;
    price: string;
    originalPrice?: string;
    onSale: boolean;
    image: string;
    hoverImage: string;
    className?: string; // For background color classes
}

const CollectionLatest = () => {
    const [activeCategory, setActiveCategory] = useState<string>('LATEST');

    const categories = [
        'LATEST',
        'SNEAKERS',
        'BOOTS',
        'FORMAL',
        'OXFORD',
        'SPORTS SHOE',
        'HIGH NECK',
        'LOAFERS'
    ];

    const shoes: CollectionShoe[] = [
        {
            id: 1,
            title: "Nebula Nectar",
            category: "Oxford",
            price: "$ 80.00 USD",
            onSale: false,
            image: "/img/banner/shoe.png", // Using placeholders based on existing files
            hoverImage: "/img/banner/shoe2.png",
            className: "bg-blue-light"
        },
        {
            id: 2,
            title: "Eclipse Stride",
            category: "Oxford",
            price: "$ 95.00 USD",
            onSale: true,
            image: "/img/banner/shoe2.png",
            hoverImage: "/img/banner/shoe3.png",
            className: "bg-white"
        },
        {
            id: 3,
            title: "StratosSphere",
            category: "Loafers",
            price: "$ 45.00 USD",
            onSale: true,
            image: "/img/banner/shoe3.png",
            hoverImage: "/img/banner/shoe.png",
            className: "bg-gray-light"
        }
    ];

    return (
        <section className="collection-latest-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="title">Shoe By Categories</h2>
                    <p className="subtitle">View Our Most Selling Products By Categories.</p>
                </div>
            </div>
            <div className="container">
                <div className="collection-content">
                    {/* Sidebar */}
                    <div className="category-sidebar">
                        <ul>
                            {categories.map((category) => (
                                <li
                                    key={category}
                                    className={activeCategory === category ? 'active' : ''}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Product Grid */}
                    <div className="product-grid">
                        {shoes.map((shoe) => (
                            <div key={shoe.id} className="collection-shoe-card">
                                <div className={`card-image ${shoe.className || ''}`}>
                                    {shoe.onSale && <span className="sale-badge">Sale</span>}
                                    <Link href={`/property/detail?id=${shoe.id}`}>
                                        <img src={shoe.image} alt={shoe.title} className="shoe-img base-image" />
                                        <img src={shoe.hoverImage} alt={shoe.title} className="shoe-img hover-image" />
                                    </Link>
                                </div>
                                <div className="card-info">
                                    <h3 className="shoe-title">{shoe.title}</h3>
                                    <span className="shoe-category">{shoe.category}</span>
                                    <div className="price-row">
                                        <span className="shoe-category">{/* Duplicate category removed or use for other info */}</span>
                                        <span className="shoe-price">{shoe.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionLatest;
