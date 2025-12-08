import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>

			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>

			</Stack>
		);
	}
};

export default withLayoutMain(Home);
