/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL || '',
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL || '/graphql',
		REACT_APP_API_WS: process.env.REACT_APP_API_WS || 'ws://localhost:4004',
	},
	images: {
		domains: ['cdn.prod.website-files.com', 'localhost'],
	},
	async rewrites() {
		return [
			{
				source: '/graphql',
				destination: 'http://localhost:4004/graphql',
			},
			{
				source: '/uploads/:path*',
				destination: 'http://localhost:4004/uploads/:path*',
			},
		];
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
