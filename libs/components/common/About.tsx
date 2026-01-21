import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const About = () => {
    const { t } = useTranslation('common');

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
                        <div className="about-description-box">
                            <h2>{t('about_common.title')}</h2>
                            <p>
                                {t('about_common.desc')}
                            </p>
                        </div>
                        <Link href="/shop">
                            <button className="about-button">{t('about_common.button')}</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;