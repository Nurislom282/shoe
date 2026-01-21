import React from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Money } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';

const Statistics = () => {
    const { t } = useTranslation('common');

    return (
        <div className="statistics-section">
            <div className="container">
                <div className="statistics-grid">
                    <div className="stat-item">
                        <div className="stat-icon">
                            <LocalShippingOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>{t('home.stats.free_delivery')}</h3>
                            <p>{t('home.stats.free_delivery_desc')}</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <HeadsetMicOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>{t('home.stats.online_support')}</h3>
                            <p>{t('home.stats.online_support_desc')}</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <Money />
                        </div>
                        <div className="stat-content">
                            <h3>{t('home.stats.money_return')}</h3>
                            <p>{t('home.stats.money_return_desc')}</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <LockOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>{t('home.stats.secure_payment')}</h3>
                            <p>{t('home.stats.secure_payment_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
