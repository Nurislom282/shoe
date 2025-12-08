import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import '../scss/pc/globalLoader.scss';
import '../scss/pc/homepage/homepage.scss';
import GlobalLoader from '../libs/components/GlobalLoader';

import { useRouter } from 'next/router';
// ... existing imports ...

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		// Fake delay to ensure the loader is seen on initial load
		let timer: NodeJS.Timeout;

		const startHomeLoader = () => {
			setIsLoading(true);
			timer = setTimeout(() => setIsLoading(false), 8500);
		};

		if (router.pathname === '/') {
			startHomeLoader();
		}

		const handleStart = (url: string) => {
			if (url === '/') startHomeLoader();
		};

		const handleComplete = (url: string) => {
			if (url !== '/') setIsLoading(false);
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			clearTimeout(timer);
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, []); // Dependency array empty means this runs once on mount. router ref is stable.

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{isMounted && <GlobalLoader open={isLoading} />}
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
