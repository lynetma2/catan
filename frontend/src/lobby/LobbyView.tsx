import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {useNavigate, useParams} from 'react-router';
import {v4 as uuidv4} from 'uuid';

import type {Lobby, Player} from '../datalayer/domain/lobby/Lobby';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useWebSocket} from '@/WebSocketContext';
import {useLobbyActions} from './useLobbyActions';
import type {StompSubscription} from '@stomp/stompjs';
import {type LobbyPlayerServerEvent, type LobbyServerEvent, LobbyServerEvents,} from '@/events/lobby/LobbyServerEvents';
import {assertNever} from '@/events/shared/EventTypes';
import {applyLobbyEvent} from '@/lobby/ApplyLobbyEvent.ts';

/**
 * Normalise a server-sent lobby snapshot (which uses `id` for both
 * the lobby and players) into the expected `Lobby` type.
 */
function normaliseSnapshot(raw: any): Lobby {
    // If the lobby object uses `id` instead of `lobbyId`, remap it.
    const lobby = {...raw};
    if (lobby.id && !lobby.lobbyId) {
        lobby.lobbyId = lobby.id;
        delete lobby.id;
    }

    // Remap each player from `id` → `playerId`
    if (lobby.players) {
        const fixedPlayers: Record<string, Player> = {};
        for (const [key, player] of Object.entries(lobby.players)) {
            const p = player as any;
            fixedPlayers[key] = {
                playerId: p.id ?? key,
                username: p.username,
                isLeader: p.isLeader ?? false,
                isReady: p.isReady ?? false,
            } as Player;
        }
        lobby.players = fixedPlayers;
    }

    return lobby as Lobby;
}

function LobbyView() {
    const navigate = useNavigate();
    const params = useParams();
    const {subscribe, onConnect} = useWebSocket();

    const lobbyId: string = params.lobbyId!;   // ← must be before the useState that uses it

    const [lobby, setLobby] = React.useState<Lobby | null>(() => {
        const saved = sessionStorage.getItem('lobbyState');
        if (!saved) return null;
        try {
            const payload = JSON.parse(saved);
            if (payload.lobbyId !== lobbyId) return null;

            // Normalise the snapshot so it matches the Lobby type
            return normaliseSnapshot(payload.snapshot);
        } catch {
            // corrupted data – ignore
        }
        return null;
    });

    const topicSubscription = useRef<StompSubscription | null>(null);

    const username: string = useMemo(
        () => localStorage.getItem('username') ?? '',
        [],
    );

    const playerId: string = useMemo(() => {
        const existing = sessionStorage.getItem('playerId');
        if (existing) return existing;
        const newId = uuidv4();
        sessionStorage.setItem('playerId', newId);
        return newId;
    }, []);

    const actions = useLobbyActions(lobbyId);
    const myPlayer = lobby?.players[playerId];
    const isLeader = myPlayer?.isLeader ?? false;
    const isReady = myPlayer?.isReady ?? false;

    function parseLobbyState(
        event: Extract<
            LobbyServerEvent,
            { type: typeof LobbyServerEvents.state.success }
        >,
    ): Lobby {
        // The incoming snapshot may also need normalisation,
        // so we can reuse the same helper.
        return normaliseSnapshot(event.payload.snapshot);
    }

    function subscribeToLobbyTopic() {
        if (topicSubscription.current) return;

        topicSubscription.current = subscribe(
            `/topic/lobby/${lobbyId}`,
            (response) => {
                const event: LobbyServerEvent = JSON.parse(response.body);
                console.log('received event:', event);

                const isPlayerEvent = (
                    e: LobbyServerEvent,
                ): e is LobbyPlayerServerEvent => {
                    const playerEventTypes = new Set<string>([
                        LobbyServerEvents.player.join.success,
                        LobbyServerEvents.player.ready.success,
                        LobbyServerEvents.player.unready.success,
                        LobbyServerEvents.player.disconnect.success,
                        LobbyServerEvents.player.reconnect.success,
                        LobbyServerEvents.player.reconnect.rejected,
                        LobbyServerEvents.player.join.rejected,
                    ]);
                    return playerEventTypes.has(e.type);
                };

                if (isPlayerEvent(event)) {
                    setLobby((prev) => (prev ? applyLobbyEvent(prev, event) : null));
                    return;
                }

                switch (event.type) {
                    case LobbyServerEvents.state.success:
                        setLobby(parseLobbyState(event));
                        break;
                    case LobbyServerEvents.initialized.success:
                        navigate(`/game/${lobbyId}`, { replace: true });
                        break;
                    case LobbyServerEvents.initialized.rejected:
                        console.error('Game initialization rejected:', event.payload.reason);
                        break;
                    case LobbyServerEvents.initialized.error:
                        console.error('Game initialization error:', event.payload.message);
                        break;
                    case LobbyServerEvents.start.rejected:
                        console.error('Game start rejected:', event.payload.reason);
                        break;
                    default:
                        assertNever(event);
                }
            },
        );
    }

    useEffect(() => {
        if (!username) {
            navigate(`/?lobbyId=${lobbyId}`);
            return;
        }

        const unregisterOnConnect = onConnect(() => {
            subscribeToLobbyTopic();
            // Only reconnect if we already have a lobby state;
            // otherwise the state.success event will be pushed by the server later.
            if (lobby) {
                actions.reconnectLobby(username);
            }
        });

        return () => {
            unregisterOnConnect();
            topicSubscription.current?.unsubscribe();
            topicSubscription.current = null;
        };
    }, []);

    function handleReadyToggle() {
        if (!lobby) return;
        if (isReady) actions.setUnready();
        else actions.setReady();
    }

    function handleStartGame() {
        if (!lobby) return;
        actions.startGame();
    }

    // If there is no lobby and we didn't get one from sessionStorage,
    // the user may have navigated directly. Show a helpful message.
    if (!lobby) {
        return (
            <div className="flex flex-col items-center gap-4 p-4">
                <p>Connecting to lobby…</p>
                <p className="text-sm text-muted-foreground">
                    If you arrived here directly, go back to the{' '}
                    <a href="/" className="underline">
                        home page
                    </a>{' '}
                    and join a lobby.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-sm text-muted-foreground">Lobby ID: {lobby.lobbyId}</p>
            <PlayersView players={lobby.players}/>
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
    players?: Record<string, Player>;
};

function PlayersView({ players }: LobbyPlayersProps) {
    const playerList = players ? Object.values(players) : [];
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
                            {player.isLeader ? '* ' + player.username : player.username}
                        </Label>
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