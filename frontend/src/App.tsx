import {useEffect, useRef} from 'react'
import './App.css'
import {GameLoop} from "@/game/catan.ts";

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

            console.log("UseEffect ran")


            return () => {
                console.log("return called ");
                gameLoopRef.current?.stop();
            };
        }, []
    )

    return (
        <>
            <canvas ref={canvasRef} width="1000" height="1000"></canvas>
        </>
    )
}

export default App
