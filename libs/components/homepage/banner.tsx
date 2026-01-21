import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';

const Banner = () => {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
        // Handle subscription logic here
        console.log("Subscribing with:", email);
        setEmail("");
    };

    return (
        <section className="banner-section">
            <div className="container">
                <Stack className="banner-wrapper">
                    <Stack className="banner-content">
                        <span className="subtitle">{t('home.banner.subtitle')}</span>
                        <h2>{t('home.banner.title')}</h2>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={handleSubscribe}>
                                <SendIcon />
                            </button>
                        </div>
                    </Stack>
                    <div className="banner-image">
                        <img src="/img/banner/shoe.png" alt="Shoe Banner" />
                        {/* Decorative floating elements could be added here if needed */}
                    </div>
                </Stack>
            </div>
        </section>
    );
};

export default Banner;
