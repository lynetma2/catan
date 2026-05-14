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
import {useLobbyActions} from './useLobbyActions';
import type {StompSubscription} from '@stomp/stompjs';

function LobbyView() {
    const navigate = useNavigate();
    const params = useParams();
    const {subscribe, onConnect} = useWebSocket();

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

    const actions = useLobbyActions(lobbyId);

    const myPlayer = lobby?.players.get(playerId);
    const isLeader = myPlayer?.isLeader ?? false;
    const isReady = myPlayer?.isReady ?? false;

    function parseLobbyState(event: any): Lobby {
        const rawPlayers = event.snapshot.players;

        const entries = Object.values(rawPlayers).map((p: any) : [string, Player] => [
            p.id,
            {
                playerId: p.id,
                username: p.username,
                isReady: p.isReady,
                isLeader: p.isLeader,
            }
        ]);

        return {
            lobbyId: event.lobbyId,
            players: new Map<string, Player>(entries),
        };
    }

    function subscribeToLobbyTopic() {
        if (topicSubscription.current) return;
        topicSubscription.current = subscribe(`/topic/lobby/${lobbyId}`, (response) => {
            const event: OutboundLobbyEvent = JSON.parse(response.body);
            console.log('recieved event: ', event);
            handleLobbyEvent(event, {
                PLAYER_JOINED_LOBBY: (e) => {
                    setLobby(prev => {
                        if (!prev) return null; // Guard clause: ignore events if lobby isn't initialized
                        let result = applyLobbyEvent(prev, e);
                        console.log('new state: ', result)
                        return result;
                    });                },
                PLAYER_READY: (e) => {
                    setLobby(prev => {
                        if (!prev) return null; // Guard clause: ignore events if lobby isn't initialized
                        let result = applyLobbyEvent(prev, e);
                        console.log('new state: ', result)
                        return result;
                    });
                },
                PLAYER_UNREADY: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                PLAYER_DISCONNECTED: (e) => {
                    setLobby(prev => prev ? applyLobbyEvent(prev, e) : prev);
                },
                GAME_INITIALIZED: (e) => {
                    navigate(`/game/${lobbyId}`, {
                        replace: true
                    });
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
                const event = JSON.parse(storedState);
                sessionStorage.removeItem('lobbyState');
                setLobby(parseLobbyState(event));
                subscribeToLobbyTopic();
            } else {
                subscribeToQueue((event) => {
                    setLobby(parseLobbyState(event));
                    sessionStorage.removeItem('lobbyState');
                    subscribeToLobbyTopic();
                });

                setTimeout(() => {
                    actions.reconnectLobby(username);
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

    function handleReadyToggle() {
        if (!lobby) return;
        isReady ? actions.setUnready() : actions.setReady();
    }

    function handleStartGame() {
        if (!lobby) return;
        actions.startGame();
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
                <Button onClick={handleStartGame} disabled={!lobby}>Start Game</Button>
            ) : (
                <Button onClick={handleReadyToggle} disabled={!lobby}>{isReady ? 'Set Not Ready' : 'Set Ready'}</Button>
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