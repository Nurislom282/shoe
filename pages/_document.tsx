import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'Shouse, shoes.uz, sneackers, Shoes Shop'} />
				<meta
					name={'description'}
					content={
					"Step Into Style — Without Stepping Over Your Budget \n Discover the most famous sneakers at the best prices in town \n From iconic classics to the latest hype releases our shop brings you premium quality, unbeatable comfort, and authentic style — all without the premium price tag. \n Whether you're chasing your dream pair or upgrading your everyday look, we’ve got the shoes that make every step legendary. \n ✨ Top Brands \n ✨ Best Prices \n ✨ 100% Authentic \n ✨ Fresh Drops Weekly \n Your next favorite sneakers are waiting. \n Shop smart. Look sharp. Walk legendary.|" +
					"Вступайте в стиль — не выходя за рамки бюджета! \n Откройте для себя самые известные кроссовки по лучшим ценам в городе. \n От культовой классики до новейших хайп-релизов — наш магазин предлагает премиальное качество, непревзойдённый комфорт и настоящий стиль — без завышенной стоимости. \n Ищете пару мечты или хотите обновить свой повседневный образ? \n У нас есть кроссовки, которые делают каждый шаг легендарным. \n  ✨ Топовые бренды \n ✨ Лучшие цены \n ✨ 100% оригинал \n ✨ Новинки каждую неделю \n Ваши любимые кроссовки уже ждут. \n Покупайте разумно. Выглядите стильно. Шагайте легендарно.|" +
					"스타일을 향해 한 걸음 — 예산은 지키면서! \n 가장 유명한 스니커즈를 최고의 가격으로 만나보세요. \n 아이코닉한 클래식부터 최신 하이프 출시까지, 저희 매장은 프리미엄 품질, 뛰어난 편안함, 그리고 진짜 스타일을 합리적인 가격에 제공합니다. \n 꿈에 그리던 한 족을 찾고 있든, 데일리 룩을 업그레이드하고 싶든, \n 당신의 한 걸음을 전설로 만들어 줄 스니커즈가 준비되어 있습니다. \n ✨ 인기 브랜드 \n ✨ 최고의 가격 \n ✨ 100% 정품 \n ✨ 매주 새로운 드롭 \n 당신의 다음 페이보릿 스니커즈가 기다리고 있습니다. \n 똑똑하게 쇼핑하고, 멋지게 스타일링하세요. 전설처럼 걸으세요."
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
