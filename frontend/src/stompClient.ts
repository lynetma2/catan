import {Client} from '@stomp/stompjs';

const client = new Client({
    brokerURL: 'ws://localhost:8080/ws/websocket',
    debug: (str) => console.log('[STOMP]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

client.activate();

// Expose for testing
(window as any).stompClient = client;

export default client;