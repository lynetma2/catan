import {useEffect, useRef} from 'react'
import './App.css'
import {GameLoop} from "@/game/core/GameLoop.ts";
import {Logger} from "@/game/utils/Logger.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<GameLoop>(null);

    useEffect(() => {

            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            gameLoopRef.current = new GameLoop(canvas);
            gameLoopRef.current.start();

            Logger.info("UseEffect ran");

            return () => {
                Logger.debug("return called");
                gameLoopRef.current?.stop();
            };
        }, []
    )

    return (
        // Parent container with static size for now. Can be controlled via CSS later.
        <div style={{width: '1000px', height: '1000px'}}>
            <canvas ref={canvasRef} style={{display: 'block'}} />
        </div>
    )
}

export default App
