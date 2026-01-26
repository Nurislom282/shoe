import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
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
import { userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert, sweetTopSuccessAlert } from '../sweetAlert';
import { CREATE_SUPPORT_INQUIRY } from '../../apollo/user/mutation';
import { connectChat, sendMessage, socket } from './chat.socket';

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
	const { t } = useTranslation('common');
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
	// const socket = useReactiveVar(socketVar);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
				return { response: t('chat.bot_responses.order_status'), needsAdmin: false };
			}
			if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship')) {
				return { response: t('chat.bot_responses.shipping_info'), needsAdmin: false };
			}
			if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
				return { response: t('chat.bot_responses.returns_exchanges'), needsAdmin: false };
			}
			if (lowerMessage.includes('size') || lowerMessage.includes('sizing') || lowerMessage.includes('fit')) {
				return { response: t('chat.bot_responses.product_sizing'), needsAdmin: false };
			}
			if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('checkout')) {
				return { response: t('chat.bot_responses.payment_issues'), needsAdmin: false };
			}
			if (lowerMessage.includes('product') || lowerMessage.includes('sneaker') || lowerMessage.includes('shoe')) {
				return { response: t('chat.bot_responses.product_inquiry'), needsAdmin: false };
			}
			if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
				return { response: t('chat.bot_responses.greeting'), needsAdmin: false };
			}
			if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
				return { response: t('chat.bot_responses.thanks'), needsAdmin: false };
			}

			return { response: t('chat.bot_responses.default'), needsAdmin: false };
		}

		// Custom message that needs admin attention
		return { response: '', needsAdmin: true };
	};

	/** LIFECYCLES **/
	useEffect(() => {
		const client = connectChat();
		if (client && activeTab === 'community') {
			client.onmessage = (msg) => {
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
	}, [activeTab]);

	// Initialize support bot with welcome message
	useEffect(() => {
		// Removed static initial message setting to support dynamic translation
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
			sendMessage(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
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
							text: t('chat.bot_responses.admin_success'),
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
							text: t('chat.bot_responses.admin_failure'),
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
			text: t(`chat.actions.${action}`) || action,
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
						{activeTab === 'community' ? (
							<Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
								{t('chat.tabs.community')}
								{mounted && !socket && (
									<Typography variant="caption" sx={{ color: '#ff4d4f', ml: 1, fontSize: '10px' }}>
										{t('chat.disconnected')}
									</Typography>
								)}
							</Box>
						) : t('chat.tabs.support')}
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
						{t('Community')}
					</button>
					<button
						className={`chat-tab ${activeTab === 'support' ? 'active' : ''}`}
						onClick={() => handleTabChange('support')}
					>
						<SupportAgentIcon style={{ fontSize: '18px', marginRight: '5px' }} />
						{t('Support?').replace('?', '')}
					</button>
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							{activeTab === 'community' ? (
								<>
									<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
										<div className={'welcome'}>
											{t('chat.community_welcome')}
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
									<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
										<div className={'welcome'}>
											{t('chat.support_welcome')}
										</div>
									</Box>
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
															bgcolor: '#ff4757',
															fontSize: '16px',
														}}
													>
														🤖
													</Avatar>
													<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px', maxWidth: '75%' }}>
														<Typography variant="caption" sx={{ fontSize: '10px', color: '#666', mb: 0.5 }}>
															{t('chat.tabs.support')}
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
													bgcolor: '#ff4757',
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
							{t('chat.quick_actions')}
						</Typography>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px' }}>
							{quickActions.map((action, idx) => (
								<Chip
									key={idx}
									label={t(`chat.actions.${action}`)}
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
						placeholder={
							activeTab === 'community'
								? t('chat.input_placeholder.community')
								: t('chat.input_placeholder.support')
						}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
						disabled={
							// added simple disabled check to avoid long logic if simple
							isBotTyping || inquiryLoading
						}
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
