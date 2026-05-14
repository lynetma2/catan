import React, {type ReactNode, useEffect, useRef, useState} from 'react';
import stompClient from './stompClient';
import {WebSocketContext} from './WebSocketContext';
import type {IMessage, StompSubscription} from '@stomp/stompjs';

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const onConnectCallbacks = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Attach handlers ONCE – the client already exists
        const onConnectHandler = () => {
            console.log('STOMP connected');
            setIsConnected(true);
            // Fire all queued callbacks
            onConnectCallbacks.current.forEach(cb => cb());
            onConnectCallbacks.current = [];
        };

        const onDisconnectHandler = () => {
            console.log('STOMP disconnected');
            setIsConnected(false);
        };

        const onErrorHandler = (frame: any) => {
            console.error('STOMP error:', frame);
        };

        stompClient.onConnect = onConnectHandler;
        stompClient.onDisconnect = onDisconnectHandler;
        stompClient.onStompError = onErrorHandler;

        // If already connected (e.g., after a reconnection), update state
        if (stompClient.connected) {
            setIsConnected(true);
        }

        // No cleanup that deactivates the client – it lives forever
    }, []);

    const sendMessage = (destination: string, body: unknown) => {
        if (stompClient.connected) {
            stompClient.publish({
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
        if (stompClient.connected) {
            return stompClient.subscribe(destination, callback);
        }
        console.warn(`subscribe called before connected, dropping subscription to ${destination}`);
        return null;
    };

    const onConnect = (callback: () => void) => {
        if (stompClient.connected) {
            callback();
        } else {
            onConnectCallbacks.current.push(callback);
        }
    };

    return (
        <WebSocketContext.Provider
            value={{client: stompClient, isConnected, sendMessage, subscribe, onConnect}}
        >
            {children}
        </WebSocketContext.Provider>
    );
};