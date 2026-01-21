import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_RESET, RESET_PASSWORD, VERIFY_RESET_CODE } from '../../apollo/user/mutation';

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

const ForgotPassword: NextPage = () => {
    const router = useRouter();
    const device = useDeviceDetect();

    // STEPS: 0 = Request, 1 = Verify, 2 = Reset
    const [step, setStep] = useState(0);

    // DATA
    const [email, setEmail] = useState('');
    const [userCode, setUserCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    // MUTATIONS
    const [requestReset] = useMutation(REQUEST_PASSWORD_RESET);
    const [verifyCode] = useMutation(VERIFY_RESET_CODE);
    const [resetPassword] = useMutation(RESET_PASSWORD);

    /**
     * Step 0: Request Code
     */
    const handleRequestCode = async () => {
        if (!email) return sweetMixinErrorAlert('Please enter your email');

        try {
            await requestReset({ variables: { email } });
            await sweetTopSuccessAlert('Reset code sent to your email!', 2000);
            setStep(1);
        } catch (err: any) {
            console.log('Error requestReset:', err);
            sweetMixinErrorAlert(err.message || 'Failed to send code');
        }
    };

    /**
     * Step 1: Verification
     */
    const handleVerifyCode = async () => {
        if (!userCode) return sweetMixinErrorAlert('Please enter the code');

        try {
            const result = await verifyCode({ variables: { email, code: userCode } });
            if (result.data.verifyResetCode) {
                setStep(2);
            } else {
                sweetMixinErrorAlert('Invalid code');
            }
        } catch (err: any) {
            console.log('Error verifyCode:', err);
            sweetMixinErrorAlert(err.message || 'Verification failed');
        }
    };

    /**
     * Step 2: Reset Password
     */
    const handleResetPassword = async () => {
        if (newPassword !== repeatPassword) {
            return sweetMixinErrorAlert('Passwords do not match!');
        }
        if (newPassword.length < 5) {
            return sweetMixinErrorAlert('Password must be at least 5 characters!');
        }

        try {
            const result = await resetPassword({ variables: { email, code: userCode, newPassword } });
            if (result.data.resetPassword) {
                await sweetTopSuccessAlert('Password reset successfully!', 2000);
                router.push('/account/login');
            }
        } catch (err: any) {
            console.log('Error resetPassword:', err);
            sweetMixinErrorAlert(err.message || 'Reset failed');
        }
    };

    if (device === 'mobile') {
        return <div>MOBILE FORGOT PASSWORD</div>;
    } else {
        return (
            <Stack className={'forgot-password-page'}>
                <Stack className={'container'}>
                    <Stack className={'main'} flexDirection={'row'}>
                        <Stack className={'left'}>
                            <img src="/img/banner/baner-login.jpg" alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Stack>
                        <Stack className={'right animate__animated animate__fadeInDown'}>

                            {/* STEP 0: REQUEST CODE */}
                            {step === 0 && (
                                <>
                                    <div className={'info'}>
                                        <span className={'title'}>Forgot Password?</span>
                                        <p>Enter your email to receive a reset code.</p>
                                    </div>
                                    <div className={'input-wrap'}>
                                        <div className={'input-box'}>
                                            <input
                                                type="text"
                                                placeholder={' '}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleRequestCode()}
                                            />
                                            <label>Email</label>
                                        </div>
                                    </div>
                                    <div className={'actions'}>
                                        <button onClick={handleRequestCode} disabled={!email}>Send Code</button>
                                        <span className='back-to-login' onClick={() => router.push('/account/login')}>Back to Log In</span>
                                    </div>
                                </>
                            )}

                            {/* STEP 1: VERIFY CODE */}
                            {step === 1 && (
                                <>
                                    <div className={'info'}>
                                        <span className={'title'}>Verify Code</span>
                                        <p>We sent a code to <b>{email}</b>. Please enter it below.</p>
                                    </div>
                                    <div className={'input-wrap'}>
                                        <div className={'input-box'}>
                                            <input
                                                type="text"
                                                placeholder={' '}
                                                value={userCode}
                                                onChange={(e) => setUserCode(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                                            />
                                            <label>Enter code</label>
                                        </div>
                                    </div>
                                    <div className={'actions'}>
                                        <button onClick={handleVerifyCode} disabled={userCode.length < 4}>Verify Code</button>
                                        <span className='back-to-login' onClick={() => setStep(0)}>Change Email</span>
                                    </div>
                                </>
                            )}

                            {/* STEP 2: RESET PASSWORD */}
                            {step === 2 && (
                                <>
                                    <div className={'info'}>
                                        <span className={'title'}>New Password</span>
                                        <p>Create a new strong password.</p>
                                    </div>
                                    <div className={'input-wrap'}>
                                        <div className={'input-box'}>
                                            <input
                                                type="password"
                                                placeholder={' '}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <label>New Password</label>
                                        </div>
                                        <div className={'input-box'}>
                                            <input
                                                type="password"
                                                placeholder={' '}
                                                value={repeatPassword}
                                                onChange={(e) => setRepeatPassword(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                                            />
                                            <label>Repeat Password</label>
                                        </div>
                                    </div>
                                    <div className={'actions'}>
                                        <button onClick={handleResetPassword} disabled={!newPassword || !repeatPassword}>Reset Password</button>
                                    </div>
                                </>
                            )}

                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        );
    }
};

export default withLayoutBasic(ForgotPassword);
