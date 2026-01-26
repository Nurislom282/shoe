import { getJwtToken } from '../auth';

type ChatListener = (data: any) => void;

let socket: WebSocket | null = null;
let reconnectInterval: NodeJS.Timeout | null = null;
const listeners: Set<ChatListener> = new Set();

const notifyListeners = (data: any) => {
    listeners.forEach((listener) => listener(data));
};

export function connectChat() {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    const token = getJwtToken() || '';

    let wsUrl = process.env.NEXT_PUBLIC_API_WS;
    if (!wsUrl) {
        if (typeof window !== 'undefined') {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${protocol}//168.231.127.193:4004`;
        } else {
            wsUrl = 'ws://168.231.127.193:4004';
        }
    }

    socket = new WebSocket(`${wsUrl}?token=${token}`);

    socket.onopen = () => {
        console.log('[CHAT] Connected');
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // console.log('[CHAT] Incoming:', data);
            notifyListeners(data);
        } catch (e) { /* ignore */ }
    };

    socket.onclose = (e) => {
        console.log('[CHAT] Disconnected', e.code, e.reason);
        socket = null;
        if (!reconnectInterval && e.code !== 1000) {
            reconnectInterval = setInterval(() => {
                console.log('[CHAT] Attempting reconnect...');
                connectChat();
            }, 3000);
        }
    };

    socket.onerror = (e) => {
        console.error('[CHAT] Error', e);
    };
}

export function subscribeToChat(listener: ChatListener) {
    listeners.add(listener);
    // If not connected, try connecting
    if (!socket) {
        connectChat();
    }

    return () => {
        listeners.delete(listener);
    };
}

export function disconnectChat() {
    if (socket) {
        socket.close(1000, 'Client closed');
        socket = null;
    }
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
}

export function sendMessage(text: string) {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(text);
    } else {
        console.warn('[CHAT] Socket not connected, cannot send:', text);
    }
}
