import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import BoardArticleForm from '../../../libs/components/admin/community/BoardArticleForm';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_BOARD_ARTICLE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_BOARD_ARTICLE } from '../../../apollo/user/query';
import { BoardArticleInput } from '../../../libs/types/board-article/board-article.input';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useRouter } from 'next/router';

const EditArticle: NextPage = () => {
    const router = useRouter();
    const { articleId } = router.query;
    const [updateBoardArticleByAdmin, { loading: updateLoading }] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);

    const { data, loading: getLoading, error } = useQuery(GET_BOARD_ARTICLE, {
        variables: { input: articleId }, // Query takes 'input' as string based on type definition
        skip: !articleId,
        fetchPolicy: 'network-only'
    });

    if (getLoading) return <div style={{ padding: '40px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '40px' }}>Error loading article.</div>;
    if (!data?.getBoardArticle) return <div style={{ padding: '40px' }}>Article not found.</div>;

    const article = data.getBoardArticle;

    const initialValues: BoardArticleInput = {
        articleTitle: article.articleTitle,
        articleContent: article.articleContent,
        articleCategory: article.articleCategory,
        articleImage: article.articleImage,
        memberId: article.memberId,
    };

    const handleSubmit = async (formData: BoardArticleInput) => {
        try {
            const updateInput = {
                _id: articleId,
                ...formData
            };

            await updateBoardArticleByAdmin({
                variables: {
                    input: updateInput,
                },
            });
            sweetTopSmallSuccessAlert('Article updated successfully!', 2000);
            router.push('/_admin/community');
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    };

    return (
        <div className={'content'}>
            <div className={'title flex_space'} style={{ marginBottom: '32px' }}>
                <Typography variant={'h2'}>Edit Article</Typography>
            </div>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <BoardArticleForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    loading={updateLoading}
                />
            </div>
        </div>
    );
};

export default withAdminLayout(EditArticle);
