import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from '@/WebSocketContext';

function IndexPage() {
    const navigate = useNavigate();
    const { sendMessage, subscribe, onConnect } = useWebSocket();
    const [username, setUsername] = useState<string>(() => localStorage.getItem('username') ?? '');
    const [lobbyId, setLobbyId] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('lobbyId') ?? '';
    });
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);

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

    function joinLobby() {
        if (!lobbyId || !username || isJoining) return;

        const playerId = getOrCreatePlayerId();
        setIsJoining(true);

        onConnect(() => {
            const subscription = subscribe('/user/queue/lobby', (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === 'LOBBY_STATE') {
                        subscription.unsubscribe();
                        saveLobbyState(event);
                        navigate(`/lobby/${event.lobbyId}`);
                    } else if (event.type === 'LOBBY_JOIN_REJECTED' || event.type === 'LOBBY_NOT_FOUND') {
                        console.error('Lobby join failed:', event.reason);
                        subscription.unsubscribe();
                        setIsJoining(false);
                    }
                } catch (error) {
                    console.error('Error processing lobby join response:', error);
                    subscription.unsubscribe();
                    setIsJoining(false);
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

    function newLobby() {
        if (!username || isCreating) return;

        const playerId = getOrCreatePlayerId();
        setIsCreating(true);

        onConnect(() => {
            const subscription = subscribe('/user/queue/lobby', (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === 'LOBBY_STATE') {
                        subscription.unsubscribe();
                        saveLobbyState(event);
                        navigate(`/lobby/${event.lobbyId}`);
                    } else if (event.type === 'LOBBY_JOIN_REJECTED' || event.type === 'LOBBY_NOT_FOUND') {
                        console.error('Lobby creation failed:', event.reason);
                        subscription.unsubscribe();
                        setIsCreating(false);
                    }
                } catch (error) {
                    console.error('Error processing lobby creation response:', error);
                    subscription.unsubscribe();
                    setIsCreating(false);
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

    return (
        <div>
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
                                disabled={isCreating}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={newLobby} disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create Lobby'}
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
                                disabled={isJoining}
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
                                disabled={isJoining}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={joinLobby} disabled={isJoining}>
                            {isJoining ? 'Joining...' : 'Join Lobby'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default IndexPage;