// @flow
import * as React from 'react';
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useRef} from "react";
import {LobbySocket} from "./LobbySocket.ts";
import type {Lobby, LobbyEvent, Player} from "@/lobby/Lobby.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";

function LobbyView() {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const lobbyServerRef = useRef<LobbySocket>(null);
    const initLobby = !location.state || !location.state.lobby ? null : location.state.lobby;
    const [lobby, setLobby] = React.useState<Lobby | null>(initLobby);

    const isLeader = location.state && location.state.username ? lobby?.players.get(location.state.username)?.isLeader : false;
    const isReady = location.state && location.state.username ? lobby?.players.get(location.state.username)?.isReady : false;


    useEffect(() => {
        if (!location.state || !location.state.username) {
            console.error("No username found");
            navigate(`/`);
            return;
        }
        const username = location.state.username;
        if (!params.lobbyId) {
            console.error("LobbyView no lobbyId found");
            return;
        }

        if (!lobbyServerRef.current) {
            lobbyServerRef.current = new LobbySocket();
            const lobbyId = parseInt(params.lobbyId);
            lobbyServerRef.current.init(lobbyId, (newLobby) => {
                console.log("Got new lobby");
                console.log(newLobby);
                setLobby(newLobby);
            }).then(
                () => {
                    if (!lobbyServerRef.current) {
                        console.error("lobbyServer not found");
                        return;
                    }

                    if (!lobby) {
                        lobbyServerRef.current.joinLobby(username, lobbyId);
                    }

                    //Should Join the lobby instead.
                }
            );
        }
        //TODO somehow get the username of the current user.

        return () => {
        }
    }, [lobby, location.state, navigate, params.lobbyId]);

    function startGame() {
        if (!lobbyServerRef.current) {
            console.error("LobbyServerRef is not available");
            return;
        }

        const event: LobbyEvent = {
            kind: "STARTGAME",
            playerName: location.state.username,
        }
        lobbyServerRef.current.sendEvent(event);
    }

    function updateReadyState() {
        if (!lobbyServerRef.current) {
            console.error("LobbyServerRef is not available");
            return;
        }

        const event: LobbyEvent = {
            kind: isReady ? "SETNOTREADY" : "SETREADY",
            playerName: location.state.username,
        }
        lobbyServerRef.current.sendEvent(event)
    }

    //Needed stuff brainstorming
    //lobbysocket
    //LobbyId
    //Current User (name atleast)
    //Lobby State object. (The one triggering rerenders)
    //Chat state object. (Also able to trigger rerender)
    //Settings state object. (Going to be added later on)

    return (
        <div>
            {params.lobbyId ? <p>LobbyId is {params.lobbyId}</p> : <p>No lobbyId found</p>}
            < PlayersView players={lobby?.players}/>
            {
                isLeader ?
                    <Button onClick={startGame}>Start Game</Button>
                    :
                    <Button onClick={updateReadyState}>{isReady ? "Set Not Ready" : "Set Ready"}</Button>
            }
        </div>
    );
};


type LobbyPlayersProps = {
    players?: Map<string, Player>
};

function PlayersView(props: LobbyPlayersProps) {

    console.log("props", props);
    const players = props.players ? [...props.players.values()] : [];
    console.log("players from playersView: ", players);

    return (
        <Card className="w-1/3 min-w-2xs">
            <CardHeader>
                <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
                {players.map((player) => {
                    console.log("player.isReady: ", player.isReady);
                    console.log(player.isReady ? "kage" : "ost");
                    return (
                        <div className="flex flex-row w-full max-w-sm justify-between gap-3">
                            <Label>{player.isLeader ? "* " + player.username : player.username}</Label>
                            {player.isReady ? <Label className="text-green-500">Ready</Label> :
                                <Label>Not Ready</Label>}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

type LobbyChatProps = {};

function Chat(props: LobbyChatProps) {

}

export default LobbyView;