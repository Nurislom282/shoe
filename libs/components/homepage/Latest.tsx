import React from 'react';

const Latest = () => {
    const shoes = [
        {
            id: 1,
            name: 'Eclipse Stride',
            brand: 'Oxford',
            price: '95.00',
            image: '/img/banner/shoe.png',
            sale: true
        },
        {
            id: 2,
            name: 'LunarPulse',
            brand: 'Oxford',
            price: '80.00',
            image: '/img/banner/shoe2.png',
            sale: true
        },
        {
            id: 3,
            name: 'Mystic Glide',
            brand: 'Oxford',
            price: '95.00',
            image: '/img/banner/shoe3.png',
            sale: true
        },
        {
            id: 4,
            name: 'NovaGrip Blaze',
            brand: 'Oxford',
            price: '95.00',
            image: '/img/banner/shoe.png',
            sale: true
        }
    ];

    return (
        <div className="latest-section">
            <div className="container">
                <div className="latest-header">
                    <h2>Latest Shoes</h2>
                    <p>
                        Explore our latest shoe collection - blending fashion and functionality
                        <br />
                        for every step you take.
                    </p>
                </div>

                <div className="latest-grid">
                    {shoes.map((shoe, index) => (
                        <div key={shoe.id} className={`shoe-card shoe-card-${index + 1}`}>
                            {shoe.sale && <span className="sale-badge">Sale</span>}
                            <div className="shoe-image-container">
                                <img src={shoe.image} alt={shoe.name} className="shoe-image" />
                            </div>
                            <div className="shoe-info">
                                <h3>{shoe.name}</h3>
                                <p className="brand">{shoe.brand}</p>
                                <p className="price">$ {shoe.price} USD</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Latest;
