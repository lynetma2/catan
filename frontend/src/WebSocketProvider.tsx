import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import {Client, type IMessage, type StompSubscription} from '@stomp/stompjs';

interface WebSocketContextValue {
    client: Client | null;
    isConnected: boolean;
    sendMessage: (destination: string, body: object) => void;
    subscribe: (
        destination: string,
        callback: (message: IMessage) => void
    ) => StompSubscription | null;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({children}) => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // your endpoint
            debug: (str) => console.log('[STOMP]', str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP connected');
                setIsConnected(true);
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
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        }
    };

    const subscribe = (destination: string, callback: (message: IMessage) => void): StompSubscription | null => {
        if (clientRef.current && clientRef.current.connected) {
            return clientRef.current.subscribe(destination, callback);
        }
        return null;
    };

    const value: WebSocketContextValue = {
        client: clientRef.current,
        isConnected,
        sendMessage,
        subscribe,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
