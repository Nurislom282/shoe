import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Adds = () => {
    const device = useDeviceDetect();
    const [mounted, setMounted] = React.useState(false);

    const brands = [
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfe_customers_7.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc01_customers_6.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbff_customers_2.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc03_customers_5.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc00_bronx.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfd_customers_8.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edc02_customers_4.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfa_customers_9.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbfc_customers_1.svg',
        'https://cdn.prod.website-files.com/65a62949580c5ed45b48f683/6855c1f678f1e279043edbf9_customers_3.svg'
    ];

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (device === 'mobile') {
        return <Stack className={'adds'}>Mobile Adds</Stack>;
    } else {
        return (
            <section className="brands-section">
                <div className="brands-slider">
                    {[...brands, ...brands].map((brand, index) => (
                        <div key={index} className="brand-item">
                            <img src={brand} alt="Brand" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }
};

export default Adds;
