import type { AppProps } from 'next/app';
import Head from 'next/head';
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
import '../scss/pc/homepage/collection.scss';
import '../scss/pc/homepage/our-collection.scss';
import '../scss/pc/homepage/blogs.scss';
import '../scss/pc/homepage/banner.scss';
import '../scss/pc/about/about.scss';
import '../scss/pc/community/detail.scss';
import '../scss/pc/cs/cs.scss';
import '../scss/pc/shop/shop.scss';
import '../scss/pc/shop/detail.scss';
import '../scss/pc/mypage/mypage.scss';
import '../scss/pc/mypage/myProfile.scss';
import '../scss/pc/mypage/addNewProperty.scss';
import '../scss/pc/mypage/myProperties.scss';
import '../scss/pc/mypage/myFavorites.scss';
import '../scss/pc/mypage/myArticles.scss';
import '../scss/pc/mypage/writeArticle.scss';
import '../scss/pc/mypage/mySaved.scss';

import '../scss/pc/shop/basket.scss';
import '../scss/pc/shop/basket.scss';
import '../scss/pc/mini-basket.scss';
import '../scss/pc/shop/checkout.scss';
import '../scss/pc/account/join.scss';
import '../scss/pc/chat.scss';
import 'animate.css';
import GlobalLoader from '../libs/components/GlobalLoader';

import { useRouter } from 'next/router';
// ... existing imports ...

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState, pageProps.authToken);
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
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link
						href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&family=Inconsolata:wght@400;700&family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				{isMounted && <GlobalLoader open={isLoading} />}
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);

};


App.getInitialProps = async ({ Component, ctx }: any) => {
	let pageProps = {};
	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx);
	}

	const { req } = ctx;
	const authToken = req ? req.headers['authorization'] : null;
	const initialApolloState = null; // Or fetch/hydrate if needed, but we rely on client-side for now mostly, this is just for auth context

	return {
		pageProps: { ...pageProps, authToken },
	};
};

export default appWithTranslation(App);
