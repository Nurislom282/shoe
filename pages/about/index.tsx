import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Adds from '../../libs/components/homepage/adds';

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
	const [isVisible, setIsVisible] = useState(false);
	// counts state removed
	const sectionRef = useRef(null);

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
		{ question: "What sizes do you carry?", answer: "We carry a wide range of sizes for men, women, and children. Check our size guide for specifics." },
		{ question: "Do you offer international shipping?", answer: "Yes, we ship to over 50 countries worldwide." },
		{ question: "What is your return policy?", answer: "We offer a 30-day return policy for unworn items in original packaging." },
		{ question: "How can I track my order?", answer: "Once your order ships, you will receive a tracking link via email." },
		{ question: "Are your shoes sustainable?", answer: "We are committed to sustainability and offer a range of eco-friendly options." }
	];

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				{/* banner About Page */}
				<Stack className={"section banner"}>
					<div className={'banner-image'}>
						<img src="/img/banner/about.png" alt="" />
					</div>
					<Stack className={"container"}>
						<div className={"banner-text"}>
							<h1>ABOUT</h1>
							<Link href="/">
								<div style={{ cursor: 'pointer', color: 'white' }}>Home</div>
							</Link>
							<p>/ About</p>
						</div>
					</Stack>
				</Stack>

				{/* Mission Section */}
				<Stack className={'section mission-section'}>
					<Stack className={'container'}>
						<div className={'content-left'}>
							<FadeInWhenVisible>
								<span className={'tag'}>About Us</span>
								<h2 className={'title'}>Our Mission</h2>
								<p className={'description'}>
									At ShoeZ, we&apos;re more than just an online shoe store – we&apos;re your trusted partner in all things footwear.
									With a passion for innovation and a commitment to excellence.
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
										<div style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%) rotate(-15deg)',
											width: '80%',
											height: '60%',
											background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
										}}></div>
										{/* Nike shoe representation */}
										<div style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%) rotate(-20deg)',
											width: '70%',
											height: '40%',
											background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffffff 100%)',
											clipPath: 'polygon(15% 30%, 85% 35%, 90% 55%, 10% 70%)',
											boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
										}}></div>
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
										boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
									}}>
										{/* Pink/Peach geometric shapes in background */}
										<div style={{
											position: 'absolute',
											top: '20%',
											right: '15%',
											width: '150px',
											height: '150px',
											background: 'linear-gradient(135deg, #ffd4b8 0%, #ffb89d 100%)',
											clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
											opacity: '0.6'
										}}></div>

										{/* Turquoise shoe */}
										<div style={{
											position: 'absolute',
											top: '45%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '60%',
											height: '35%',
											background: 'linear-gradient(135deg, #5fb5a8 0%, #4a9b8e 50%, #3d8275 100%)',
											borderRadius: '45% 45% 40% 40% / 50% 50% 40% 40%',
											boxShadow: 'inset 0 -5px 15px rgba(0,0,0,0.2), 0 15px 35px rgba(74,155,142,0.3)'
										}}></div>

										{/* Peach/fruit accent */}
										<div style={{
											position: 'absolute',
											bottom: '25%',
											left: '25%',
											width: '80px',
											height: '80px',
											background: 'radial-gradient(circle at 30% 30%, #ffd4a3 0%, #ffb366 50%, #ff9944 100%)',
											borderRadius: '50%',
											boxShadow: '0 8px 20px rgba(255,153,68,0.4)'
										}}></div>

										<div style={{
											position: 'absolute',
											top: '20%',
											right: '20%',
											width: '60px',
											height: '60px',
											background: 'radial-gradient(circle at 40% 40%, #ffe4c4 0%, #ffc8a0 100%)',
											borderRadius: '50%',
											boxShadow: '0 6px 15px rgba(255,200,160,0.3)'
										}}></div>
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
						{/* Left Side - Shoe Image */}
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
							{/* Shoe representation */}
							<div style={{
								position: 'absolute',
								bottom: '10%',
								left: '50%',
								transform: 'translateX(-50%) rotate(-15deg)',
								width: '75%',
								height: '65%',
							}}>
								{/* Shoe sole/bottom - beige color */}
								<div style={{
									position: 'absolute',
									bottom: '0',
									left: '10%',
									width: '80%',
									height: '45%',
									background: 'linear-gradient(135deg, #f4e4c8 0%, #e8d5b8 50%, #d4c4a8 100%)',
									borderRadius: '50% 50% 45% 45% / 40% 40% 60% 60%',
									boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
								}}></div>

								{/* Shoe upper part - white/cream */}
								<div style={{
									position: 'absolute',
									top: '0',
									left: '15%',
									width: '70%',
									height: '60%',
									background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%)',
									borderRadius: '45% 45% 50% 50% / 50% 50% 50% 50%',
									boxShadow: 'inset 0 -5px 15px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.15)',
								}}>
									{/* Shoe laces detail */}
									<div style={{
										position: 'absolute',
										top: '30%',
										left: '20%',
										width: '60%',
										height: '40%',
										borderLeft: '2px solid #ddd',
										borderRight: '2px solid #ddd',
									}}>
										{[0, 1, 2, 3].map((i) => (
											<div key={i} style={{
												position: 'absolute',
												top: `${i * 25}%`,
												left: '0',
												width: '100%',
												height: '2px',
												background: '#ddd'
											}}></div>
										))}
									</div>
								</div>

								{/* Shoe side accent - tan/brown */}
								<div style={{
									position: 'absolute',
									bottom: '15%',
									right: '5%',
									width: '40%',
									height: '35%',
									background: 'linear-gradient(135deg, #c4a589 0%, #b89977 100%)',
									borderRadius: '40% 60% 50% 50% / 50% 50% 50% 50%',
									boxShadow: 'inset -3px 3px 10px rgba(0,0,0,0.2)'
								}}></div>

								{/* Orange accent/insole visible */}
								<div style={{
									position: 'absolute',
									top: '-5%',
									left: '25%',
									width: '35%',
									height: '25%',
									background: 'linear-gradient(135deg, #ff9955 0%, #ff7733 100%)',
									borderRadius: '50% 50% 40% 40%',
									boxShadow: '0 5px 15px rgba(255, 119, 51, 0.4)'
								}}></div>
							</div>

							{/* Decorative circles */}
							<div style={{
								position: 'absolute',
								top: '10%',
								right: '15%',
								width: '80px',
								height: '80px',
								background: 'rgba(255, 255, 255, 0.2)',
								borderRadius: '50%',
								backdropFilter: 'blur(10px)'
							}}></div>
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
								Our Numbers
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
								We have impactful numbers
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
								Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
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
										<RollingNumber number={14} isVisible={isVisible} /><span style={{ color: '#d97742' }}>%</span>
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										Customer satisfaction
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										Lorem ipsum dolor sit am et consectet adipiscing.
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
										Monthly active users
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										Lorem ipsum dolor sit am et consectet adipiscing.
									</p>
								</div>

								{/* Stat 3 */}
								<div style={{
									opacity: isVisible ? 1 : 0,
									transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
									transition: 'all 0.6s ease 0.7s'
								}}>
									<div style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: '#1a1a1a', lineHeight: '1', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
										<span style={{ color: '#d97742' }}>$</span><RollingNumber number={4.8} isVisible={isVisible} />
									</div>
									<h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
										Capital raised
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										Lorem ipsum dolor sit am et consectet adipiscing.
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
										Company Growth
									</h3>
									<p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
										Lorem ipsum dolor sit am et consectet adipiscing.
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
							<h3 className={'section-title'}>Our Partners</h3>
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
								<span className={'tag'}>Team</span>
								<h2 className={'title'}>Our Team</h2>
								<p className={'description'}>Introducing our dynamic and resilient team—innovators, collaborators, and leaders.</p>
							</div>
						</FadeInWhenVisible>
					</Stack>
					<Stack className={'container'}>
						<div className={'team-grid'}>
							{[
								{
									img: "/img/banner/agents.webp",
									name: "Olivia Martinez",
									role: "Model 01",
									quote: "Design is not just what it looks like and feels like. Design is how it works."
								},
								{
									img: "/img/banner/properties.png",
									name: "Michael Reynolds",
									role: "Model 02",
									quote: "Simplicity is the ultimate sophistication. We strive for it in every detail."
								},
								{
									img: "/img/banner/header2.svg",
									name: "Jasmine Patel",
									role: "Model 03",
									quote: "Innovation distinguishes between a leader and a follower."
								}
							].map((member, i) => (
								<FadeInWhenVisible key={i} delay={i * 150}>
									<div className={'team-card'}>
										<div className={'image-wrapper'}>
											<img src={member.img} alt={member.name} />
											<div className={'overlay'}>
												<div className={'overlay-content'}>
													<span className={'badge'}>{member.role}</span>
													<p className={'quote'}>&quot;{member.quote}&quot;</p>
												</div>
											</div>
										</div>
										<div className={'info'}>
											<h4>{member.name}</h4>
											<span>{member.role}</span>
										</div>
									</div>
								</FadeInWhenVisible>
							))}
						</div>
					</Stack>

				</Stack>

				{/* FAQ Section */}
				<Stack className={'section faq-section'}>
					<Stack className={'container'}>
						<FadeInWhenVisible>
							<div className={'header'}>
								<span className={'tag'}>FAQ</span>
								<h2 className={'title'}>Frequently Asked Questions</h2>
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
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
