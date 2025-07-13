// @flow
import * as React from 'react';
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useRef} from "react";
import {useWebSocket} from "@/WebSocketProvider.tsx";
import type {StompSubscription} from "@stomp/stompjs";
import type {Game} from "@/game/entity/Game.ts";

function GameView() {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { isConnected, sendMessage, subscribe } = useWebSocket();
    const gameSubscription = useRef<StompSubscription>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game>(null);

    const username : string = location.state && location.state.username ? location.state.username : "";
    const gameId = params.gameId ? parseInt(params.gameId) : undefined;

    useEffect(() => {
        if (!username) {
            console.error("No username found");
            navigate(`/`);
            return;
        }
        if (!gameId) {
            console.error("LobbyView no lobbyId found");
            return;
        }
        if (!isConnected) {
            console.error("WebSocket not connected");
            return;
        }

        if (!gameSubscription.current) {
            gameSubscription.current = subscribe(`/game/fullStatus/${gameId}`, (response) => {
                const game = JSON.parse(response.body);
                gameRef.current = game;

                //For now just trying drawing the game
                //TODO make sure the Game object is the same in the backend and in the frontend.

                console.log("game: ", game);
            });

            //Get game to ensure that the state is getting sync'ed
            sendMessage(`/game/get/${gameId}`, {'playerName': username});
        }

        return () => {
            if (gameSubscription.current) {
                gameSubscription.current.unsubscribe();
                gameSubscription.current = null;
            }
        };
    }, [isConnected]);

    return (
        <div>
            <p>Game is under development...</p>
            <canvas ref={canvasRef} width="1000" height="1000"></canvas>
        </div>
    );
};

export default GameView;