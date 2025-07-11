import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import  {useState} from 'react';
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {LobbySocket} from "@/lobby/LobbySocket.ts";
import {Loader2} from "lucide-react";
import {useNavigate} from "react-router";
import {Lobby} from "@/lobby/Lobby.ts";

function IndexPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [lobbyId, setLobbyId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    function joinLobby() {
        //TODO add the functionality to join a lobby
        if (lobbyId == 0) {
            console.error("No lobby id found");
        }
        if (username == "") {
            console.error("No username found");
        }

        //Ready to join lobby -> should go directly to the correct page, using react router.
        navigate(`/lobby/${lobbyId}`, {state: {username: username}});
    }

    function newLobby() {
        //TODO add the functionality to create a lobby
        if (username == "") {
            console.error("No username found");
        }

        setLoading(true);
        LobbySocket.newLobby(username).then((response) => {
            const lobbyId = response.id;
            const lobby = Lobby.fromJSON(response.lobby)
            setLoading(false);
            //Ready to move to next page.
            navigate(`/lobby/${lobbyId}`, {state: {lobby: lobby, username: username}});
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
                            <Input id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <Button className="w-full mt-1" disabled={loading} onClick={newLobby}>{loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : "Create Lobby"}</Button>
                    </CardContent>
                </Card>

                <Card className="w-1/3 min-w-2xs">
                    <CardHeader>
                        <CardTitle>Join Lobby for a game</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label>Lobby Id</Label>
                            <Input type="number" id="lobbyId" placeholder="Lobby Id" value={lobbyId} onChange={e => setLobbyId(parseInt(e.target.value))}/>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-3 mt-1">
                            <Label>Username</Label>
                            <Input id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <Button className="w-full mt-1" onClick={joinLobby}>Join Lobby</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default IndexPage;