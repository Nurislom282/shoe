import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, Chip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar, useMutation } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert, sweetTopSuccessAlert } from '../sweetAlert';
import { CREATE_SUPPORT_INQUIRY } from '../../apollo/user/mutation';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
	timestamp?: Date;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

interface SupportBotMessage {
	text: string;
	timestamp: Date;
	isBot: boolean;
}

type ChatTab = 'community' | 'support';

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [supportBotMessages, setSupportBotMessages] = useState<SupportBotMessage[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const textInput = useRef<HTMLInputElement>(null);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [activeTab, setActiveTab] = useState<ChatTab>('community');
	const [isBotTyping, setIsBotTyping] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	// Support bot quick actions
	const quickActions = [
		'Order Status',
		'Shipping Info',
		'Returns & Exchanges',
		'Product Sizing',
		'Payment Issues',
		'Contact Support',
	];

	// GraphQL mutation for creating support inquiries
	const [createSupportInquiry, { loading: inquiryLoading }] = useMutation(CREATE_SUPPORT_INQUIRY);

	// Support bot response logic - returns null if message needs admin attention
	const getBotResponse = (userMessage: string): { response: string; needsAdmin: boolean } => {
		const lowerMessage = userMessage.toLowerCase();

		// Check if it's a quick action button (exact match)
		const isQuickAction = quickActions.some((action) => lowerMessage === action.toLowerCase());

		// If it's a quick action or matches common patterns, provide bot response
		if (isQuickAction ||
			lowerMessage.includes('order') || lowerMessage.includes('status') || lowerMessage.includes('track') ||
			lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship') ||
			lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund') ||
			lowerMessage.includes('size') || lowerMessage.includes('sizing') || lowerMessage.includes('fit') ||
			lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('checkout') ||
			lowerMessage.includes('product') || lowerMessage.includes('sneaker') || lowerMessage.includes('shoe') ||
			lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') ||
			lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {

			if (lowerMessage.includes('order') || lowerMessage.includes('status') || lowerMessage.includes('track')) {
				return { response: "To check your order status, please visit 'My Page' → 'My Orders' or provide your order number. I can help you track it!", needsAdmin: false };
			}
			if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship')) {
				return { response: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping costs vary by location. Would you like to know more about shipping to your area?", needsAdmin: false };
			}
			if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
				return { response: "We accept returns within 30 days of purchase. Items must be unworn with original tags. For exchanges, visit 'My Page' → 'Returns & Exchanges'. Need help with a specific return?", needsAdmin: false };
			}
			if (lowerMessage.includes('size') || lowerMessage.includes('sizing') || lowerMessage.includes('fit')) {
				return { response: "Each product page includes a size guide. Generally, our sneakers run true to size. If you're between sizes, we recommend going up half a size. Check the product detail page for specific measurements!", needsAdmin: false };
			}
			if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('checkout')) {
				return { response: "We accept all major credit cards, PayPal, and Apple Pay. If you're experiencing payment issues, try a different payment method or contact our support team for assistance.", needsAdmin: false };
			}
			if (lowerMessage.includes('product') || lowerMessage.includes('sneaker') || lowerMessage.includes('shoe')) {
				return { response: "We have a wide selection of premium sneakers! Browse our collection by brand, style, or category. Is there a specific product or brand you're looking for?", needsAdmin: false };
			}
			if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
				return { response: "Hello! 👋 Welcome to JUST DO IT support. I'm here to help with orders, shipping, returns, sizing, and more. How can I assist you today?", needsAdmin: false };
			}
			if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
				return { response: "You're welcome! 😊 Is there anything else I can help you with today?", needsAdmin: false };
			}

			return { response: "I understand you need help. Could you provide more details? I can assist with orders, shipping, returns, sizing, payments, or product information. You can also use the quick action buttons above for faster help!", needsAdmin: false };
		}

		// Custom message that needs admin attention
		return { response: '', needsAdmin: true };
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (socket && activeTab === 'community') {
			socket.onmessage = (msg) => {
				const data = JSON.parse(msg.data);

				switch (data.event) {
					case 'info':
						const newInfo: InfoPayload = data;
						setOnlineUsers(data.totalClients);
						break;
					case 'getMessages':
						const list: MessagePayload[] = data.list;
						setMessagesList(list);
						break;
					case 'message':
						const newMessage: MessagePayload = { ...data, timestamp: new Date() };
						setMessagesList((prev) => [...prev, newMessage]);
						break;
				}
			};
		}
	}, [socket, activeTab]);

	// Initialize support bot with welcome message
	useEffect(() => {
		if (activeTab === 'support' && supportBotMessages.length === 0) {
			setSupportBotMessages([
				{
					text: "Hello! 👋 I'm your support assistant. I can help you with orders, shipping, returns, sizing, payments, and product information. How can I assist you today?",
					timestamp: new Date(),
					isBot: true,
				},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const handleTabChange = (tab: ChatTab) => {
		setActiveTab(tab);
		setMessageInput('');
	};

	const getInputMessageHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[],
	);

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onClickHandler();
		}
	};

	const onClickHandler = async () => {
		if (!messageInput.trim()) {
			sweetErrorAlert(Messages.error4);
			return;
		}

		if (activeTab === 'community') {
			if (socket) {
				socket.send(JSON.stringify({ event: 'message', data: messageInput }));
				setMessageInput('');
			}
		} else {
			// Support bot chat
			const userMessage: SupportBotMessage = {
				text: messageInput,
				timestamp: new Date(),
				isBot: false,
			};
			setSupportBotMessages((prev) => [...prev, userMessage]);
			const messageToSend = messageInput;
			setMessageInput('');

			// Check if message needs admin attention
			const botResponseData = getBotResponse(messageToSend);

			// Simulate bot typing
			setIsBotTyping(true);

			if (botResponseData.needsAdmin) {
				// Send to admin
				try {
					await createSupportInquiry({
						variables: {
							input: {
								inquiryContent: messageToSend,
							},
						},
					});

					setTimeout(() => {
						const adminResponse: SupportBotMessage = {
							text: "Thank you for your message! 📧 Our support team has received your inquiry and will contact you soon. We typically respond within 24 hours. You'll receive a response via email or through this chat. Is there anything else I can help you with in the meantime?",
							timestamp: new Date(),
							isBot: true,
						};
						setSupportBotMessages((prev) => [...prev, adminResponse]);
						setIsBotTyping(false);
						sweetTopSuccessAlert('Your inquiry has been sent to our support team!');
					}, 1500);
				} catch (error: any) {
					setTimeout(() => {
						const errorResponse: SupportBotMessage = {
							text: "I apologize, but there was an issue sending your message. Please try again or contact us directly. Our support team is here to help!",
							timestamp: new Date(),
							isBot: true,
						};
						setSupportBotMessages((prev) => [...prev, errorResponse]);
						setIsBotTyping(false);
						sweetErrorAlert('Failed to send inquiry. Please try again.');
					}, 1500);
				}
			} else {
				// Bot can answer
				setTimeout(() => {
					const botResponse: SupportBotMessage = {
						text: botResponseData.response,
						timestamp: new Date(),
						isBot: true,
					};
					setSupportBotMessages((prev) => [...prev, botResponse]);
					setIsBotTyping(false);
				}, 1000 + Math.random() * 1000);
			}
		}
	};

	const handleQuickAction = (action: string) => {
		const userMessage: SupportBotMessage = {
			text: action,
			timestamp: new Date(),
			isBot: false,
		};
		setSupportBotMessages((prev) => [...prev, userMessage]);

		setIsBotTyping(true);
		setTimeout(() => {
			const botResponseData = getBotResponse(action);
			const botResponse: SupportBotMessage = {
				text: botResponseData.response,
				timestamp: new Date(),
				isBot: true,
			};
			setSupportBotMessages((prev) => [...prev, botResponse]);
			setIsBotTyping(false);
		}, 1000 + Math.random() * 1000);
	};

	const formatTime = (date: Date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito', display: 'flex', alignItems: 'center', gap: '10px' }}>
						{activeTab === 'community' ? <ChatBubbleOutlineIcon /> : <SupportAgentIcon />}
						{activeTab === 'community' ? 'Community Chat' : 'Support Bot'}
					</div>
					{activeTab === 'community' && (
						<RippleBadge
							style={{
								margin: '-18px 0 0 21px ',
							}}
							badgeContent={onlineUsers}
						/>
					)}
				</Box>
				<Box className={'chat-tabs'} component={'div'}>
					<button
						className={`chat-tab ${activeTab === 'community' ? 'active' : ''}`}
						onClick={() => handleTabChange('community')}
					>
						<ChatBubbleOutlineIcon style={{ fontSize: '18px', marginRight: '5px' }} />
						Community
					</button>
					<button
						className={`chat-tab ${activeTab === 'support' ? 'active' : ''}`}
						onClick={() => handleTabChange('support')}
					>
						<SupportAgentIcon style={{ fontSize: '18px', marginRight: '5px' }} />
						Support
					</button>
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							{activeTab === 'community' ? (
								<>
									<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
										<div className={'welcome'}>
											👟 Welcome to JUST DO IT Community Chat! Share your sneaker finds, ask questions, and connect with other sneaker enthusiasts!
										</div>
									</Box>
									{messagesList.map((ele: MessagePayload, index: number) => {
										const { text, memberData, timestamp } = ele;
										const memberImage = memberData?.memberImage
											? `${REACT_APP_API_URL}/${memberData?.memberImage}`
											: '/img/profile/defaultUser.svg';

										return memberData?._id === user?._id ? (
											<Box
												key={index}
												component={'div'}
												flexDirection={'row'}
												style={{ display: 'flex' }}
												alignItems={'flex-end'}
												justifyContent={'flex-end'}
												sx={{ m: '10px 0px' }}
											>
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '8px' }}>
													<div className={'msg-right'}>{text}</div>
													{timestamp && (
														<Typography variant="caption" sx={{ fontSize: '10px', color: '#999', mt: 0.5 }}>
															{formatTime(timestamp)}
														</Typography>
													)}
												</div>
											</Box>
										) : (
											<Box key={index} flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
												<Avatar alt={memberData?.memberNick || 'user'} src={memberImage} sx={{ width: 32, height: 32 }} />
												<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
													<Typography variant="caption" sx={{ fontSize: '10px', color: '#666', mb: 0.5 }}>
														{memberData?.memberNick || 'Anonymous'}
													</Typography>
													<div className={'msg-left'}>{text}</div>
													{timestamp && (
														<Typography variant="caption" sx={{ fontSize: '10px', color: '#999', mt: 0.5 }}>
															{formatTime(timestamp)}
														</Typography>
													)}
												</div>
											</Box>
										);
									})}
								</>
							) : (
								<>
									{activeTab === 'support' && supportBotMessages.length === 0 && (
										<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
											<div className={'welcome'}>
												👋 Hi! I'm your support assistant. How can I help you today?
											</div>
										</Box>
									)}
									{supportBotMessages.map((msg: SupportBotMessage, index: number) => (
										<Box
											key={index}
											component={'div'}
											flexDirection={'row'}
											style={{ display: 'flex' }}
											alignItems={msg.isBot ? 'flex-start' : 'flex-end'}
											justifyContent={msg.isBot ? 'flex-start' : 'flex-end'}
											sx={{ m: '10px 0px' }}
										>
											{msg.isBot ? (
												<>
													<Avatar
														alt="Support Bot"
														sx={{
															width: 32,
															height: 32,
															bgcolor: '#33c1c1',
															fontSize: '16px',
														}}
													>
														🤖
													</Avatar>
													<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px', maxWidth: '75%' }}>
														<Typography variant="caption" sx={{ fontSize: '10px', color: '#666', mb: 0.5 }}>
															Support Bot
														</Typography>
														<div className={'msg-left'}>{msg.text}</div>
														<Typography variant="caption" sx={{ fontSize: '10px', color: '#999', mt: 0.5 }}>
															{formatTime(msg.timestamp)}
														</Typography>
													</div>
												</>
											) : (
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '8px', maxWidth: '75%' }}>
													<div className={'msg-right'}>{msg.text}</div>
													<Typography variant="caption" sx={{ fontSize: '10px', color: '#999', mt: 0.5 }}>
														{formatTime(msg.timestamp)}
													</Typography>
												</div>
											)}
										</Box>
									))}
									{isBotTyping && (
										<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
											<Avatar
												alt="Support Bot"
												sx={{
													width: 32,
													height: 32,
													bgcolor: '#33c1c1',
													fontSize: '16px',
												}}
											>
												🤖
											</Avatar>
											<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
												<div className={'msg-left typing-indicator'}>
													<span></span>
													<span></span>
													<span></span>
												</div>
											</div>
										</Box>
									)}
								</>
							)}
						</Stack>
					</ScrollableFeed>
				</Box>
				{activeTab === 'support' && (
					<Box className={'chat-quick-actions'} component={'div'}>
						<Typography variant="caption" sx={{ fontSize: '11px', color: '#666', mb: 1, display: 'block', px: 2, pt: 1 }}>
							Quick Actions:
						</Typography>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px' }}>
							{quickActions.map((action, idx) => (
								<Chip
									key={idx}
									label={action}
									size="small"
									onClick={() => handleQuickAction(action)}
									sx={{
										fontSize: '10px',
										height: '24px',
										cursor: 'pointer',
										'&:hover': { backgroundColor: '#e0e0e0' },
									}}
								/>
							))}
						</div>
					</Box>
				)}
				<Box className={'chat-bott'} component={'div'}>
					<input
						ref={textInput}
						type={'text'}
						name={'message'}
						value={messageInput}
						className={'msg-input'}
						placeholder={activeTab === 'community' ? 'Type message...' : 'Ask me anything about orders, shipping, returns...'}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
						disabled={isBotTyping || inquiryLoading}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler} disabled={isBotTyping || inquiryLoading}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack >
	);
};

export default Chat;
