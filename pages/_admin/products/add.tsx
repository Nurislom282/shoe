import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import ProductForm from '../../../libs/components/admin/products/ProductForm';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../../apollo/user/mutation';
import { ProductInput } from '../../../libs/types/product/product.input';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useRouter } from 'next/router';

const AddProduct: NextPage = () => {
    const router = useRouter();
    const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);

    const handleSubmit = async (data: ProductInput) => {
        try {
            await createProduct({
                variables: {
                    input: {
                        ...data,
                        images: data.images.map((image: any) => {
                            return typeof image === 'string' ? { url: image } : image;
                        }),
                    },
                },
            });
            sweetTopSmallSuccessAlert('Product created successfully!', 2000);
            router.push('/_admin/products');
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    };

    return (
        <div className={'content'}>
            <div className={'title flex_space'} style={{ marginBottom: '32px' }}>
                <Typography variant={'h2'}>Add New Product</Typography>
            </div>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <ProductForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};

export default withAdminLayout(AddProduct);
