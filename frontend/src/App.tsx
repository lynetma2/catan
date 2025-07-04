import {useEffect, useRef} from 'react'
import './App.css'
import {Hex} from "./hexagon/Hex.ts";
import {Layout} from "./hexagon/Layout.ts";
import {Point} from "./hexagon/Point.ts";
import {Terrain} from "./game/Terrain.ts";
import {Board} from "./game/Board.ts";
import {Road} from "./game/Road.ts";
import {Building} from "./game/Building.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
            const layout = new Layout(Layout.flat, new Point(50, 50), new Point(500, 500), 10, 10, 5);

            //Example map
            const map = new Map<string, Terrain>();
            const N = 3;
            const kinds = ["LUMBER", "BRICK", "GRAIN", "WOOL", "ORE", "DESERT"]
            for (let q = -N; q <= N; q++) {
                const r1 = Math.max(-N, -q - N)
                const r2 = Math.min(N, -q + N)
                for (let r = r1; r <= r2; r++) {
                    const t = new Terrain(new Hex(q, r, -q - r), kinds[Math.floor(Math.random() * kinds.length)])
                    map.set(`q${q}r${r}s${-q - r}`, t)
                }
            }
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }

            const board = new Board(map, new Map<string, Road>(), new Map<string, Building>, layout, canvas);
            //let currentSelection: Terrain | undefined = undefined;
            board.draw()

            // canvas.addEventListener("mousemove", e => {
            //     console.log(e);
            //     const h = layout.pixelToHexRounded(new Point(getMousePos(canvas, e).x, getMousePos(canvas, e).y));
            //     const selection = map.get(`q${h.q}r${h.r}s${h.s}`);
            //     if (selection && selection != currentSelection) {
            //         selection.kind = "SELECTED";
            //         if (currentSelection) {
            //             currentSelection.kind = kinds[Math.floor(Math.random() * kinds.length)];
            //         }
            //     }
            //     currentSelection = selection;
            //     board.draw();
            // });

            // canvas.addEventListener("mousemove", e => {
            //     const edge = layout.pixelToEdgeRounded(new Point(getMousePos(canvas, e).x, getMousePos(canvas, e).y));
            //     console.log(edge);
            //     if (edge && !board.roads.has(`q${edge.q}r${edge.r}d${edge.direction}`)) {
            //         board.roads.clear()
            //         board.roads.set(`q${edge.q}r${edge.r}d${edge.direction}`, new Road(edge, 0))
            //         board.draw();
            //     }
            // });

            canvas.addEventListener("mousemove", e => {
                const vertex = layout.pixelToVertixRounded(new Point(getMousePos(canvas, e).x, getMousePos(canvas, e).y));
                    if (vertex && !board.roads.has(`q${vertex.q}r${vertex.r}d${vertex.direction}`)) {
                        board.buildings.clear()
                        board.buildings.set(`q${vertex.q}r${vertex.r}d${vertex.direction}`, new Building(vertex, 0, Building.CITY))
                        board.draw();
                    }
            })

            console.log("UseEffect ran")
        }
    )

    function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    return (
        <>
            <canvas ref={canvasRef} width="1000" height="1000"></canvas>
        </>
    )
}

export default App
