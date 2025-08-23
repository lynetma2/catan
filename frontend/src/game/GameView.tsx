// @flow
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useRef} from "react";
import {useWebSocket} from "@/WebSocketProvider.tsx";
import type {StompSubscription} from "@stomp/stompjs";
import {Game} from "@/game/core/Game.ts";
import {Layout} from "@/game/hexagon/Layout.ts";
import {Point} from "@/game/hexagon/Point.ts";
import {Button} from "@/components/ui/button.tsx";

function GameView() {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { isConnected, sendMessage, subscribe } = useWebSocket();
    const gameSubscription = useRef<StompSubscription>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game>(null);
    const layout = new Layout(Layout.flat, new Point(50, 50), new Point(500, 500), 10, 10, 5);

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
                if (!canvasRef.current) {
                    console.error("An unexpected error happened with the canvas");
                    return;
                }
                console.log("response: ", JSON.parse(response.body));
                const game = Game.fromJSON(response, layout, canvasRef.current, username);
                gameRef.current = game;
                gameRef.current.draw();
                //gameRef.current.addEventListeners();

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