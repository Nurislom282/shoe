import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { Direction } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { Box, Typography } from '@mui/material';

const Blogs = () => {
    const { t } = useTranslation('common');
    const [blogs, setBlogs] = useState<BoardArticle[]>([]);

    const { loading, error } = useQuery(GET_BOARD_ARTICLES, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                page: 1,
                limit: 3,
                sort: 'createdAt',
                direction: Direction.DESC,
                search: {},
            },
        },
        onCompleted: (data) => {
            if (data?.getBoardArticles?.list?.length > 0) {
                setBlogs(data.getBoardArticles.list);
            }
        },
    });

    if (error) {
        console.log('Blogs error:', error);
    }

    return (
        <section className="blogs-section">
            <div className="container">
                <div className="blogs-header">
                    <h2>{t('Our Blogs')}</h2>
                    <p>{t('Welcome to the NX Shoez Blog...')}</p>
                </div>
            </div>
            <div className="container">
                <div className="blog-grid">
                    {blogs.length === 0 ? (
                        <div className="empty-list" style={{ textAlign: 'center', width: '100%', padding: '32px 0' }}>
                            <Typography>{t('No blogs found.')}</Typography>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div className="blog-card" key={blog._id}>
                                <div className="card-image">
                                    <span className={`category-badge ${blog.articleCategory?.toLowerCase().replace(' ', '-') || 'news'}`}>
                                        {blog.articleCategory}
                                    </span>
                                    <img
                                        src={(() => {
                                            const url = blog.articleImage;
                                            if (!url) return '/img/event/default-event.jpg';
                                            if (url.startsWith('http')) return url;
                                            if (url.startsWith('localhost')) return `http://${url}`;
                                            return `${REACT_APP_API_URL}/${url}`;
                                        })()}
                                        alt={blog.articleTitle}
                                        className="product-image main"
                                    />
                                </div>
                                <div className="card-content">
                                    <h3>{blog.articleTitle}</h3>
                                    <div className="link-wrapper">
                                        <Link href={`/blog/detail?id=${blog._id}`}>
                                            <span>{t('View Details')}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </section >
    );
};

export default Blogs;
