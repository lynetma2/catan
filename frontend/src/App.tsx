import {useEffect, useRef} from 'react'
import './App.css'
import {Hex} from "./hexagon/Hex.ts";
import {Layout} from "./hexagon/Layout.ts";
import {Point} from "./hexagon/Point.ts";
import {Terrain} from "./game/Terrain.ts";
import {Board} from "./game/Board.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
            const layout = new Layout(Layout.flat, new Point(50, 50), new Point(500, 500));

            //Example map
            let map = new Map<string, Terrain>();
            const N = 3;
            const kinds = ["LUMBER", "BRICK", "GRAIN", "WOOL", "ORE", "DESERT"]
            for (let q = -N; q <= N; q++) {
                const r1 = Math.max(-N, -q - N)
                const r2 = Math.min(N, -q + N)
                for (let r = r1; r <= r2; r++) {
                    const t = new Terrain(new Hex(q, r, -q - r), kinds[Math.floor(Math.random() * kinds.length)])
                    map.set(`q${q}r${r}s${-q-r}`, t)
                }
            }
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }

            const board = new Board(map, layout, canvas);
            let currentSelection: Terrain | undefined = undefined;
            board.draw()

            canvas.addEventListener("mousemove", e => {
                 const h = layout.pixelToHexRounded(new Point(e.x, e.y));
                 const selection = map.get(`q${h.q}r${h.r}s${h.s}`);
                 if (selection && selection != currentSelection) {
                     selection.kind = "SELECTED";
                     if (currentSelection) {
                         currentSelection.kind = kinds[Math.floor(Math.random() * kinds.length)];
                     }
                 }
                 currentSelection = selection;
                 board.draw();
            });

            console.log("UseEffect ran")
        }
    )

    function drawHexagon(b: Hex, layout: Layout) {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext("2d");
        ctx?.beginPath()
        const polygon = layout.polygonCorners(b);
        ctx?.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            ctx?.lineTo(polygon[i].x, polygon[i].y);
        }
        ctx?.lineTo(polygon[0].x, polygon[0].y);
        ctx?.stroke();
    }

    return (
        <>
            <canvas ref={canvasRef} width="1000" height="1000"></canvas>
        </>
    )
}

export default App
