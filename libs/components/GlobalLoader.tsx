import React, { useEffect, useState } from 'react';

interface GlobalLoaderProps {
    open: boolean;
}

const GlobalLoader = ({ open }: GlobalLoaderProps) => {
    const [classes, setClasses] = useState({
        professional: '',
        shoeSelling: '',
        platform: '',
        textContainer: '',
        logoContainer: '',
        redWipe: '',
        pageLoader: '',
    });

    useEffect(() => {
        if (open) {
            const sequences = [
                setTimeout(() => setClasses((prev) => ({ ...prev, professional: 'appear' })), 300),
                setTimeout(() => setClasses((prev) => ({ ...prev, shoeSelling: 'appear' })), 350),
                setTimeout(() => setClasses((prev) => ({ ...prev, platform: 'appear' })), 600),
                setTimeout(() => setClasses((prev) => ({ ...prev, platform: 'hide' })), 2600),
                setTimeout(
                    () =>
                        setClasses((prev) => ({ ...prev, professional: 'hide-up', shoeSelling: 'hide-up' })),
                    2600,
                ),
                setTimeout(() => setClasses((prev) => ({ ...prev, logoContainer: 'show' })), 3000),
                setTimeout(() => setClasses((prev) => ({ ...prev, redWipe: 'animate' })), 4000),
                setTimeout(() => setClasses((prev) => ({ ...prev, logoContainer: 'show hide' })), 6100),
                setTimeout(() => setClasses((prev) => ({ ...prev, pageLoader: 'fade-out' })), 6600),
            ];

            return () => sequences.forEach(clearTimeout);
        } else {
            setClasses({
                professional: '',
                shoeSelling: '',
                platform: '',
                textContainer: '',
                logoContainer: '',
                redWipe: '',
                pageLoader: '',
            });
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className={`page-loader ${classes.pageLoader}`}>
            <div className={`text-container ${classes.textContainer}`}>
                <span className={`professional-text ${classes.professional}`}>Professional </span>
                <span className={`shoe-selling ${classes.shoeSelling}`}> Shoe-Selling </span>
                <span className={`platform-text ${classes.platform}`}> Platform </span>
            </div>

            <div className={`logo-container ${classes.logoContainer}`}>
                <div className="logo-wrapper">
                    <div className="logo-text">Shoez NX</div>
                    <div className={`red-wipe ${classes.redWipe}`}></div>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
