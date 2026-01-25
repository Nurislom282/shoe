import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import ProductForm from '../../../libs/components/admin/products/ProductForm';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PRODUCT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';
import { ProductInput } from '../../../libs/types/product/product.input';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useRouter } from 'next/router';

const EditProduct: NextPage = () => {
    const router = useRouter();
    const { productId } = router.query;
    const [updateProductByAdmin, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT_BY_ADMIN);

    const { data, loading: getLoading, error } = useQuery(GET_PRODUCT, {
        variables: { productId: productId },
        skip: !productId,
        fetchPolicy: 'network-only'
    });

    if (getLoading) return <div style={{ padding: '40px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '40px' }}>Error loading product.</div>;
    if (!data?.getProduct) return <div style={{ padding: '40px' }}>Product not found.</div>;

    const product = data.getProduct;

    // Transform product data to ProductInput format if necessary
    const initialValues: ProductInput = {
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.category,
        brand: product.brand,
        status: product.status,
        description: product.description,
        images: product.images?.map((img: any) => img.url) || [],
        colors: product.colors,
        stock: {
            total: product.stock?.total || 0,
            sizes: product.stock?.sizes?.map((s: any) => ({ size: s.size, count: s.count })) || []
        },
        gender: product.gender || ['MEN'],
    };

    const handleSubmit = async (formData: ProductInput) => {
        try {
            // Construct update input. Ensure _id is passed if required by handling in variable construction
            const updateInput = {
                _id: productId,
                ...formData,
                images: formData.images.map((image: any) => {
                    return typeof image === 'string' ? { url: image } : image;
                }),
            };

            await updateProductByAdmin({
                variables: {
                    input: updateInput,
                },
            });
            sweetTopSmallSuccessAlert('Product updated successfully!', 2000);
            router.push('/_admin/products');
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    };

    return (
        <div className={'content'}>
            <div className={'title flex_space'} style={{ marginBottom: '32px' }}>
                <Typography variant={'h2'}>Edit Product</Typography>
            </div>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <ProductForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    loading={updateLoading}
                />
            </div>
        </div>
    );
};

export default withAdminLayout(EditProduct);
