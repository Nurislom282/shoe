import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'} flexDirection={'row'}>
						<Stack className={'left'}>
							{/* Background Image Area */}
						</Stack>
						<Stack className={'right animate__animated animate__fadeInRight'}>
							<div className={'info'}>
								<span className={'title'}>{loginView ? 'Log in' : 'Sign up'}</span>
							</div>
							<div className={'input-wrap'}>
								{!loginView && (
									<div className={'input-box'}>
										<span>Name</span>
										<input
											type="text"
											placeholder={'Enter Nickname'}
											onChange={(e) => handleInput('nick', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
								<div className={'input-box'}>
									<span>{loginView ? 'Username' : 'Phone'}</span>
									<input
										type="text"
										placeholder={loginView ? 'Enter Username' : 'Enter Phone'}
										onChange={(e) => handleInput(loginView ? 'nick' : 'phone', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="password"
										placeholder={'Enter Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
							</div>
							<div className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>I want to be registered as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'USER'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'USER'}
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'AGENT'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'AGENT'}
														/>
													}
													label="Agent"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<a href="#">Forgot your Password?</a>
									</div>
								)}

								{loginView ? (
									<Button
										variant="contained"
										className={'login-btn'}
										disabled={input.nick == '' || input.password == ''}
										onClick={doLogin}
									>
										Log In
									</Button>
								) : (
									<Button
										variant="contained"
										className={'signup-btn'}
										disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
										onClick={doSignUp}
									>
										Sign Up
									</Button>
								)}
							</div>
							<div className={'ask-info'}>
								{loginView ? (
									<p>
										Don&apos;t have an account?
										<b
											onClick={() => {
												viewChangeHandler(false);
											}}
										>
											Create an account
										</b>
									</p>
								) : (
									<p>
										Already have an account? <span onClick={() => router.push('/account/login')}>Log In</span>
									</p>
								)}
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
