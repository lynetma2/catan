import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router';
import {v4 as uuidv4} from 'uuid';
import {applyLobbyEvent, type Lobby, type Player} from '@/lobby/Lobby';
import {type InboundLobbyEvent, type OutboundLobbyEvent} from '@/lobby/LobbyEvents';
import {handleLobbyEvent} from '@/lobby/LobbyEventHandler';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useWebSocket} from '@/WebSocketContext';
import type {StompSubscription} from '@stomp/stompjs';

function LobbyView() {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { sendMessage, subscribe, onConnect } = useWebSocket();

    const topicSubscription = useRef<StompSubscription | null>(null);
    const queueSubscription = useRef<StompSubscription | null>(null);

    const [lobby, setLobby] = React.useState<Lobby | null>(null);

    const playerId: string = useMemo(() => location.state?.playerId ?? uuidv4(), []);
    const username: string = location.state?.username ?? '';
    const urlLobbyId: string | undefined = params.lobbyId;

    const myPlayer = lobby?.players.get(playerId);
    const isLeader = myPlayer?.isLeader ?? false;
    const isReady = myPlayer?.isReady ?? false;

    // Subscribe to the public topic for live updates.
    function subscribeToLobbyTopic(lobbyId: string) {
        if (topicSubscription.current) return;
        topicSubscription.current = subscribe(`/topic/lobby/${lobbyId}`, (response) => {
            const event: OutboundLobbyEvent = JSON.parse(response.body);
            handleLobbyEvent(event, {
                PLAYER_JOINED_LOBBY: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                PLAYER_READY: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                PLAYER_UNREADY: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                PLAYER_DISCONNECTED: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                GAME_INITIALIZED: (e) => {
                    navigate(`/game/${e.gameId}`, {state: {username, playerId}});
                },
                GAME_START_REJECTED: (e) => {
                    console.error('Game start rejected:', e.reason);
                },
                LOBBY_NOT_FOUND: (e) => {
                    console.error('Lobby not found:', e.lobbyId);
                    navigate('/');
                },
            });
        });
    }

    useEffect(() => {
        if (!username) {
            console.error('No username found');
            navigate('/');
            return;
        }

        onConnect(() => {
            // 1. Subscribe to the private queue before sending any request
            queueSubscription.current = subscribe('/user/queue/lobby', (response) => {
                console.log('[LOBBY QUEUE] RAW message received:', response);
                console.log('[LOBBY QUEUE] body:', response.body);

                try {
                    const event: InboundLobbyEvent = JSON.parse(response.body);
                    console.log('[LOBBY QUEUE] Parsed event:', event);

                    handleLobbyEvent(event, {
                        LOBBY_STATE: (e) => {
                            console.log('[LOBBY QUEUE] Handling LOBBY_STATE, snapshot:', e.snapshot);
                            // e.snapshot.players is a Record<string, PlayerData>, convert to array then Map
                            const playersMap = new Map<string, Player>(
                                Object.values(e.snapshot.players).map(p => [
                                    p.playerId,
                                    {
                                        playerId: p.playerId,
                                        username: p.username,
                                        isReady: p.isReady,
                                        isLeader: p.isLeader,
                                    },
                                ])
                            );
                            setLobby({
                                lobbyId: e.lobbyId,
                                players: playersMap,
                            });
                            subscribeToLobbyTopic(e.lobbyId);
                        },
                        LOBBY_JOIN_REJECTED: (e) => {
                            console.error('Join rejected:', e.reason);
                            navigate('/');
                        },
                        GAME_START_REJECTED: (e) => {
                            console.error('Game start rejected:', e.reason);
                        },
                        LOBBY_NOT_FOUND: (e) => {
                            console.error('Lobby not found:', e.lobbyId);
                            navigate('/');
                        },
                        // LOBBY_RECONNECT_REJECTION: (e) => {
                        //     console.error('Reconnect rejected:', e.reason);
                        //     navigate('/');
                        // },
                    });
                } catch (error) {
                    console.error('[LOBBY QUEUE] Error processing message:', error);
                }
            });

            // 2. Let the SUBSCRIBE frame flush before sending the request
            setTimeout(() => {
                if (urlLobbyId) {
                    sendMessage(`/app/lobby/${urlLobbyId}/events`, {
                        type: 'LOBBY_JOIN_REQUESTED',
                        playerId,
                        playerName: username,
                    });
                } else {
                    sendMessage('/app/lobby', {
                        type: 'LOBBY_CREATE_REQUESTED',
                        playerId,
                        playerName: username,
                    });
                }
            }, 0);
        });

        return () => {
            topicSubscription.current?.unsubscribe();
            topicSubscription.current = null;
            queueSubscription.current?.unsubscribe();
            queueSubscription.current = null;
        };
    }, []);

    function startGame() {
        if (!lobby) return;
        sendMessage(`/app/lobby/${lobby.lobbyId}/events`, {
            type: 'GAME_START_REQUESTED',
            playerId,
        });
    }

    function updateReadyState() {
        if (!lobby) return;
        sendMessage(`/app/lobby/${lobby.lobbyId}/events`, {
            type: isReady ? 'PLAYER_UNREADY_REQUESTED' : 'PLAYER_READY_REQUESTED',
            playerId,
        });
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {lobby ? (
                <p className="text-sm text-muted-foreground">Lobby ID: {lobby.lobbyId}</p>
            ) : (
                <p>Connecting...</p>
            )}
            <PlayersView players={lobby?.players} />
            {isLeader ? (
                <Button onClick={startGame}>Start Game</Button>
            ) : (
                <Button onClick={updateReadyState}>{isReady ? 'Set Not Ready' : 'Set Ready'}</Button>
            )}
        </div>
    );
}

type LobbyPlayersProps = {
    players?: Map<string, Player>;
};

function PlayersView({ players }: LobbyPlayersProps) {
    const playerList = players ? [...players.values()] : [];

    return (
        <Card className="w-1/3 min-w-2xs">
            <CardHeader>
                <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
                {playerList.map((player) => (
                    <div key={player.playerId} className="flex flex-row w-full max-w-sm justify-between gap-3">
                        <Label>{player.isLeader ? '* ' + player.username : player.username}</Label>
                        {player.isReady ? (
                            <Label className="text-green-500">Ready</Label>
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