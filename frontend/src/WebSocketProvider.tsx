import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { WebSocketContext } from './WebSocketContext';

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const clientRef = useRef<Client | null>(null);
    const onConnectCallbacks = useRef<(() => void)[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => console.log('[STOMP]', str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP connected');
                setIsConnected(true);

                // Fire all registered onConnect callbacks
                onConnectCallbacks.current.forEach(cb => cb());
                onConnectCallbacks.current = [];
            },
            onDisconnect: () => {
                console.log('STOMP disconnected');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    const sendMessage = (destination: string, body: object) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn(`sendMessage called before connected, dropping message to ${destination}`);
        }
    };

    const subscribe = (
        destination: string,
        callback: (message: IMessage) => void
    ): StompSubscription | null => {
        if (clientRef.current?.connected) {
            return clientRef.current.subscribe(destination, callback);
        }
        console.warn(`subscribe called before connected, dropping subscription to ${destination}`);
        return null;
    };

    const onConnect = (callback: () => void) => {
        if (clientRef.current?.connected) {
            // Already connected — fire immediately
            callback();
        } else {
            // Queue it — will fire in onConnect
            onConnectCallbacks.current.push(callback);
        }
    };

    return (
        <WebSocketContext.Provider value={{ client: clientRef.current, isConnected, sendMessage, subscribe, onConnect }}>
            {children}
        </WebSocketContext.Provider>
    );
};