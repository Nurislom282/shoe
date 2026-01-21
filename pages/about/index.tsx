import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Adds from '../../libs/components/homepage/adds';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';
import { useTranslation } from 'next-i18next';

// Helper component for scroll animations
const FadeInWhenVisible = ({ children, delay = 0, animation = 'animate__fadeInUp' }: { children: React.ReactNode, delay?: number, animation?: string }) => {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target); // Trigger once
				}
			});
		});
		if (domRef.current) observer.observe(domRef.current);
		return () => {
			if (domRef.current) observer.unobserve(domRef.current);
		};
	}, []);

	return (
		<div
			ref={domRef}
			className={`animate__animated ${isVisible ? animation : ''}`}
			style={{
				opacity: isVisible ? 1 : 0,
				animationDelay: `${delay}ms`,
				transition: 'opacity 0.1s' // Let animate.css handle main transition, this prevents FOUC
			}}
		>
			{children}
		</div>
	);
};

// Helper component for rolling number animation
const RollingNumber = ({ number, isVisible, delay = 0 }: { number: number, isVisible: boolean, delay?: number }) => {
	const numberStr = number.toString();
	const digits = numberStr.split('');

	return (
		<div style={{ display: 'inline-flex', overflow: 'hidden', height: '1.2em', lineHeight: '1.2', alignItems: 'flex-start' }}>
			{digits.map((char, index) => {
				if (/[0-9]/.test(char)) {
					const digit = parseInt(char, 10);
					// Create an array [0, 1, ..., 9]
					const nums = Array.from({ length: 10 }, (_, i) => i);
					return (
						<div key={index} style={{
							position: 'relative',
							// remove height: 100% to let it grow naturally based on content
							display: 'flex',
							flexDirection: 'column',
							transition: `transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)`,
							transitionDelay: `${delay + (index * 50)}ms`,
							transform: isVisible ? `translateY(-${digit * 10}%)` : 'translateY(0%)'
						}}>
							{nums.map(n => (
								<span key={n} style={{ display: 'block', height: '1.2em', textAlign: 'center' }}>
									{n}
								</span>
							))}
						</div>
					);
				} else {
					return <span key={index}>{char}</span>;
				}
			})}
		</div>
	);
};

const About: NextPage = () => {
	const { t } = useTranslation('common');
	const [isVisible, setIsVisible] = useState(false);
	// counts state removed
	const sectionRef = useRef(null);
	const { loading, data, error } = useQuery(GET_AGENTS, {
		variables: { input: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC', search: {} } },
	});

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isVisible) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.3 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, [isVisible]);

	// Counting interval useEffect removed

	const [scrollY, setScrollY] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
				setScrollY(scrollProgress);
			}
		};
		window.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const image1Transform = `translateY(${scrollY * -50}px)`;
	const image2Transform = `translateY(${scrollY * 50}px)`;

	const device = useDeviceDetect();

	// FAQ Data
	const faqs = [
		{ question: t('about_page.faqs.q1'), answer: t('about_page.faqs.a1') },
		{ question: t('about_page.faqs.q2'), answer: t('about_page.faqs.a2') },
		{ question: t('about_page.faqs.q3'), answer: t('about_page.faqs.a3') },
		{ question: t('about_page.faqs.q4'), answer: t('about_page.faqs.a4') },
		{ question: t('about_page.faqs.q5'), answer: t('about_page.faqs.a5') }
	];

	if (device === 'mobile') {
		return <div>{t('about_page.mobile')}</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				{/* banner About Page */}
				<Stack className={"section banner"}>
					<div className={'banner-image'}>
						<img src="/img/banner/about.jpg" alt="" />
					</div>
					<Stack className={"container"}>
						<div className={"banner-text"}>
							<h1>{t('about_page.title')}</h1>
							<Link href="/">{t('about_page.home')}</Link>
							<p>{t('about_page.crumb')}</p>
						</div>
					</Stack>
				</Stack>

				{/* Mission Section */}
				<Stack className={'section mission-section'}>
					<Stack className={'container'}>
						<div className={'content-left'}>
							<FadeInWhenVisible>
								<span className={'tag'}>{t('about_page.tag_about')}</span>
								<h2 className={'title'}>{t('about_page.mission_title')}</h2>
								<p className={'description'}>
									{t('about_page.mission_desc')}
								</p>
								{/* <div className={'signature'}>
									<img src="/img/icons/sort.svg" alt="Signature" style={{ width: 50, opacity: 0.5 }} />
								</div> */}
							</FadeInWhenVisible>
						</div>

						{/* Two Image Grid */}
						<div ref={containerRef} style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
							gap: '40px',
							position: 'relative',
							marginTop: '80px',
							maxWidth: '1000px',
							margin: '80px auto 0'
						}}>
							{/* Image 1 - Black Nike Shoe */}
							<FadeInWhenVisible animation="animate__fadeInDown">
								<div style={{
									position: 'relative',
									transform: image1Transform,
									transition: 'transform 0.1s ease-out',
									willChange: 'transform'
								}}>
									<div style={{
										background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
										borderRadius: '20px',
										overflow: 'hidden',
										aspectRatio: '4/5',
										position: 'relative',
										boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
									}}>
										<img
											src="/img/about/aim.png"
											alt="Shoe Representation"
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover'
											}}
										/>
									</div>
								</div>
							</FadeInWhenVisible>

							{/* Image 2 - Turquoise Shoe with Peach */}
							<FadeInWhenVisible animation="animate__fadeInUp">
								<div style={{
									position: 'relative',
									transform: image2Transform,
									transition: 'transform 0.1s ease-out',
									willChange: 'transform'
								}}>
									<div style={{
										background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dfd5 100%)',
										borderRadius: '20px',
										overflow: 'hidden',
										aspectRatio: '4/5',
										position: 'relative',
										boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
									}}>
										<img
											src="/img/about/about-1.jpg"
											alt="Shoe Representation"
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover'
											}}
										/>
									</div>
								</div>
							</FadeInWhenVisible>
						</div>
					</Stack>
				</Stack>

				{/* Numbers Section */}
				<div style={{
					padding: '80px 20px',
					background: '#fafafa',
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
				}}>
					<div ref={sectionRef} style={{
						maxWidth: '1400px',
						margin: '0 auto',
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
						gap: '40px',
						alignItems: 'center'
					}}>
						<div style={{
							position: 'relative',
							aspectRatio: '1',
							borderRadius: '24px',
							overflow: 'hidden',
							background: 'linear-gradient(135deg, #d97742 0%, #e89965 50%, #f4c898 100%)',
							boxShadow: '0 20px 60px rgba(217, 119, 66, 0.3)',
							transform: isVisible ? 'scale(1)' : 'scale(0.9)',
							opacity: isVisible ? 1 : 0,
							transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
						}}>
							<img
								src="/img/about/number.png"
								alt="Our Numbers"
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover'
								}}
							/>
						</div>

						{/* Right Side - Numbers */}
						<div style={{
							padding: '40px 20px'
						}}>
							<p style={{
								color: '#d97742',
								fontSize: '14px',
								textTransform: 'uppercase',
								letterSpacing: '2px',
								marginBottom: '16px',
								fontWeight: '700',
								opacity: isVisible ? 1 : 0,
								transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
								transition: 'all 0.6s ease 0.2s'
							}}>
								{t('about_page.tag_numbers')}
							</p>

							<h2 style={{
								fontSize: 'clamp(32px, 5vw, 48px)',
								fontWeight: '800',
								color: '#1a1a1a',
								marginBottom: '24px',
								opacity: isVisible ? 1 : 0,
								transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
								transition: 'all 0.6s ease 0.3s'
							}}>
								{t('about_page.numbers_title')}
							</h2>

							<p style={{
								fontSize: '16px',
								color: '#666',
								marginBottom: '50px',
								lineHeight: '1.6',
								opacity: isVisible ? 1 : 0,
								transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
								transition: 'all 0.6s ease 0.4s'
							}}>
								{t('about_page.numbers_desc')}
							</p>

							{/* Stats Grid */}
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '40px'
							}}>
								{/* Stat 1 */}
								<div style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
									transition: 'all 0.6s ease 0.5s'
								}}>
									<div style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: '#1a1a1a', lineHeight: '1', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
										<RollingNumber number={99.9} isVisible={isVisible} /><span style={{ color: '#d97742' }}>%</span>
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										{t('about_page.satisfaction')}
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										{t('about_page.satisfaction_desc')}
									</p>
								</div>

								{/* Stat 2 */}
								<div style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
									transition: 'all 0.6s ease 0.6s'
								}}>
									<div style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: '#1a1a1a', lineHeight: '1', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
										<RollingNumber number={8.1} isVisible={isVisible} /><span style={{ color: '#d97742' }}>M</span>
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										{t('about_page.users')}
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										{t('about_page.users_desc')}
									</p>
								</div>

								{/* Stat 3 */}
								<div style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
									transition: 'all 0.6s ease 0.7s'
								}}>
									<div style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: '#1a1a1a', lineHeight: '1', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
										<span style={{ color: '#d97742' }}>$</span><RollingNumber number={5.99} isVisible={isVisible} />
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										{t('about_page.capital')}
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										{t('about_page.capital_desc')}
									</p>
								</div>

								{/* Stat 4 */}
								<div style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
									transition: 'all 0.6s ease 0.8s'
								}}>
									<div style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: '#1a1a1a', lineHeight: '1', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
										<RollingNumber number={100} isVisible={isVisible} />
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										{t('about_page.growth')}
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										{t('about_page.growth_desc')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Partners Section */}
				<Stack className={'section partners-section'}>
					<Stack className={'container'}>
						<FadeInWhenVisible>
							<h3 className={'section-title'}>{t('about_page.partners_title')}</h3>
						</FadeInWhenVisible>
						<div className={'logos-grid'}>
							{[
								"/img/icons/brands/amazon.svg",
								"/img/icons/brands/amd.svg",
								"/img/icons/brands/cisco.svg",
								"/img/icons/brands/dropcam.svg",
								"/img/icons/brands/logitech.svg",
								"/img/icons/brands/spotify.svg"
							].map((src, i) => (
								<div key={i} className="partner-box">
									<FadeInWhenVisible delay={i * 100}>
										<img src={src} alt={`Partner ${i}`} />
									</FadeInWhenVisible>
								</div>
							))}
						</div>
					</Stack>
				</Stack>

				{/* Team Section */}
				<Stack className={'section team-section'}>
					<Stack className={'container'}>
						<FadeInWhenVisible>
							<div className={'header'}>
								<span className={'tag'}>{t('about_page.tag_team')}</span>
								<h2 className={'title'}>{t('about_page.team_title')}</h2>
								<p className={'description'}>{t('about_page.team_desc')}</p>
							</div>
						</FadeInWhenVisible>
					</Stack>
					<Stack className={'container'}>
						<div className={'team-grid'}>
							<Swiper
								className={'team-swiper'}
								modules={[Autoplay, Pagination, Navigation]}
								spaceBetween={30}
								slidesPerView={3}
								loop={true}
								autoplay={{ delay: 3000, disableOnInteraction: false }}
								pagination={{ clickable: true }}
								breakpoints={{
									320: { slidesPerView: 1, spaceBetween: 20 },
									768: { slidesPerView: 2, spaceBetween: 30 },
									1024: { slidesPerView: 3, spaceBetween: 30 },
								}}
							>
								{data?.getAgents?.list?.map((member: any) => (
									<SwiperSlide key={member._id}>
										<FadeInWhenVisible delay={0}>
											<div className={'team-card'}>
												<div className={'image-wrapper'}>
													<img
														src={member.memberImage ? `${REACT_APP_API_URL}/${member.memberImage}` : "/img/profile/defaultUser.svg"}
														alt={member.memberNick}
													/>
													<div className={'overlay'}>
														<div className={'overlay-content'}>
															<span className={'badge'}>{member.memberType}</span>
															<p className={'quote'}>&quot;{member.memberDesc || "No description provided."}&quot;</p>
														</div>
													</div>
												</div>
												<div className={'info'}>
													<h4>{member.memberNick}</h4>
													<span>{member.memberType}</span>
												</div>
											</div>
										</FadeInWhenVisible>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</Stack>

				</Stack>

				{/* FAQ Section */}
				<Stack className={'section faq-section'}>
					<Stack className={'container'}>
						<FadeInWhenVisible>
							<div className={'header'}>
								<span className={'tag'}>{t('about_page.tag_faq')}</span>
								<h2 className={'title'}>{t('about_page.faq_title')}</h2>
							</div>
						</FadeInWhenVisible>
						<Stack className={'faq-list'}>
							{faqs.map((faq, index) => (
								<FadeInWhenVisible key={index} delay={index * 100}>
									<Accordion className={'faq-item'} disableGutters elevation={0}>
										<AccordionSummary expandIcon={<ExpandMoreIcon aria-label="Expand" />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
											<Typography className={'question'}>{faq.question}</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography className={'answer'}>
												{faq.answer}
											</Typography>
										</AccordionDetails>
									</Accordion>
								</FadeInWhenVisible>
							))}
						</Stack>
					</Stack>
				</Stack>

				{/* ADD Section */}
				<Adds />
			</Stack >
		);
	}
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
	const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');
	return {
		props: {
			...(await serverSideTranslations(locale, ['common'])),
		},
	};
};

export default withLayoutBasic(About);
