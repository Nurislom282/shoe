import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

const Footer = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('total free customer care')}</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('nee live')}</span>
							<p>+82 10 4867 2909</p>
							<span>{t('Support?')}</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Popular Search')}</strong>
								<span>{t('Property for Rent')}</span>
								<span>{t('Property Low to hide')}</span>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<span>{t('Terms of Use')}</span>
								<span>{t('Privacy Policy')}</span>
								<span>{t('Pricing Plans')}</span>
								<span>{t('Our Services')}</span>
								<span>{t('Contact Support')}</span>
								<span>{t('FAQs')}</span>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<span>{t('Seoul')}</span>
								<span>{t('Gyeongido')}</span>
								<span>{t('Busan')}</span>
								<span>{t('Jejudo')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© ShoeZ - {t('All rights reserved')}. ShoeZ {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoText.png" alt="" className={'logo'} />
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'footer-box'}>
							<LocationOnIcon className={'icon'} />
							<span>55 East Birchwood Ave. Brooklyn, New York 11201</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<EmailIcon className={'icon'} />
							<span>(603) 555-0123</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<LocalPhoneIcon className={'icon'} />
							<span>example@gmail.com</span>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<Stack className={'left'}>
						<strong>{t('Home')}</strong>
						<strong>{t('About')}</strong>
						<strong>{t('Shop')}</strong>
						<strong>{t('Blog')}</strong>
						<strong>{t('Licenses')}</strong>
					</Stack>
					<Stack className={'right'}>
						<span>{t('Copyright')} © ShoeZ | {t('Designed by')} RAY | {t('Powered by')} Next.js</span>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
