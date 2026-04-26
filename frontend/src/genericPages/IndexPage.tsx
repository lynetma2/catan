import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from 'uuid';

function IndexPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [lobbyId, setLobbyId] = useState<string>("");

    function joinLobby() {
        if (!lobbyId) {
            console.error("No lobby id found");
            return;
        }
        if (!username) {
            console.error("No username found");
            return;
        }

        navigate(`/lobby/${lobbyId}`, {
            state: { username, playerId: uuidv4() }
        });
    }

    function newLobby() {
        if (!username) {
            console.error("No username found");
            return;
        }

        // No HTTP call needed — LobbyView handles creation via WebSocket
        navigate(`/lobby`, {
            state: { username, playerId: uuidv4() }
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
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={newLobby}>
                            Create Lobby
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
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-3 mt-1">
                            <Label>Username</Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <Button className="w-full mt-1" onClick={joinLobby}>
                            Join Lobby
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default IndexPage;