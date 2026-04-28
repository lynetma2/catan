import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {useNavigate, useParams} from 'react-router';
import {v4 as uuidv4} from 'uuid';
import {applyLobbyEvent, type Lobby, type Player} from '@/lobby/Lobby';
import {type OutboundLobbyEvent} from '@/lobby/LobbyEvents';
import {handleLobbyEvent} from '@/lobby/LobbyEventHandler';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useWebSocket} from '@/WebSocketContext';
import type {StompSubscription} from '@stomp/stompjs';

function LobbyView() {
    const navigate = useNavigate();
    const params = useParams();
    const {sendMessage, subscribe, onConnect} = useWebSocket();

    const topicSubscription = useRef<StompSubscription | null>(null);
    const queueSubscription = useRef<StompSubscription | null>(null);

    const [lobby, setLobby] = React.useState<Lobby | null>(null);

    const lobbyId: string = params.lobbyId!;

    const username: string = useMemo(() => localStorage.getItem('username') ?? '', []);
    const playerId: string = useMemo(() => {
        const existing = sessionStorage.getItem('playerId');
        if (existing) return existing;
        const newId = uuidv4();
        sessionStorage.setItem('playerId', newId);
        return newId;
    }, []);

    const myPlayer = lobby?.players.get(playerId);
    const isLeader = myPlayer?.isLeader ?? false;
    const isReady = myPlayer?.isReady ?? false;

    function parseLobbyState(event: any): Lobby {
        const playersMap = new Map<string, Player>(
            Object.values(event.snapshot.players).map((p: any) => [
                p.playerId,
                {
                    playerId: p.playerId,
                    username: p.username,
                    isReady: p.isReady,
                    isLeader: p.isLeader,
                },
            ])
        );
        return {
            lobbyId: event.lobbyId,
            players: playersMap,
        };
    }

    function subscribeToLobbyTopic() {
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
                    navigate(`/game/${e.gameId}`);
                },
                GAME_START_REJECTED: (e) => {
                    console.error('Game start rejected:', e.reason);
                },
                LOBBY_NOT_FOUND: (e) => {
                    console.error('Lobby not found:', e.lobbyId);
                    navigate(`/?lobbyId=${lobbyId}`);
                },
            });
        });
    }

    function subscribeToQueue(onLobbyState: (event: any) => void) {
        queueSubscription.current = subscribe('/user/queue/lobby', (response) => {
            try {
                const event = JSON.parse(response.body);

                if (event.type === 'LOBBY_STATE') {
                    onLobbyState(event);
                } else if (event.type === 'LOBBY_JOIN_REJECTED') {
                    console.error('Join rejected:', event.reason);
                    navigate(`/?lobbyId=${lobbyId}`);
                } else if (event.type === 'LOBBY_NOT_FOUND') {
                    console.error('Lobby not found:', event.lobbyId);
                    navigate(`/?lobbyId=${lobbyId}`);
                } else if (event.type === 'GAME_START_REJECTED') {
                    console.error('Game start rejected:', event.reason);
                }
            } catch (error) {
                console.error('Error processing lobby message:', error);
            }
        });
    }

    useEffect(() => {
        if (!username) {
            navigate(`/?lobbyId=${lobbyId}`);
            return;
        }

        const storedState = sessionStorage.getItem('lobbyState');

        onConnect(() => {
            if (storedState) {
                // Normal flow: we have initial state from IndexPage, apply it and
                // subscribe to live updates only.
                const event = JSON.parse(storedState);
                sessionStorage.removeItem('lobbyState');
                setLobby(parseLobbyState(event));
                subscribeToLobbyTopic();
            } else {
                // Reconnect flow: no stored state, fire reconnect event and wait
                // for the backend to respond with current state.
                subscribeToQueue((event) => {
                    setLobby(parseLobbyState(event));
                    sessionStorage.removeItem('lobbyState');
                    subscribeToLobbyTopic();
                });

                setTimeout(() => {
                    sendMessage(`/app/lobby/${lobbyId}/events`, {
                        type: 'LOBBY_RECONNECT_REQUESTED',
                        playerId,
                        playerName: username,
                    });
                }, 0);
            }
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
        sendMessage(`/app/lobby/${lobbyId}/events`, {
            type: 'GAME_START_REQUESTED',
            playerId,
        });
    }

    function updateReadyState() {
        if (!lobby) return;
        sendMessage(`/app/lobby/${lobbyId}/events`, {
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
                <Button onClick={startGame} disabled={!lobby}>Start Game</Button>
            ) : (
                <Button onClick={updateReadyState} disabled={!lobby}>{isReady ? 'Set Not Ready' : 'Set Ready'}</Button>
            )}
        </div>
    );
}

type LobbyPlayersProps = {
    players?: Map<string, Player>;
};

function PlayersView({players}: LobbyPlayersProps) {
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