import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const OurCollectionBox = () => {
    const { t } = useTranslation('common');

    return (
        <section className="our-collection-section">
            <div className="container">
                <div className="collection-header">
                    <h2>{t('home.collection_box.title')}</h2>
                    <p>{t('home.collection_box.subtitle')}</p>
                </div>
            </div>
            <div className="container">
                <div className="collection-grid">
                    <div className="collection-card">
                        <div className="card-content">
                            <h3>{t('home.collection_box.luxe_pace')}</h3>
                            <Link href="/shop">
                                <span className="shop-link">{t('home.collection_box.shop_now')}</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/img/banner/shoe.png" alt="Luxe Pace" />
                        </div>
                    </div>

                    <div className="collection-card">
                        <div className="card-content">
                            <h3>{t('home.collection_box.evolve')}</h3>
                            <Link href="/shop">
                                <span className="shop-link">{t('home.collection_box.shop_now')}</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/img/banner/shoe2.png" alt="Evolve Footwear" />
                        </div>
                    </div>

                    <div className="collection-card">
                        <div className="card-content">
                            <h3>{t('home.collection_box.stellar')}</h3>
                            <Link href="/shop">
                                <span className="shop-link">{t('home.collection_box.shop_now')}</span>
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
