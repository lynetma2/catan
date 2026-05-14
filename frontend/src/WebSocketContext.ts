import { createContext, useContext } from 'react';
import type { Client, IMessage, StompSubscription } from '@stomp/stompjs';

export interface WebSocketContextValue {
    client: Client | null;
    isConnected: boolean;
    sendMessage: (destination: string, body: unknown) => void;
    subscribe: (
        destination: string,
        callback: (message: IMessage) => void
    ) => StompSubscription | null;
    onConnect: (callback: () => void) => void;
}

export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};