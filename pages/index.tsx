import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import Statistics from '../libs/components/homepage/Statistics';
import About from '../libs/components/common/About';
import Offer from '../libs/components/homepage/offer';
import Latest from '../libs/components/homepage/Latest';
import Hero from '../libs/components/homepage/Hero';
import OurCollectionBox from '../libs/components/homepage/ourcollectionbox';
import Blogs from '../libs/components/homepage/blogs';
import Banner from '../libs/components/homepage/banner';
import CollectionLatest from '../libs/components/homepage/collectionletast';
import Adds from '../libs/components/homepage/adds';

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<Statistics />
				<About />
				<Latest />
				<Offer />
				<CollectionLatest />
				<OurCollectionBox />
				<Blogs />
				<Banner />
				<Adds />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Hero />
				<Statistics />
				<About />
				<Latest />
				<Offer />
				<OurCollectionBox />
				<Blogs />
				<Banner />
				<Adds />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
