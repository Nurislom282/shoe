import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	// Form state
	const [form, setForm] = useState({
		activeTab: 'email',
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	});

	const handleChange = (e: any) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	if (device === 'mobile') {
		return (
			<div className="cs-page-mobile">
				<h2>{t('contact.title')}</h2>

				<div className="contact-cards">
					<div className="card">
						<div className="icon"><LocationOnIcon /></div>
						<h3>{t('contact.address_title')}</h3>
						<p>{t('contact.address_desc')}</p>
					</div>
					<div className="card">
						<div className="icon"><EmailIcon /></div>
						<h3>{t('contact.email_title')}</h3>
						<p>{t('contact.email_desc')}</p>
					</div>
					<div className="card">
						<div className="icon"><PhoneIcon /></div>
						<h3>{t('contact.phone_title')}</h3>
						<p>{t('contact.phone_desc')}</p>
					</div>
				</div>

				<div className="contact-form">
					<h3>{t('contact.form.title')}</h3>
					<input type="text" placeholder={t('contact.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					<input type="email" placeholder={t('contact.form.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
					<input type="text" placeholder={t('contact.form.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
					<input type="text" placeholder={t('contact.form.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
					<textarea placeholder={t('contact.form.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
					<button>{t('contact.form.submit')}</button>
				</div>
			</div>
		);
	} else {
		return (
			<div id="cs-page">
				{/* Hero Section */}
				<div className="hero-section">
					<div className="breadcrumb-box">
						<Typography className="page-title">{t('contact.title')}</Typography>
						<div className="breadcrumb-links">
							<span>{t('contact.crumb_home')}</span>
							<span className="separator">/</span>
							<span>{t('contact.crumb_contact')}</span>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="contact-container">
						{/* Left Column: Contact Info which is a Grid of Cards */}
						<div className="contact-info-grid">
							<div
								className={`contact-card ${form.activeTab === 'address' ? 'active-red' : ''}`}
								onClick={() => setForm({ ...form, activeTab: 'address' })}
							>
								<div className="icon-box">
									<LocationOnIcon />
								</div>
								<div className="card-text">
									<Typography className="card-title">{t('contact.address_title')}</Typography>
									<Typography className="card-desc">{t('contact.address_desc')}</Typography>
								</div>
							</div>
							<div
								className={`contact-card ${form.activeTab === 'email' ? 'active-red' : ''}`}
								onClick={() => setForm({ ...form, activeTab: 'email' })}
							>
								<div className="icon-box">
									<EmailIcon />
								</div>
								<div className="card-text">
									<Typography className="card-title">{t('contact.email_title')}</Typography>
									<Typography className="card-desc">{t('contact.email_desc')}</Typography>
								</div>
							</div>
							<div
								className={`contact-card ${form.activeTab === 'phone' ? 'active-red' : ''}`}
								onClick={() => setForm({ ...form, activeTab: 'phone' })}
							>
								<div className="icon-box">
									<PhoneIcon />
								</div>
								<div className="card-text">
									<Typography className="card-title">{t('contact.phone_title')}</Typography>
									<Typography className="card-desc">{t('contact.phone_desc')}</Typography>
								</div>
							</div>
						</div>

						{/* Right Column: Contact Form or Map */}
						<div className="contact-form-section">
							{form.activeTab === 'address' ? (
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.381363618683!2d127.05834077717441!3d37.50291497205477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca40f252bf629%3A0xe9c864a780076a43!2sPOSCO%20Center!5e0!3m2!1suk!2skr!4v1703403000000!5m2!1suk!2skr"
									width="100%"
									height="100%"
									style={{ border: 0, borderRadius: '12px', minHeight: '600px' }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								></iframe>
							) : (
								<>
									<Typography className="form-title">{t('contact.form.title')}</Typography>
									<form className="contact-form">
										<div className="input-group">
											<PersonIcon className="input-icon" />
											<input
												type="text"
												name="name"
												placeholder={t('contact.form.name')}
												value={form.name}
												onChange={handleChange}
											/>
										</div>
										<div className="input-group">
											<EmailIcon className="input-icon" />
											<input
												type="email"
												name="email"
												placeholder={t('contact.form.email')}
												value={form.email}
												onChange={handleChange}
											/>
										</div>
										<div className="input-group">
											<PhoneIcon className="input-icon" />
											<input
												type="text"
												name="phone"
												placeholder={t('contact.form.phone')}
												value={form.phone}
												onChange={handleChange}
											/>
										</div>
										<div className="input-group">
											<LocalOfferIcon className="input-icon" />
											<input
												type="text"
												name="subject"
												placeholder={t('contact.form.subject')}
												value={form.subject}
												onChange={handleChange}
											/>
										</div>
										<div className="input-group textarea-group">
											<textarea
												name="message"
												placeholder={t('contact.form.message')}
												value={form.message}
												onChange={handleChange}
											></textarea>
										</div>
										<Button className="submit-btn" disableRipple>
											{t('contact.form.submit')}
										</Button>
									</form>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(CS);
