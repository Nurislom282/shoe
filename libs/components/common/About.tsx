import React from 'react';
import Link from 'next/link';

const About = () => {
    return (
        <div className="about-section">
            <div className="container">
                <div className="about-content">
                    <div className="about-images">
                        {/* Center shoe */}
                        <div className="shoe-item shoe-3">
                            <img src="/img/banner/shoe3.png" alt="Shoe 3" />
                        </div>

                        {/* Orbiting shoes */}
                        <div className="shoe-orbit">
                            <div className="shoe-item shoe-1">
                                <img src="/img/banner/shoe.png" alt="Shoe 1" />
                            </div>
                            <div className="shoe-item shoe-2">
                                <img src="/img/banner/shoe2.png" alt="Shoe 2" />
                            </div>
                            <div className="shoe-item shoe-4">
                                <img src="/img/banner/shoe.png" alt="Shoe 4" />
                            </div>
                            <div className="shoe-item shoe-5">
                                <img src="/img/banner/shoe2.png" alt="Shoe 5" />
                            </div>
                            <div className="shoe-item shoe-6">
                                <img src="/img/banner/shoe3.png" alt="Shoe 6" />
                            </div>
                            <div className="shoe-item shoe-7">
                                <img src="/img/banner/shoe.png" alt="Shoe 7" />
                            </div>
                        </div>
                    </div>

                    <div className="about-text">
                        <h2>About ShoeZ</h2>
                        <p>
                            Discover the Shoez story. We're passionate about creating footwear that not only
                            complements your style but also prioritizes comfort and quality.
                        </p>
                        <Link href="/property">
                            <button className="about-button">View Our Products</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;