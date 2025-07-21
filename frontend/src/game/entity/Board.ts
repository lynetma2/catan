import type {Layout} from "../hexagon/Layout.ts";
import {Terrain} from "./Terrain.ts";
import type {Road} from "./Road.ts";
import {Building} from "./Building.ts";
import {Hex} from "@/game/hexagon/Hex.ts";
import {Vertex} from "@/game/hexagon/Vertex.ts";
import {Edge} from "@/game/hexagon/Edge.ts";

export class Board {
    public map: Map<string,Terrain>;
    public roads: Map<string,Road>;
    public buildings: Map<string,Building>;

    constructor(map: Map<string,Terrain>, roads: Map<string, Road>, buildings: Map<string, Building>) {
        this.map = map;
        this.roads = roads;
        this.buildings = buildings;
    }

    public static fromJSON(object: any): Board {
        console.log("board object:", object);
        const map = new Map<string,Terrain>();
        const jsonMap = new Map<string, Terrain>(Object.entries(object.map))
        jsonMap.forEach((terrain: any) => {
            console.log(terrain);
            const t = new Terrain(new Hex(terrain.coordinates.q, terrain.coordinates.r, terrain.coordinates.s), terrain.kind, terrain.dice, terrain.tradeKind);
            console.log("parsed terrain", t);
            map.set(t.toKey(), t);
        });

        console.log("parsed map of the board: ", map);

        //TODO handle roads and buildings
        return new Board(map, new Map<string, Road>(), new Map<string, Building>);
    }

    public draw(canvas: HTMLCanvasElement, layout: Layout) {
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
}