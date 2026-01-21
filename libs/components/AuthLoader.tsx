import React, { useEffect } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_MEMBER } from '../../apollo/user/query';
import { updateUserInfo } from '../auth';

const AuthLoader = () => {
    const user = useReactiveVar(userVar);
    const [getMember, { data }] = useLazyQuery(GET_MEMBER);

    useEffect(() => {
        if (user._id && !user.memberImage) {
            console.log('Hydrating user data...');
            getMember({ variables: { input: user._id } });
        }
    }, [user._id, user.memberImage]);

    useEffect(() => {
        if (data?.getMember) {
            console.log('User data hydrated:', data.getMember);
            // We manually update the userVar with the fetched data
            // preserving the existing token-based data but overwriting with fresh DB data
            const userData = data.getMember;
            userVar({
                ...user,
                ...userData,
            });
        }
    }, [data]);

    return null;
};

export default AuthLoader;
