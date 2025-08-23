import type {Layout} from "../hexagon/Layout.ts";
import {Terrain} from "./Terrain.ts";
import type {Road} from "./Road.ts";
import {Building} from "./Building.ts";
import {Hex} from "@/game/hexagon/Hex.ts";
import {Vertex} from "@/game/hexagon/Vertex.ts";
import {Edge} from "@/game/hexagon/Edge.ts";
import type {Drawable, GameEvents, Interactive} from "@/game/core/types.ts";
import {InputState} from "@/game/core/Game.ts";
import type {InteractionManager} from "@/game/input/InteractionManager.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import {Point} from "@/game/hexagon/Point.ts";

export class Board implements Interactive, Drawable {
    public map: Map<string, Terrain>;
    public roads: Map<string, Road>;
    public buildings: Map<string, Building>;
    public bounds: { x: number; y: number; width: number; height: number };
    public canvas: HTMLCanvasElement;
    public layout: Layout;
    public color: string;
    public id: string;
    public inputState: InputState;
    private eventBus: EventBus<GameEvents>

    constructor(map: Map<string, Terrain>, roads: Map<string, Road>, buildings: Map<string, Building>,
                bounds: { x: number; y: number; width: number; height: number },
                canvas: HTMLCanvasElement,
                layout: Layout,
                color: string,
                id: string,
                inputState: InputState,
                manager: InteractionManager,
                eventBus: EventBus<GameEvents>,
    ) {
        this.map = map;
        this.roads = roads;
        this.buildings = buildings;
        this.bounds = bounds;
        this.canvas = canvas;
        this.layout = layout;
        this.color = color;
        this.id = id;
        this.inputState = inputState;
        this.eventBus = eventBus;
        manager.register(this);
    }

    public static fromJSON(object: any, canvas: HTMLCanvasElement, layout: Layout, inputState: InputState, manager: InteractionManager, eventBus: EventBus<GameEvents>): Board {
        console.log("board object:", object);
        const map = new Map<string, Terrain>();
        const jsonMap = new Map<string, Terrain>(Object.entries(object.map))
        jsonMap.forEach((terrain: any) => {
            console.log(terrain);
            const t = new Terrain(new Hex(terrain.coordinates.q, terrain.coordinates.r, terrain.coordinates.s), terrain.kind, terrain.dice, terrain.tradeKind);
            console.log("parsed terrain", t);
            map.set(t.toKey(), t);
        });
        const bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
        }

        console.log("parsed map of the board: ", map);

        //TODO handle roads and buildings
        return new Board(map, new Map<string, Road>(), new Map<string, Building>, bounds, canvas, layout, "Black", "board", inputState, manager, eventBus);
    }

    public draw() {
        const canvas = this.canvas;
        const layout = this.layout;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        //Should not clear the map
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Start by drawing the map.
        for (const [, value] of this.map) {
            value.draw(canvas, layout);
        }

        //Drawing roads.
        for (const [, value] of this.roads) {
            ctx.beginPath();
            ctx.strokeStyle = value.styling();
            ctx.lineWidth = layout.road_width;
            ctx.stroke(value.edge.path2d(layout));
            ctx.closePath();

            //Cleanup
            ctx.beginPath();
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1;
            ctx.stroke(value.edge.path2d(layout));
            ctx.closePath();
        }

        //Drawing buildings
        for (const [, value] of this.buildings) {
            //ctx.fillStyle = value.styling();
            //ctx.fill(value.vertex.path2d(layout, value.kind == Building.CITY));
            value.vertex.drawBuilding(canvas, layout, false, "green");

            //Cleanup
            ctx.fillStyle = "black"
        }
    }

    public drawLegalRoads(setup: boolean, playerName: string, canvas: HTMLCanvasElement, layout: Layout, latestHouse?: Building) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't draw legal roads.");
            return;
        }
        const legalRoads = setup && latestHouse ? this.setupLegalRoadCoordinates(latestHouse) : this.legalRoadCoordinates(playerName);
        const edgesToDraw: Edge[] = [];
        legalRoads.forEach((roadKey: string) => {
            const edge = Edge.fromKey(roadKey);
            if (edge) {
                edgesToDraw.push(edge);
            }
        });

        edgesToDraw.forEach((edge: Edge) => {
            ctx.beginPath();
            ctx.strokeStyle = "blue"
            ctx.lineWidth = 3;
            ctx.stroke(edge.path2d(layout));
            ctx.closePath();
        });
    }

    public drawLegalHouses(setup: boolean, playerName: string, canvas: HTMLCanvasElement, layout: Layout) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't draw legal houses");
            return;
        }

        const legalHouse = setup ? this.setupLegalHouseCoordinates() : this.legalHouseCoordinates(playerName);
        const housesToDraw: Vertex[] = [];
        legalHouse.forEach((key: string) => {
            const edge = Vertex.fromKey(key);
            if (edge) {
                housesToDraw.push(edge);
            }
        });

        housesToDraw.forEach((vertex: Vertex) => {
            ctx.beginPath();
            ctx.fillStyle = "blue"
            ctx.fill(vertex.path2d(layout, false));
            ctx.closePath();
            //Cleanup
            ctx.fillStyle = "black"
        });
    }

    //Not including Setup positions
    public legalHouseCoordinates(playerName: string) {
        const legalPositions = new Set<string>();

        this.roads.forEach((road) => {
            if (road.player == playerName) {
                //End the road should be legal, unless house is in edgeVertex.
                road.edgeVertices().forEach((vertex) => {
                    let noHouse = true;
                    vertex.vertexNeighbours().forEach((neighbourVertex) => {
                        if (this.buildings.has(neighbourVertex.toKey())) {
                            noHouse = false;
                        }
                    });
                    if (noHouse) {
                        legalPositions.add(vertex.toKey());
                    }
                });
            }
        });

        return legalPositions;
    }

    public legalRoadCoordinates(playerName: string) {
        const legalPositions = new Set<string>();

        //End of road positions
        this.roads.forEach((road) => {
            if (road.player == playerName) {
                road.edgeVertices().forEach((vertex) => {
                    if (!this.buildings.has(vertex.toKey())) {
                        vertex.edgeNeighbours().forEach((neighbourEdge) => {
                            if (!this.roads.has(neighbourEdge.toKey())) {
                                legalPositions.add(neighbourEdge.toKey());
                            }
                        });
                    }
                });
            }
        });

        //House positions
        this.buildings.forEach((building) => {
            if (building.player == playerName) {
                building.edgeNeighbours().forEach((neighbourEdge) => {
                    if (!this.roads.has(neighbourEdge.toKey())) {
                        legalPositions.add(neighbourEdge.toKey());
                    }
                })
            }
        });

        return legalPositions;
    }

    public legalCityCoordinates(playerName: string) {
        const legalPositions = new Set<string>(); //Keys of the locations

        this.buildings.forEach((building) => {
            if (building.kind == Building.SETTLEMENT && building.player == playerName) {
                legalPositions.add(building.vertex.toKey());
            }
        });

        return legalPositions;
    }

    public setupLegalHouseCoordinates() {
        const legalPositions = new Set<string>(); //Should be keys instead, to ensure no duplicates.

        this.map.forEach((hex) => {
            if (hex.kind == Terrain.SEA || hex.kind == Terrain.PORT) {
                return;
            }

            hex.hex.vertexNeighbours().forEach((vertex) => {
                legalPositions.add(vertex.toKey());
            });

            this.buildings.forEach((building) => {
                legalPositions.delete(building.vertex.toKey());
                building.vertexNeighbours().forEach((vertex) => {
                    legalPositions.delete(vertex.toKey());
                })
            });
        });

        return legalPositions;
    }

    public setupLegalRoadCoordinates(latestHouse: Building) {
        const legalPositions = new Set<string>();

        latestHouse.edgeNeighbours().forEach((vertex) => {
            legalPositions.add(vertex.toKey());
        });

        return legalPositions;
    }

    public isLegalHouseVertex(vertex: Vertex, playerName: string): boolean {
        const legalPositions = this.legalHouseCoordinates(playerName);
        if (legalPositions.has(vertex.toKey())) {
            return true;
        }
        return false;
    }

    public isLegalRoadEdge(edge: Edge, playerName: string): boolean {
        const legalPositions = this.legalRoadCoordinates(playerName);
        if (legalPositions.has(edge.toKey())) {
            return true;
        }
        return false;
    }

    public isLegalCityVertex(vertex: Vertex, playerName: string): boolean {
        const legalPositions = this.legalCityCoordinates(playerName);
        if (legalPositions.has(vertex.toKey())) {
            return true;
        }
        return false;
    }

    onClick(event: { x: number; y: number }): void {
        //Somehow get to understand the current InputState
        switch (this.inputState) {
            case InputState.RoadPlacingMode: {
                const edge = this.layout.pixelToEdgeRounded(new Point(event.x, event.y));
                if (!edge) {
                    console.error("No edge detected");
                    return;
                }
                this.eventBus.publish('PlaceRoadEvent', EventBus.createEvent({edge: edge}))
                break;
            }
            case InputState.HousePlacingMode: {
                const vertex = this.layout.pixelToVertexRounded(new Point(event.x, event.y));
                if (!vertex) {
                    console.error("No vertex detected");
                    return;
                }
                this.eventBus.publish('PlaceHouseEvent', EventBus.createEvent({vertex: vertex}))
                break;
            }
            case InputState.CityPlacingMode: {
                const vertex = this.layout.pixelToVertexRounded(new Point(event.x, event.y));
                if (!vertex) {
                    console.error("No vertex detected");
                    return;
                }
                this.eventBus.publish('PlaceCityEvent', EventBus.createEvent({vertex: vertex}))
                break;
            }
            case InputState.RobberPlacingMode: {
                const hex = this.layout.pixelToHexRounded(new Point(event.x, event.y));
                if (!hex) {
                    console.error("No hex detected");
                    return;
                }
                this.eventBus.publish('PlaceRobberEvent', EventBus.createEvent({hex: hex}))
                break;
            }
            default:
                break;
        }

    }

    onHover(event: { x: number; y: number }): void {
        //Somehow get to understand the current InputState

    }

    onHoverEnd(event: { x: number; y: number }): void {
        return;
    }

    onHoverStart(event: { x: number; y: number }): void {
        return;
    }


}