import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import UserForm from '../../../libs/components/admin/users/UserForm';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_MEMBER } from '../../../apollo/user/query';
import { AdminMemberUpdate } from '../../../libs/types/member/member.update';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useRouter } from 'next/router';

const EditUser: NextPage = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [updateMemberByAdmin, { loading: updateLoading }] = useMutation(UPDATE_MEMBER_BY_ADMIN);

    const { data, loading: getLoading, error } = useQuery(GET_MEMBER, {
        variables: { input: userId },
        skip: !userId,
        fetchPolicy: 'network-only'
    });

    if (getLoading) return <div style={{ padding: '40px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '40px' }}>Error loading user.</div>;
    if (!data?.getMember) return <div style={{ padding: '40px' }}>User not found.</div>;

    const member = data.getMember;

    const initialValues: AdminMemberUpdate = {
        _id: member._id,
        memberNick: member.memberNick,
        memberPhone: member.memberPhone,
        memberType: member.memberType,
        memberStatus: member.memberStatus,
        memberDesc: member.memberDesc,
        memberImage: member.memberImage
    };

    const handleSubmit = async (formData: AdminMemberUpdate) => {
        try {
            await updateMemberByAdmin({
                variables: {
                    input: formData,
                },
            });
            sweetTopSmallSuccessAlert('Member updated successfully!', 2000);
            router.push('/_admin/users');
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    };

    return (
        <div className={'content'}>
            <div className={'title flex_space'} style={{ marginBottom: '32px' }}>
                <Typography variant={'h2'}>Edit Member</Typography>
            </div>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <UserForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    loading={updateLoading}
                />
            </div>
        </div>
    );
};

export default withAdminLayout(EditUser);
