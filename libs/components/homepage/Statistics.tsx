import React from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Statistics = () => {
    return (
        <div className="statistics-section">
            <div className="container">
                <div className="statistics-grid">
                    <div className="stat-item">
                        <div className="stat-icon">
                            <LocalShippingOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>Free Delivery</h3>
                            <p>Free shipping on all order</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <HeadsetMicOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>ONLINE SUPPORT 24/7</h3>
                            <p>Support online 24 hours a day</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <CachedOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>MONEY RETURN</h3>
                            <p>Support online 24 hours a day</p>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">
                            <LockOutlinedIcon />
                        </div>
                        <div className="stat-content">
                            <h3>SECURE PAYMENT</h3>
                            <p>Support online 24 hours a day</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
