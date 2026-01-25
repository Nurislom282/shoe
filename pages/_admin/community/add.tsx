import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import BoardArticleForm from '../../../libs/components/admin/community/BoardArticleForm';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { BoardArticleInput } from '../../../libs/types/board-article/board-article.input';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useRouter } from 'next/router';

const AddArticle: NextPage = () => {
    const router = useRouter();
    const [createBoardArticle, { loading }] = useMutation(CREATE_BOARD_ARTICLE);

    const handleSubmit = async (data: BoardArticleInput) => {
        try {
            await createBoardArticle({
                variables: {
                    input: data,
                },
            });
            sweetTopSmallSuccessAlert('Article created successfully!', 2000);
            router.push('/_admin/community');
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    };

    return (
        <div className={'content'}>
            <div className={'title flex_space'} style={{ marginBottom: '32px' }}>
                <Typography variant={'h2'}>Write New Article</Typography>
            </div>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <BoardArticleForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};

export default withAdminLayout(AddArticle);
