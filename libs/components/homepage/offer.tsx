import React from 'react';
import Link from 'next/link';

const Offer = () => {
    return (
        <div className="offer-section">
            <div className="container">
                <div className="header">
                    <h2 className="main-title">Shoe Offers</h2>
                    <p className="subtitle">
                        Browse our top diverse collection and find the perfect pair that suits<br />
                        your personality.
                    </p>
                </div>
            </div>
            <div className='container'>
                <div className="offer-grid">
                    {/* Column 1: Tall Card */}
                    <div className="offer-col tall">
                        <div className="offer-card">
                            <img src="/img/banner/shoe.png" alt="Summit Sneakers" className="bg-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>Summit Sneakers</h3>
                                    <p>Hottest Deals Of The Month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Stacked Cards */}
                    <div className="offer-col stacked">
                        <div className="offer-card small">
                            <img src="/img/banner/shoe2.png" alt="Turbo Trainers" className="bg-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>Turbo Trainers</h3>
                                    <p>Grab The Latest Shoes</p>
                                </div>
                            </div>
                        </div>
                        <div className="offer-card small">
                            <img src="/img/banner/shoe3.png" alt="Dapper Derby Elegance" className="bg-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>Dapper Derby Elegance</h3>
                                    <p>100+ Products Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Tall Card */}
                    <div className="offer-col tall">
                        <div className="offer-card">
                            <img src="/img/banner/shoe.png" alt="Refined Oxford Classics" className="bg-img flipped" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>Refined Oxford Classics</h3>
                                    <p>Imported From USA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Offer;
