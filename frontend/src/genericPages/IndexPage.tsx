import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useReducer, useRef, useState} from 'react';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import {Button} from '@/components/ui/button.tsx';
import {useNavigate} from 'react-router';
import {v4 as uuidv4} from 'uuid';
import {useWebSocket} from '@/WebSocketContext';
import {LobbyError} from '@/lobby/LobbyErrors';
import {initialLobbyIndexState, lobbyIndexReducer} from '@/lobby/LobbyIndexReducer';

function IndexPage() {
    const navigate = useNavigate();
    const {sendMessage, subscribe, onConnect} = useWebSocket();
    const [state, dispatch] = useReducer(lobbyIndexReducer, initialLobbyIndexState);
    const [username, setUsername] = useState<string>(() => localStorage.getItem('username') ?? '');
    const [lobbyId, setLobbyId] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('lobbyId') ?? '';
    });

    const usernameJoinRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (lobbyId && !username) {
            usernameJoinRef.current?.focus();
        }
    }, []);

    function getOrCreatePlayerId(): string {
        const existing = sessionStorage.getItem('playerId');
        if (existing) return existing;
        const newId = uuidv4();
        sessionStorage.setItem('playerId', newId);
        return newId;
    }

    function saveUsername(value: string) {
        setUsername(value);
        localStorage.setItem('username', value);
    }

    function saveLobbyState(event: object) {
        sessionStorage.setItem('lobbyState', JSON.stringify(event));
    }

    function newLobby() {
        if (!username || state.isCreating) return;

        const playerId = getOrCreatePlayerId();
        dispatch({type: 'CREATE_STARTED'});

        onConnect(() => {
            const subscription = subscribe('/user/queue/lobby', (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === 'LOBBY_STATE') {
                        subscription.unsubscribe();
                        saveLobbyState(event);
                        navigate(`/lobby/${event.lobbyId}`);
                    } else if (event.type === 'LOBBY_JOIN_REJECTED') {
                        subscription.unsubscribe();
                        dispatch({type: 'CREATE_FAILED', error: LobbyError.LOBBY_CREATE_REJECTED});
                    } else if (event.type === 'LOBBY_NOT_FOUND') {
                        subscription.unsubscribe();
                        dispatch({type: 'CREATE_FAILED', error: LobbyError.LOBBY_CREATE_REJECTED});
                    }
                } catch (error) {
                    console.error('Error processing lobby creation response:', error);
                    subscription.unsubscribe();
                    dispatch({type: 'CREATE_FAILED', error: LobbyError.LOBBY_CREATE_REJECTED});
                }
            });

            setTimeout(() => {
                sendMessage('/app/lobby', {
                    type: 'LOBBY_CREATE_REQUESTED',
                    playerId,
                    playerName: username,
                });
            }, 0);
        });
    }

    function joinLobby() {
        if (!lobbyId || !username || state.isJoining) return;

        const playerId = getOrCreatePlayerId();
        dispatch({type: 'JOIN_STARTED'});

        onConnect(() => {
            const subscription = subscribe('/user/queue/lobby', (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === 'LOBBY_STATE') {
                        subscription.unsubscribe();
                        saveLobbyState(event);
                        navigate(`/lobby/${event.lobbyId}`);
                    } else if (event.type === 'LOBBY_JOIN_REJECTED') {
                        subscription.unsubscribe();
                        dispatch({type: 'JOIN_FAILED', error: LobbyError.LOBBY_JOIN_REJECTED});
                    } else if (event.type === 'LOBBY_NOT_FOUND') {
                        subscription.unsubscribe();
                        dispatch({type: 'JOIN_FAILED', error: LobbyError.LOBBY_NOT_FOUND});
                    }
                } catch (error) {
                    console.error('Error processing lobby join response:', error);
                    subscription.unsubscribe();
                    dispatch({type: 'JOIN_FAILED', error: LobbyError.LOBBY_JOIN_REJECTED});
                }
            });

            setTimeout(() => {
                sendMessage(`/app/lobby/${lobbyId}/events`, {
                    type: 'LOBBY_JOIN_REQUESTED',
                    playerId,
                    playerName: username,
                });
            }, 0);
        });
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <p>Welcome to my implementation of the classic Board Game SoC. This is purely for learning purposes.</p>
            <div className="flex flex-row flex-auto gap-2 justify-center">
                <Card className="w-1/3 min-w-2xs">
                    <CardHeader>
                        <CardTitle>Create new Lobby for a game</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label>Username</Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => saveUsername(e.target.value)}
                                disabled={state.isCreating}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={newLobby} disabled={state.isCreating}>
                            {state.isCreating ? 'Creating...' : 'Create Lobby'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="w-1/3 min-w-2xs">
                    <CardHeader>
                        <CardTitle>Join Lobby for a game</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label>Lobby Id</Label>
                            <Input
                                id="lobbyId"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={lobbyId}
                                onChange={(e) => setLobbyId(e.target.value)}
                                disabled={state.isJoining}
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-3 mt-1">
                            <Label>Username</Label>
                            <Input
                                ref={usernameJoinRef}
                                id="username-join"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => saveUsername(e.target.value)}
                                disabled={state.isJoining}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={joinLobby} disabled={state.isJoining}>
                            {state.isJoining ? 'Joining...' : 'Join Lobby'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {state.error && (
                <LobbyErrorView
                    error={state.error}
                    onDismiss={() => dispatch({type: 'ERROR_DISMISSED'})}
                />
            )}
        </div>
    );
}

type LobbyErrorViewProps = {
    error: LobbyError;
    onDismiss: () => void;
};

function LobbyErrorView({error, onDismiss}: LobbyErrorViewProps) {
    return (
        <Card className="w-1/3 min-w-2xs border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <p className="text-sm">{error}</p>
                <Button variant="outline" onClick={onDismiss}>Dismiss</Button>
            </CardContent>
        </Card>
    );
}

export default IndexPage;