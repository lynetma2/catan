// @flow
import * as React from 'react';
import {useParams} from "react-router";
import {useEffect, useRef} from "react";
import {LobbySocket} from "./LobbySocket.ts";

function LobbyView() {

    const params = useParams();
    const lobbyServerRef = useRef<LobbySocket>(null);

    useEffect(() => {
        lobbyServerRef.current = new LobbySocket();

        if (!params.lobbyId) {
            console.error("LobbyView no lobbyId found");
            return;
        }
        const lobbyId = parseInt(params.lobbyId);
        lobbyServerRef.current.init(lobbyId, (newLobby) => {
            console.log("Got new lobby");
            console.log(newLobby);
        });
    })

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
        </div>
    );
};


type LobbyPlayersProps = {

};

function Players(props: LobbyPlayersProps) {

}

type LobbyChatProps = {

};

function Chat(props: LobbyChatProps) {

}

export default LobbyView;