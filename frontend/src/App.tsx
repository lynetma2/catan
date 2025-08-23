import {useEffect, useRef} from 'react'
import './App.css'
import {Hex} from "./game/hexagon/Hex.ts";
import {Layout} from "./game/hexagon/Layout.ts";
import {Point} from "./game/hexagon/Point.ts";
import {Terrain} from "./game/entity/Terrain.ts";
import {Board} from "./game/entity/Board.ts";
import {Road} from "./game/entity/Road.ts";
import {Building} from "./game/entity/Building.ts";
import {GameServerSocket} from "./game/GameServerSocket.ts";
import {Game, InputState} from "./game/core/Game.ts";
import {LobbySocket} from "./lobby/LobbySocket.ts";
import {Player} from "@/game/entity/Player.ts";
import {DevelopmentCard} from "@/game/entity/DevelopmentCard.ts";
import {Vertex} from "@/game/hexagon/Vertex.ts";
import {Edge} from "@/game/hexagon/Edge.ts";
import {InteractionManager} from "@/game/input/InteractionManager.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {GameEvents} from "@/game/core/types.ts";

function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameServerRef = useRef<GameServerSocket>(null);
    const lobbyServerRef = useRef<LobbySocket>(null);

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
                    const t = new Terrain(new Hex(q, r, -q - r), kinds[Math.floor(Math.random() * kinds.length)], Math.floor(Math.random() * 13));
                    map.set(`q${q}r${r}s${-q - r}`, t)
                }
            }
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }
            const buildingMap = new Map<string, Building>
            buildingMap.set("q1r1s-2dEAST", new Building(new Vertex(1, 1, -2, Vertex.EAST_DIRECTION), "Dennis", Building.SETTLEMENT))
            const roadMap = new Map<string, Road>();
            roadMap.set(`q1r1s-2d${Edge.EAST_DIRECTION}`, new Road(new Edge(1,1,-2, Edge.EAST_DIRECTION),"Dennis"));
            const manager = new InteractionManager(canvas);
            const eventBus = new EventBus<GameEvents>();
            const board = new Board(map, roadMap, buildingMap,
                {x: 0, y:0, width: canvas.width, height: canvas.height}, canvas, layout, "", "Board", InputState.DefaultMode, manager, eventBus);
            //let currentSelection: Terrain | undefined = undefined;
            //board.draw(canvas, layout);
            const testCards = [new DevelopmentCard("KNIGHT"), new DevelopmentCard("YEAR_OF_THE_PLENTY")];
            const player = new Player("Dennis", [2, 1, 2, 1, 2], testCards, 2);
            //player.draw(canvas);
            //player.drawPlayerStats(canvas, 800);
            const player2 = new Player("Jørgen", [2, 1, 2, 1, 2], testCards, 2);
            const players = new Map<string, Player>();
            players.set("Dennis", player);
            players.set("Jørgen", player2);
            //player2.drawPlayerStats(canvas, 700);
            //const actions = ActionButton.testButtons(canvas);
            // actions.forEach(action => {
            //     action.draw()
            // })
            // drawBankCards(canvas, [15, 15, 15, 15, 15], 25, 800, 600);
            // drawDices(canvas, [2, 5], 670, 830);

            // canvas.addEventListener("mousemove", (e) => {
            //     const mouse = getMousePos(canvas, e);
            //     actions.forEach(action => {
            //         action.hoverHandler(mouse, (kind: string) => {
            //             console.log("hovering kind: ", kind);
            //         });
            //     })
            // });

            //console.log("edge.fromkey(): ", Edge.fromKey("q2r-2s0dNORTH"));

            const game = new Game(board, players, [], [1,3], [15,15,15,15,15], canvas, layout, "Dennis", manager, eventBus);
            game.draw();

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

            // canvas.addEventListener("mousemove", e => {
            //     const vertex = layout.pixelToVertixRounded(new Point(getMousePos(canvas, e).x, getMousePos(canvas, e).y));
            //         if (vertex && !board.roads.has(`q${vertex.q}r${vertex.r}d${vertex.direction}`)) {
            //             board.buildings.clear()
            //             board.buildings.set(`q${vertex.q}r${vertex.r}d${vertex.direction}`, new Building(vertex, 0, Building.CITY))
            //             board.draw();
            //         }
            // })

            console.log("UseEffect ran")

            // lobbyServerRef.current = new LobbySocket();
            // lobbyServerRef.current.init().then(() => {
            //     if (!lobbyServerRef.current) {
            //         console.error("LobbySocket not available, when trying call newLobby");
            //         return;
            //     }
            //     console.log("LobbySocket available");
            //     lobbyServerRef.current.newLobby("I AM TEST")
            //     lobbyServerRef.current.sendHello("TESTMESSAGE");
            // });


            // GameServerSocket.newGameServer().then((response) => {
            //    Game.fromResponse(response);
            // });
            //
            // gameServerRef.current = new GameServerSocket("http://localhost:8080/ws", 0);
            // gameServerRef.current.activate();
            // const timeout = setTimeout(() => {
            //     gameServerRef.current?.sendHello("From frontend");
            // }, 1000)

            return () => {
                console.log("return called ");
                // clearTimeout(timeout);
                // if (gameServerRef.current) {
                //     gameServerRef.current.deactivate();
                // }
                // if (lobbyServerRef.current) {
                //     lobbyServerRef.current.deactivate();
                //     lobbyServerRef.current = null;
                // }
            };
        }, []
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
