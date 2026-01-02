import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack } from '@mui/material';

const Banner = () => {
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
                        <span className="subtitle">Subscribe Our Newsletter</span>
                        <h2>Get the latest offers early.</h2>
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
