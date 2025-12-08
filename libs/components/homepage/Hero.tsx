import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const Hero = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1>Embrace Comfort with ShoeZ - Online Ecommerce Shop!</h1>
                        <p>
                            Step into a world of style and comfort with ShoeZ, where every pair of shoes tells a story
                            of craftsmanship and innovation. Explore our curated collection, where trends seamlessly
                            merge with unparalleled ease.
                        </p>
                        <Link href="/about">
                            <button className="cta-button">Learn About Us</button>
                        </Link>
                    </div>

                    <div className="hero-right">
                        <Swiper
                            className="shoe-swiper"
                            pagination={{
                                el: '.swiper-pagination',
                                clickable: true,
                                bulletClass: 'swiper-pagination-bullet',
                                bulletActiveClass: 'swiper-pagination-bullet-active',
                            }}
                            autoplay={{
                                delay: 4500,
                                disableOnInteraction: false,
                            }}
                            modules={[Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        >
                            <SwiperSlide>
                                <div className="shoe-container">
                                    <img
                                        src="/img/banner/shoe.png"
                                        alt="Premium ShoeZ Sneaker"
                                        className="shoe-image"
                                    />
                                    <div className="price-tag" key={`price-0-${activeIndex}`}>
                                        <div className="ping-circle"></div>
                                        <div className="price-line"></div>
                                        <span className="price-value">$550</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="shoe-container">
                                    <img
                                        src="/img/banner/shoe2.png"
                                        alt="Urban Runner"
                                        className="shoe-image"
                                    />
                                    <div className="price-tag" key={`price-1-${activeIndex}`}>
                                        <div className="ping-circle"></div>
                                        <div className="price-line"></div>
                                        <span className="price-value">$320</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="shoe-container">
                                    <img
                                        src="/img/banner/shoe3.png"
                                        alt="Classic Loafer"
                                        className="shoe-image"
                                    />
                                    <div className="price-tag" key={`price-2-${activeIndex}`}>
                                        <div className="ping-circle"></div>
                                        <div className="price-line"></div>
                                        <span className="price-value">$250</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <div className="swiper-pagination"></div>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;