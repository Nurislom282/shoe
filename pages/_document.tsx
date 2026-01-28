import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta charSet="UTF-8" />
				<meta name="title" content="ShoeZ - Step Into Style" />
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/shoe-logo.png" />

				{/* SEO */}
				<meta name="keywords" content={'Shoe, shoe.online, shoes shop, Shoes Shop, sneakers, footwear'} />
				<meta
					name={'description'}
					content={
						'Step Into Style with ShoeZ. Discover famous sneakers at the best prices, from iconic classics to the latest drops. Premium quality, authentic style, and unbeatable comfort.'
					}
				/>

				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="canonical" href="https://shoez.online/" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://shoez.online/" />
				<meta property="og:title" content="ShoeZ - Step Into Style" />
				<meta property="og:description" content="Step Into Style with ShoeZ. Discover famous sneakers at the best prices." />
				<meta property="og:image" content="https://shoez.online/img/logo/shoe-logo.png" />
				<meta property="og:site_name" content="ShoeZ" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary" />
				<meta property="twitter:title" content="ShoeZ - Step Into Style" />
				<meta property="twitter:description" content="Step Into Style with ShoeZ. Discover famous sneakers at the best prices." />
				<meta property="twitter:image" content="https://shoez.online/img/logo/shoe-logo.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
