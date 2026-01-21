import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '../../apollo/user/query';

/**
 * Fetch a list of products with pagination and filters
 */
export const useGetProducts = (input: any) => {
    // input structure: { page: 1, limit: 10, search: { typeList: [], seasons: [], ... } }
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
        variables: { input },
        fetchPolicy: 'cache-and-network',
    });
    return {
        products: data?.getProducts?.list || [],
        meta: data?.getProducts?.metaCounter?.[0],
        loading,
        error,
        refetch,
    };
};

/**
 * Fetch a single product detail
 */
export const useGetProduct = (productId: string, memberId?: string) => {
    const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
        variables: { productId, memberId },
        skip: !productId,
    });
    return {
        product: data?.getProduct,
        loading,
        error,
        refetch,
    };
};
