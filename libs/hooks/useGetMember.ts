import { useQuery } from '@apollo/client';
import { GET_MEMBER } from '../../apollo/user/query';
import { Member } from '../types/member/member';

// ==========================================
// Custom Hook: useGetMember
// ==========================================
interface UseGetMemberResponse {
    member: Member | undefined;
    loading: boolean;
    error: any;
    refetch: (variables?: any) => Promise<any>;
}

export const useGetMember = (memberId: string): UseGetMemberResponse => {
    const { data, loading, error, refetch } = useQuery(GET_MEMBER, {
        variables: { input: memberId }, // Matching the query definition $input
        skip: !memberId, // Skip query if no memberId provided
        fetchPolicy: 'network-only', // Ensure fresh data
        notifyOnNetworkStatusChange: true,
    });

    return {
        member: data?.getMember,
        loading,
        error,
        refetch
    };
};
