import {useEffect, useRef} from 'react'
import './App.css'
import {Game} from "@/game/core/Game.ts";
import {useParams} from "react-router";
import {useWebSocket} from "@/WebSocketContext.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<Game>(null);
    const ws = useWebSocket();
    const { gameId } = useParams<{ gameId: string }>();

    useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas || !gameId) {
                return;
            }
            gameLoopRef.current = new Game(canvas, ws, gameId);
            gameLoopRef.current.start();

            console.info("UseEffect ran");

            return () => {
                console.debug("return called");
                gameLoopRef.current?.destroy();
            };
        }, []
    )

    return (
        // Parent container with static size for now. Can be controlled via CSS later.
        <div style={{width: '1000px', height: '1000px'}}>
            <canvas
                tabIndex={0}
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
        </div>
    )
}

export default App
