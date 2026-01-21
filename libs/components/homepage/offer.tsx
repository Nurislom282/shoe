import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Offer = () => {
    const { t } = useTranslation('common');
    const router = useRouter();

    const handleSeasonClick = (season: string) => {
        router.push(`/shop?seasons=${season}`);
    };

    return (
        <div className="offer-section">
            <div className="container">
                <div className="header">
                    <h2 className="main-title">{t('home.offer.title')}</h2>
                    <p className="subtitle">
                        {t('home.offer.subtitle')}
                    </p>
                </div>
            </div>
            <div className='container'>
                <div className="offer-grid">
                    {/* Column 1: Tall Card */}
                    <div className="offer-col tall">
                        <div
                            className="offer-card"
                            onClick={() => handleSeasonClick('Spring')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/img/season-shoes/spring.jpg" alt="Summit Sneakers" className="bg-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>{t('home.offer.spring')}</h3>
                                    <p>{t('home.offer.spring_sub')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Stacked Cards */}
                    <div className="offer-col stacked">
                        <div
                            className="offer-card small"
                            onClick={() => handleSeasonClick('Summer')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/img/season-shoes/summer.jpg" alt="Turbo Trainers" className="bg-img summer-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>{t('home.offer.summer')}</h3>
                                    <p>{t('home.offer.summer_sub')}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="offer-card small"
                            onClick={() => handleSeasonClick('Autumn')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/img/season-shoes/autumn.jpg" alt="Dapper Derby Elegance" className="bg-img autumn-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>{t('home.offer.autumn')}</h3>
                                    <p>{t('home.offer.autumn_sub')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Tall Card */}
                    <div className="offer-col tall">
                        <div
                            className="offer-card"
                            onClick={() => handleSeasonClick('Winter')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/img/season-shoes/winter.jpg" alt="Refined Oxford Classics" className="bg-img flipped winter-img" />
                            <div className="overlay">
                                <div className="content">
                                    <h3>{t('home.offer.winter')}</h3>
                                    <p>{t('home.offer.winter_sub')}</p>
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