import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useWebSocket} from "@/WebSocketContext";
import {LobbyServerEvents} from "@/events/lobby/LobbyServerEvents";
import {LobbyActionEventCreators} from "@/events/lobby/LobbyActionEvents";

type GameStats = {
    activeGames: number;
    archivedGames: number;
};

function IndexPage() {
    const navigate = useNavigate();
    const {sendMessage, subscribe, onConnect} = useWebSocket();

    const [username, setUsername] = useState<string>(() => localStorage.getItem("username") ?? "");
    const [lobbyId, setLobbyId] = useState<string>(() =>
        new URLSearchParams(window.location.search).get("lobbyId") ?? ""
    );

    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<GameStats | null>(null);

    const usernameJoinRef = useRef<HTMLInputElement>(null);
    // Ref to hold the global subscription so we can clean it up on unmount
    const lobbySubscription = useRef<any>(null);

    // 1. Fetch global game stats on mount
    useEffect(() => {
        fetch('/api/games/stats')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setStats(data))
            .catch(() => console.warn("Could not load game stats"));
    }, []);

    // 2. Auto-focus username if joining via link without a saved username
    useEffect(() => {
        if (lobbyId && !username) {
            usernameJoinRef.current?.focus();
        }
    }, [lobbyId, username]);

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        localStorage.setItem("username", value);
    };

    // 3. Centralized Event Router for all directed lobby messages
    const handleLobbyEvent = useCallback((event: any) => {
        if (event.type === LobbyServerEvents.state.success) {
            sessionStorage.setItem("lobbyState", JSON.stringify(event.payload));
            sessionStorage.setItem("playerId", event.payload.localPlayerId);
            navigate(`/lobby/${event.payload.lobbyId}`);
            setIsCreating(false);
            setIsJoining(false);
        } else if (event.type === LobbyServerEvents.player.join.rejected) {
            const reason = event.payload?.reason?.toLowerCase() ?? "";
            setError(reason.includes("not found") ? "Lobby not found" : "Join request rejected");
            setIsCreating(false);
            setIsJoining(false);
        } else if (event.type === LobbyServerEvents.initialized.error) {
            setError("Lobby initialization error");
            setIsCreating(false);
            setIsJoining(false);
        }
    }, [navigate]);

    // 4. GLOBAL SUBSCRIPTION: Subscribe ONCE when component mounts and WebSocket connects.
    // This entirely eliminates the race condition where the server replies before the subscription is registered.
    useEffect(() => {
        const unregister = onConnect(() => {
            if (!lobbySubscription.current) {
                lobbySubscription.current = subscribe("/user/queue/lobby", (response) => {
                    try {
                        const event = JSON.parse(response.body);
                        handleLobbyEvent(event);
                    } catch (err) {
                        console.error("Error parsing lobby event", err);
                    }
                });
            }
        });

        return () => {
            unregister();
            lobbySubscription.current?.unsubscribe();
            lobbySubscription.current = null;
        };
    }, [onConnect, subscribe, handleLobbyEvent]);

    // 5. Simplified Button Handlers (No more subscribing inside clicks!)
    const createLobby = () => {
        if (!username || isCreating) return;
        setIsCreating(true);
        setError(null);
        sendMessage("/app/lobby", LobbyActionEventCreators.create(username));
    };

    const joinLobby = () => {
        if (!lobbyId || !username || isJoining) return;
        setIsJoining(true);
        setError(null);
        sendMessage(`/app/lobby/${lobbyId}/events`, LobbyActionEventCreators.join(username));
    };

    return (
        <div className="flex flex-col items-center min-h-screen pb-12">
            {/* 🌟 HERO SECTION */}
            <div className="relative flex flex-col items-center text-center space-y-8 py-16 px-4 w-full">
                {/* Ambient background glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full -z-10"/>

                <div className="space-y-4 max-w-3xl">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border text-xs font-medium text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Open Source & Learning Project
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                        Welcome to{" "}
                        <span
                            className="bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            HEXA
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                        A modern, web-based implementation of the classic board game{" "}
                        <span className="font-semibold text-foreground">Settlers of Catan</span>.
                    </p>
                </div>

                {/* 🌟 GLASSMORPHISM STATS BADGE */}
                {stats && (
                    <div
                        className="flex flex-wrap justify-center gap-6 py-3 px-6 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm text-sm">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-muted-foreground">Active Games:</span>
                            <span className="font-bold text-foreground tabular-nums">{stats.activeGames}</span>
                        </div>
                        <div className="w-px h-5 bg-border"/>
                        {/* Vertical Divider */}
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground">Archived Games:</span>
                            <span className="font-bold text-foreground tabular-nums">{stats.archivedGames}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 🌟 ACTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 mt-4">
                <Card className="w-full transition-all hover:shadow-lg hover:border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create Lobby</CardTitle>
                        <p className="text-sm text-muted-foreground">Start a new game and invite your friends.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username-create">Username</Label>
                            <Input
                                id="username-create"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                disabled={isCreating}
                            />
                        </div>
                        <Button className="w-full text-base py-6" onClick={createLobby}
                                disabled={isCreating || !username}>
                            {isCreating ? "Creating..." : "Create Lobby"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="w-full transition-all hover:shadow-lg hover:border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-2xl">Join Lobby</CardTitle>
                        <p className="text-sm text-muted-foreground">Enter an existing game with a Lobby ID.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lobbyId">Lobby ID</Label>
                            <Input
                                id="lobbyId"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={lobbyId}
                                onChange={(e) => setLobbyId(e.target.value)}
                                disabled={isJoining}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username-join">Username</Label>
                            <Input
                                ref={usernameJoinRef}
                                id="username-join"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                disabled={isJoining}
                            />
                        </div>
                        <Button className="w-full text-base py-6" variant="secondary" onClick={joinLobby}
                                disabled={isJoining || !username || !lobbyId}>
                            {isJoining ? "Joining..." : "Join Lobby"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 🌟 ERROR BANNER */}
            {error && (
                <div className="w-full max-w-4xl px-4 mt-6">
                    <LobbyErrorView error={error} onDismiss={() => setError(null)}/>
                </div>
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
        <Card className="w-full border-destructive/50 bg-destructive/5">
            <CardContent className="flex flex-row items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-destructive"/>
                    <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onDismiss}
                        className="text-destructive hover:bg-destructive/10">
                    Dismiss
                </Button>
            </CardContent>
        </Card>
    );
}

export default IndexPage;