import { getJwtToken } from '../auth';

export let socket: WebSocket | null = null;

export function connectChat() {
    const token = getJwtToken();
    if (!token) return;

    let wsUrl = process.env.NEXT_PUBLIC_API_WS;
    if (!wsUrl) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//168.231.127.193:4004`;
    }
    socket = new WebSocket(`${wsUrl}?token=${token}`);

    socket.onopen = () => {
        console.log('[CHAT] connected');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('[CHAT] message:', data);
    };

    socket.onclose = (e) => {
        console.log('[CHAT] closed', e.code, e.reason);
    };

    socket.onerror = (e) => {
        console.error('[CHAT] error', e);
    };

    return socket;
}

export function sendMessage(text: string) {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(text);
    }
}
