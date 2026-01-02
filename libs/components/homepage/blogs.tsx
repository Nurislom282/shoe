import React from 'react';
import Link from 'next/link';

const Blogs = () => {
    const blogs = [
        {
            id: 1,
            category: 'BRAND SPOTLIGHT',
            title: 'Step into Style: Your Guide to Perfect Shoes',
            image: '/img/banner/shoe.png',
            link: '/blog/step-into-style'
        },
        {
            id: 2,
            category: 'SHOE CARE',
            title: 'Trendy Steps: Unveiling Seasonal Shoe Must-Haves',
            image: '/img/banner/shoe2.png',
            link: '/blog/trendy-steps'
        },
        {
            id: 3,
            category: 'FASHION',
            title: 'Sneakers to Stilettos: Exploring Iconic Shoe Styles',
            image: '/img/banner/shoe3.png',
            link: '/blog/sneakers-to-stilettos'
        }
    ];

    return (
        <section className="blogs-section">
            <div className="container">
                <div className="blogs-header">
                    <h2>Our Blogs</h2>
                    <p>"Welcome to the NX Shoez Blog, where fashion meets insight, and every step is a story waiting to be told."</p>
                </div>
            </div>
            <div className="container">
                <div className="blog-grid">
                    {blogs.map((blog) => (
                        <div className="blog-card" key={blog.id}>
                            <div className="card-image">
                                <span className={`category-badge ${blog.category.toLowerCase().replace(' ', '-')}`}>
                                    {blog.category}
                                </span>
                                <img src={blog.image} alt={blog.title} />
                            </div>
                            <div className="card-content">
                                <h3>{blog.title}</h3>
                                <div className="link-wrapper">
                                    <Link href={blog.link}>
                                        <span>View Details</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section >
    );
};

export default Blogs;
