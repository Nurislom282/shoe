import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
    const [serverCode, setServerCode] = useState(''); // Simulated backend code
    const [userCode, setUserCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    /**
     * Step 0: identification
     * Generates a random code and shows it in an alert (simulating email/sms)
     */
    const handleRequestCode = async () => {
        if (!email) return sweetMixinErrorAlert('Please enter your text');

        // Simulation: Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setServerCode(code);

        // Show code to user (since we can't actually send email)
        alert(`Your password reset code is: ${code}`);

        setStep(1);
    };

    /**
     * Step 1: Verification
     * User enters the code they "received"
     */
    const handleVerifyCode = async () => {
        if (userCode !== serverCode) {
            return sweetMixinErrorAlert('Invalid code! Please try again.');
        }
        setStep(2);
    };

    /**
     * Step 2: Reset Password
     * User enters new password
     */
    const handleResetPassword = async () => {
        if (newPassword !== repeatPassword) {
            return sweetMixinErrorAlert('Passwords do not match!');
        }
        if (newPassword.length < 5) {
            return sweetMixinErrorAlert('Password must be at least 5 characters!');
        }

        await sweetTopSuccessAlert('Password reset successfully!', 2000);
        router.push('/account/login');
    };


    if (device === 'mobile') {
        return <div>MOBILE FORGOT PASSWORD</div>;
    } else {
        return (
            <Stack className={'forgot-password-page'}>
                <Stack className={'container'}>
                    <Stack className={'main'} flexDirection={'row'}>
                        <Stack className={'left'}>
                            {/* Background Image Area */}
                        </Stack>
                        <Stack className={'right animate__animated animate__fadeInDown'}>

                            {/* STEP 0: REQUEST CODE */}
                            {step === 0 && (
                                <>
                                    <div className={'info'}>
                                        <span className={'title'}>Forgot Password?</span>
                                        <p>Enter your identifier (Email or Phone) to receive a reset code.</p>
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
                                            <label>Email or Phone</label>
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
                                        <p>We sent a 6-digit code to <b>{email}</b>. Please enter it below.</p>
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
                                            <label>enter 6-digit code</label>
                                        </div>
                                    </div>
                                    <div className={'actions'}>
                                        <button onClick={handleVerifyCode} disabled={userCode.length < 6}>Verify Code</button>
                                        <span className='back-to-login' onClick={() => setStep(0)}>Change Email/Phone</span>
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
