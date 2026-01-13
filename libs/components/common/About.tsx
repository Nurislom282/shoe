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

                            <div id="orbit-1" className="orbit">
                                <img src="/img/banner/shoe.png" alt="Shoe 1" />
                                <img src="/img/banner/shoe2.png" alt="Shoe 2" />
                            </div>

                            <div id="orbit-2" className="orbit" >
                                <img src="/img/banner/shoe.png" alt="Shoe 4" />
                                <img src="/img/banner/shoe2.png" alt="Shoe 5" />
                            </div>

                            <div id="orbit-3" className='orbit'>
                                <img src="/img/banner/shoe3.png" alt="Shoe 6" />
                                <img src="/img/banner/shoe.png" alt="Shoe 7" />
                            </div>
                        </div>
                    </div>

                    <div className="about-text">
                        <h2>About ShoeZ</h2>
                        <p>
                            ShoeZ is a premium online store specializing in comfortable and stylish footwear. Our mission is to provide our customers with the best possible shopping experience, offering a wide range of high-quality shoes at competitive prices.
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