import {useEffect, useRef} from 'react'
import './App.css'
import {Game} from "@/game/core/Game.ts";
import {useLocation} from "react-router";
import type {GameSnapshot} from "@/game/core/types.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<Game>(null);
    const location = useLocation();
    const snapshot: GameSnapshot | null = location.state?.snapshot ?? null;


    useEffect(() => {

            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            gameLoopRef.current = new Game(canvas);
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
