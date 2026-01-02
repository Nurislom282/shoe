import React, { useState } from 'react';
import Link from 'next/link';

interface ShoeCardProps {
    id: number;
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
                    <Link href={`/property/detail?id=${id}`}>
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
    const shoes = [
        {
            id: 1,
            title: "Eclipse Stride",
            category: "Oxford",
            price: "$ 95.00 USD",
            onSale: true,
            image: "/img/banner/shoe.png",
            hoverImage: "/img/banner/shoe2.png",
            className: "bg-default"
        },
        {
            id: 2,
            title: "LunarPulse",
            category: "Oxford",
            price: "$ 80.00 USD",
            onSale: false,
            image: "/img/banner/shoe2.png",
            hoverImage: "/img/banner/shoe3.png",
            className: "bg-split"
        },
        {
            id: 3,
            title: "Mystic Glide",
            category: "Oxford",
            price: "$ 95.00 USD",
            onSale: true,
            image: "/img/banner/shoe3.png",
            hoverImage: "/img/banner/shoe.png",
            className: "bg-grey"
        },
        {
            id: 4,
            title: "NovaGrip Blaze",
            category: "Oxford",
            price: "$ 95.00 USD",
            onSale: true,
            image: "/img/banner/shoe.png",
            hoverImage: "/img/banner/shoe3.png",
            className: "bg-blue"
        }
    ];

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
                    {shoes.map(shoe => (
                        <ShoeCard key={shoe.id} {...shoe} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShoeCollection;