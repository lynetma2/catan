import {Client} from '@stomp/stompjs';

// 1. Dynamically determine protocol (ws:// or wss://) and host
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.host; // e.g., "123.45.67.89" or "catan.yourdomain.com"

// 2. Point to the Nginx reverse proxy path, NOT port 8080
const brokerURL = `${protocol}//${host}/ws/websocket`;

const client = new Client({
    brokerURL,
    debug: (str) => console.log('[STOMP]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

client.activate();

// Expose for testing
(window as any).stompClient = client;

export default client;