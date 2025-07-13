// @flow
import * as React from 'react';
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useRef} from "react";
import {Lobby, type LobbyEvent, type Player} from "@/lobby/Lobby.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useWebSocket} from "@/WebSocketProvider.tsx";
import type {StompSubscription} from "@stomp/stompjs";

function LobbyView() {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { isConnected, sendMessage, subscribe } = useWebSocket();
    const lobbySubscription = useRef<StompSubscription>(null);
    const [lobby, setLobby] = React.useState<Lobby | null>(null);

    const username : string = location.state && location.state.username ? location.state.username : "";
    const lobbyId = params.lobbyId ? parseInt(params.lobbyId) : undefined;
    const isLeader = location.state && location.state.username ? lobby?.players.get(location.state.username)?.isLeader : false;
    const isReady = location.state && location.state.username ? lobby?.players.get(location.state.username)?.isReady : false;

    useEffect(() => {
        if (!username) {
            console.error("No username found");
            navigate(`/`);
            return;
        }
        if (!lobbyId) {
            console.error("LobbyView no lobbyId found");
            return;
        }
        if (!isConnected) {
            console.error("WebSocket not connected");
            return;
        }

        if (!lobbySubscription.current) {
            lobbySubscription.current = subscribe(`/lobby/status/${lobbyId}`, (response) => {
                const lobby = JSON.parse(response.body);
                if (!lobby.players) {
                    //Some error happened
                    console.error("Wrongly formatted lobby from the server!");
                    return;
                }

                //TODO check that it is actually a map (JSON does natively handle maps)
                const newLobby = Lobby.fromJSON(lobby);
                setLobby(newLobby);
            });
            sendMessage(`/lobby/join/${lobbyId}`, {'playerName': username})
        }

        return () => {
            if (lobbySubscription.current) {
                lobbySubscription.current.unsubscribe();
                lobbySubscription.current = null;
            }
        };
    }, [isConnected]);

    function startGame() {
        if (!isConnected) {
            console.error("WebSocket not connected");
            return;
        }

        const event: LobbyEvent = {
            kind: "STARTGAME",
            playerName: location.state.username,
        }
        sendMessage(`/lobby/event/${lobbyId}`, event);
    }

    function updateReadyState() {
        if (!isConnected) {
            console.error("WebSocket not connected");
            return;
        }

        const event: LobbyEvent = {
            kind: isReady ? "SETNOTREADY" : "SETREADY",
            playerName: location.state.username,
        }
        sendMessage(`/lobby/event/${lobbyId}`, event);
    }

    //Needed stuff brainstorming
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