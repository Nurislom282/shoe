import React from 'react';
import Link from 'next/link';

const OurCollectionBox = () => {
    return (
        <section className="our-collection-section">
            <div className="container">
                <div className="collection-header">
                    <h2>Our Latest Collctions</h2>
                    <p>*Embark on a journey of style and innovation with our latest collections at NX Shoez.</p>
                </div>
            </div>
            <div className="container">
                <div className="collection-grid">
                    <div className="collection-card">
                        <div className="card-content">
                            <h3>LUXE PACE</h3>
                            <Link href="/collection/luxe-pace">
                                <span className="shop-link">Shop Now</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/img/banner/shoe.png" alt="Luxe Pace" />
                        </div>
                    </div>

                    <div className="collection-card">
                        <div className="card-content">
                            <h3>EVOLVE FOOTWEAR</h3>
                            <Link href="/collection/evolve-footwear">
                                <span className="shop-link">Shop Now</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/img/banner/shoe2.png" alt="Evolve Footwear" />
                        </div>
                    </div>

                    <div className="collection-card">
                        <div className="card-content">
                            <h3>STELLAR SOLE</h3>
                            <Link href="/collection/stellar-sole">
                                <span className="shop-link">Shop Now</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/img/banner/shoe3.png" alt="Stellar Sole" />
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default OurCollectionBox;
