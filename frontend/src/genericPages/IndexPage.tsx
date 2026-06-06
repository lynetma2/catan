import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router";
import {useWebSocket} from "@/WebSocketContext";
import type {LobbyServerEventMap} from "@/events/lobby/LobbyServerEvents";
// New event system
import {LobbyServerEvents} from "@/events/lobby/LobbyServerEvents";
import {LobbyActionEventCreators} from "@/events/lobby/LobbyActionEvents";

function IndexPage() {
    const navigate = useNavigate();
    const {sendMessage, subscribe, onConnect} = useWebSocket();

    const [username, setUsername] = useState<string>(() => localStorage.getItem("username") ?? "");
    const [lobbyId, setLobbyId] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("lobbyId") ?? "";
    });

    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const usernameJoinRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (lobbyId && !username) {
            usernameJoinRef.current?.focus();
        }
    }, []);

    function savePlayerId(playerId: string) {
        sessionStorage.setItem("playerId", playerId);
    }

    function saveUsername(value: string) {
        setUsername(value);
        localStorage.setItem("username", value);
    }

    function saveLobbyState(event: LobbyServerEventMap[typeof LobbyServerEvents.state.success]) {
        sessionStorage.setItem("lobbyState", JSON.stringify(event));
    }

    function newLobby() {
        if (!username || isCreating) return;

        setIsCreating(true);
        setError(null);

        onConnect(() => {
            const subscription = subscribe("/user/queue/lobby", (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === LobbyServerEvents.state.success) {
                        subscription.unsubscribe();
                        saveLobbyState(event.payload);
                        savePlayerId(event.payload.localPlayerId);
                        navigate(`/lobby/${event.payload.lobbyId}`);
                    } else if (event.type === LobbyServerEvents.player.join.rejected) {
                        subscription.unsubscribe();
                        setError("Lobby creation rejected");
                        setIsCreating(false);
                    } else if (event.type === LobbyServerEvents.initialized.error) {
                        subscription.unsubscribe();
                        setError("Lobby creation error");
                        setIsCreating(false);
                    }
                } catch (err) {
                    console.error("Error processing lobby creation response:", err);
                    subscription.unsubscribe();
                    setError("Unexpected error while creating lobby");
                    setIsCreating(false);
                }
            });

            sendMessage("/app/lobby", LobbyActionEventCreators.create(username));
        });
    }

    function joinLobby() {
        if (!lobbyId || !username || isJoining) return;

        setIsJoining(true);
        setError(null);

        onConnect(() => {
            const subscription = subscribe("/user/queue/lobby", (response) => {
                try {
                    const event = JSON.parse(response.body);

                    if (event.type === LobbyServerEvents.state.success) {
                        subscription.unsubscribe();
                        saveLobbyState(event.payload);
                        savePlayerId(event.payload.localPlayerId);
                        navigate(`/lobby/${event.payload.lobbyId}`);
                    } else if (event.type === LobbyServerEvents.player.join.rejected) {
                        subscription.unsubscribe();
                        const reason = event.payload.reason.toLowerCase();
                        const message = reason.includes("not found")
                            ? "Lobby not found"
                            : "Join request rejected";
                        setError(message);
                        setIsJoining(false);
                    } else if (event.type === LobbyServerEvents.initialized.error) {
                        subscription.unsubscribe();
                        setError("Lobby join error");
                        setIsJoining(false);
                    }
                } catch (err) {
                    console.error("Error processing lobby join response:", err);
                    subscription.unsubscribe();
                    setError("Unexpected error while joining lobby");
                    setIsJoining(false);
                }
            });

            sendMessage(`/app/lobby/${lobbyId}/events`, LobbyActionEventCreators.join(username));
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
                                disabled={isCreating}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={newLobby} disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Lobby"}
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
                            {isJoining ? "Joining..." : "Join Lobby"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {error && (
                <LobbyErrorView
                    error={error}
                    onDismiss={() => setError(null)}
                />
            )}
        </div>
    );
}

type LobbyErrorViewProps = {
    error: string;
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
                <Button variant="outline" onClick={onDismiss}>
                    Dismiss
                </Button>
            </CardContent>
        </Card>
    );
}

export default IndexPage;