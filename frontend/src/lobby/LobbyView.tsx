import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import {
    applyLobbyEvent,
    type Lobby,
    type Player,
} from '../datalayer/domain/lobby/Lobby.ts';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';

import { useWebSocket } from '@/WebSocketContext';

import { useLobbyActions } from './useLobbyActions';

import type {
    StompSubscription,
} from '@stomp/stompjs';

import {
    LobbyServerEvents,
    type LobbyServerEvent,
} from '@/events/lobby/LobbyServerEvents';

import {
    assertNever,
} from '@/events/shared/EventTypes';

function LobbyView() {
    const navigate = useNavigate();

    const params = useParams();

    const {
        subscribe,
        onConnect,
    } = useWebSocket();

    const topicSubscription =
        useRef<StompSubscription | null>(null);

    const queueSubscription =
        useRef<StompSubscription | null>(null);

    const [lobby, setLobby] =
        React.useState<Lobby | null>(null);

    const lobbyId: string =
        params.lobbyId!;

    const username: string =
        useMemo(
            () => localStorage.getItem('username') ?? '',
            []
        );

    const playerId: string =
        useMemo(() => {
            const existing =
                sessionStorage.getItem('playerId');

            if (existing)
                return existing;

            const newId = uuidv4();

            sessionStorage.setItem('playerId', newId);

            return newId;
        }, []);

    const actions =
        useLobbyActions(lobbyId);

    const myPlayer =
        lobby?.players.get(playerId);

    const isLeader =
        myPlayer?.isLeader ?? false;

    const isReady =
        myPlayer?.isReady ?? false;

    function parseLobbyState(
        event: Extract<
            LobbyServerEvent,
            { type: typeof LobbyServerEvents.state.success }
        >
    ): Lobby {
        const rawPlayers =
            JSON.parse(event.payload.snapshot).players;

        const entries =
            Object.values(rawPlayers).map(
                (p: any): [string, Player] => [
                    p.id,
                    {
                        playerId: p.id,
                        username: p.username,
                        isReady: p.isReady,
                        isLeader: p.isLeader,
                    }
                ]
            );

        return {
            lobbyId: event.payload.lobbyId,
            players: new Map<string, Player>(entries),
        };
    }

    function subscribeToLobbyTopic() {
        if (topicSubscription.current)
            return;

        topicSubscription.current =
            subscribe(`/topic/lobby/${lobbyId}`, (response) => {
                const event: LobbyServerEvent =
                    JSON.parse(response.body);

                console.log('received event:', event);

                switch (event.type) {
                    case LobbyServerEvents.player.join.success:
                    case LobbyServerEvents.player.ready.success:
                    case LobbyServerEvents.player.unready.success:
                    case LobbyServerEvents.player.disconnect.success:
                    case LobbyServerEvents.player.reconnect.success: {
                        setLobby(prev => {
                            if (!prev)
                                return null;
                            return applyLobbyEvent(prev, event);
                        });
                        break;
                    }

                    case LobbyServerEvents.state.success: {
                        setLobby(parseLobbyState(event));
                        break;
                    }

                    case LobbyServerEvents.initialized.success: {
                        navigate(`/game/${lobbyId}`, { replace: true });
                        break;
                    }

                    case LobbyServerEvents.initialized.rejected: {
                        console.error(
                            'Game initialization rejected:',
                            event.payload.reason
                        );
                        break;
                    }

                    case LobbyServerEvents.initialized.error: {
                        console.error(
                            'Game initialization error:',
                            event.payload.message
                        );
                        break;
                    }

                    case LobbyServerEvents.start.rejected: {
                        console.error(
                            'Game start rejected:',
                            event.payload.reason
                        );
                        break;
                    }

                    case LobbyServerEvents.player.join.rejected: {
                        console.error(
                            'Join rejected:',
                            event.payload.reason
                        );
                        navigate(`/?lobbyId=${lobbyId}`);
                        break;
                    }

                    case LobbyServerEvents.player.reconnect.rejected: {
                        console.error(
                            'Reconnect rejected:',
                            event.payload.reason
                        );
                        navigate(`/?lobbyId=${lobbyId}`);
                        break;
                    }

                    default:
                        assertNever(event);
                }
            });
    }

    useEffect(() => {
        if (!username) {
            navigate(`/?lobbyId=${lobbyId}`);
            return;
        }

        onConnect(() => {
            subscribeToLobbyTopic();

            setTimeout(() => {
                actions.reconnectLobby(username);
            }, 0);
        });

        return () => {
            topicSubscription.current?.unsubscribe();
            topicSubscription.current = null;
            queueSubscription.current?.unsubscribe();
            queueSubscription.current = null;
        };
    }, []);

    function handleReadyToggle() {
        if (!lobby)
            return;

        if (isReady) {
            actions.setUnready();
        } else {
            actions.setReady();
        }
    }

    function handleStartGame() {
        if (!lobby)
            return;

        actions.startGame();
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {lobby ? (
                <p className="text-sm text-muted-foreground">
                    Lobby ID: {lobby.lobbyId}
                </p>
            ) : (
                <p>Connecting...</p>
            )}

            <PlayersView players={lobby?.players} />

            {isLeader ? (
                <Button onClick={handleStartGame} disabled={!lobby}>
                    Start Game
                </Button>
            ) : (
                <Button onClick={handleReadyToggle} disabled={!lobby}>
                    {isReady ? 'Set Not Ready' : 'Set Ready'}
                </Button>
            )}
        </div>
    );
}

type LobbyPlayersProps = {
    players?: Map<string, Player>;
};

function PlayersView({ players }: LobbyPlayersProps) {
    const playerList =
        players ? [...players.values()] : [];

    return (
        <Card className="w-1/3 min-w-2xs">
            <CardHeader>
                <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
                {playerList.map((player) => (
                    <div
                        key={player.playerId}
                        className="flex flex-row w-full max-w-sm justify-between gap-3"
                    >
                        <Label>
                            {player.isLeader
                                ? '* ' + player.username
                                : player.username}
                        </Label>
                        {player.isReady ? (
                            <Label className="text-green-500">
                                Ready
                            </Label>
                        ) : (
                            <Label>Not Ready</Label>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default LobbyView;