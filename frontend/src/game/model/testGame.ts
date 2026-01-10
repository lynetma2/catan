import type {
    Board,
    Building,
    Button,
    GameState,
    HUDEntities,
    InputState,
    Player,
    Road,
    Tile
} from "@/game/model/types.ts";
import {
    BuildingType,
    ButtonType,
    EdgeDirection,
    GamePhase,
    ResourceType,
    TileKind,
    VertexDirection
} from "@/game/model/enums.ts";
import {HUDLayoutService} from "@/game/service/layout/HUDLayoutService.ts";

export const generateTestTiles = (): Map<string, Tile> => {
    const map = new Map<string, Tile>();
    const N = 3;

    const resources = [
        ResourceType.Wood, ResourceType.Wood, ResourceType.Wood, ResourceType.Wood,
        ResourceType.Sheep, ResourceType.Sheep, ResourceType.Sheep, ResourceType.Sheep,
        ResourceType.Wheat, ResourceType.Wheat, ResourceType.Wheat, ResourceType.Wheat,
        ResourceType.Brick, ResourceType.Brick, ResourceType.Brick,
        ResourceType.Ore, ResourceType.Ore, ResourceType.Ore
    ];

    const numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

    let resIndex = 0;
    let numIndex = 0;

    for (let q = -N; q <= N; q++) {
        const r1 = Math.max(-N, -q - N)
        const r2 = Math.min(N, -q + N)
        for (let r = r1; r <= r2; r++) {
            const s = -q - r;
            const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));

            let tile: Tile;

            if (dist === 3) {
                tile = {
                    hex: {q, r},
                    tileKind: TileKind.SeaTile
                };
            } else {
                if (resIndex < resources.length) {
                    tile = {
                        hex: {q, r},
                        tileKind: TileKind.ResourceTile,
                        resourceType: resources[resIndex++],
                        dice: numbers[numIndex++]
                    };
                } else {
                    tile = {
                        hex: {q, r},
                        tileKind: TileKind.DessertTile
                    };
                }
            }
            map.set(`q${q}r${r}s${s}`, tile)
        }
    }
    return map;
}

export const generateTestBuildings = (): Map<string, Building> => {
    const buildings = new Map<string, Building>();
    buildings.set("q0r0dEast", {
        vertex: { q: 0, r: 0, direction: VertexDirection.West },
        type: BuildingType.City,
        playerName: "Player 1"
    });
    return buildings;
}

export const generateTestRoad = (): Map<string, Road> => {
    const roads = new Map<string, Road>();
    roads.set("q0r0dEast", {
        edge: { q: 0, r: 0, direction: EdgeDirection.East },
        playerName: "Player 1"
    });
    return roads;
}

export const TEST_TILES: Map<string, Tile> = generateTestTiles();

export const TEST_PLAYERS: Player[] = [
    {
        playerName: "Player 1",
        inventory: {
            resources: {
                [ResourceType.Wood]: 2,
                [ResourceType.Brick]: 3,
                [ResourceType.Sheep]: 0,
                [ResourceType.Wheat]: 0,
                [ResourceType.Ore]: 0
            }
        },
        points: 0,
        isActive: true,
        isLocal: true,
        style: { fillColor: "#e74c3c" }
    },
    {
        playerName: "Player 2",
        inventory: {
            resources: {
                [ResourceType.Wood]: 0,
                [ResourceType.Brick]: 0,
                [ResourceType.Sheep]: 0,
                [ResourceType.Wheat]: 0,
                [ResourceType.Ore]: 0
            }
        },
        points: 0,
        isActive: false,
        isLocal: false,
        style: { fillColor: "#3498db" }
    },
    {
        playerName: "Player 3",
        inventory: {
            resources: {
                [ResourceType.Wood]: 0,
                [ResourceType.Brick]: 0,
                [ResourceType.Sheep]: 0,
                [ResourceType.Wheat]: 0,
                [ResourceType.Ore]: 0
            }
        },
        points: 0,
        isActive: false,
        isLocal: false,
        style: { fillColor: "#2ecc71" }
    }
]

export const TEST_BUILDINGS: Map<string, Building> = generateTestBuildings();

export const TEST_ROADS: Map<string, Road> = generateTestRoad();

export const TEST_BOARD: Board = {
    buildings: TEST_BUILDINGS,
    roads: TEST_ROADS,
    tiles: TEST_TILES,
    robber: { q: 2, r: 0 } // Desert location based on generation order
}

export const INITIAL_INPUT: InputState = {
    pressedKeys: new Set(),
    mousePosition: null
}

export const TEST_GAMESTATE: GameState = {
    board: TEST_BOARD,
    players: TEST_PLAYERS,
    dices: [1, 1],
    phase: GamePhase.Setup,
    inputState: INITIAL_INPUT
};

export const generateTestButtons = () => {
    return [END_TURN_BUTTON, PUT_CITY_BUTTON, PUT_SETTLEMENT_BUTTON, PUT_ROAD_BUTTON, DRAW_DEVELOPMENT_CARD]
}

export const CANVAS_WIDTH = 2560;
export const CANVAS_HEIGHT = 1440;

export const END_TURN_BUTTON: Button = {
    type: ButtonType.endTurn,
    layout: {
        x: 500,
        y: 900,
        width: 100,
        height: 100,
        scale: 1.0
    }
}

export const PUT_CITY_BUTTON: Button = {
    type: ButtonType.putCity,
    layout: {
        x: 600,
        y: 900,
        width: 100,
        height: 100,
        scale: 1.0
    }
}

export const PUT_SETTLEMENT_BUTTON: Button = {
    type: ButtonType.putSettlement,
    layout: {
        x: 700,
        y: 900,
        width: 100,
        height: 100,
        scale: 1.0
    }
}

export const PUT_ROAD_BUTTON: Button = {
    type: ButtonType.putRoad,
    layout: {
        x: 800,
        y: 900,
        width: 100,
        height: 100,
        scale: 1.0
    }
}

export const DRAW_DEVELOPMENT_CARD: Button = {
    type: ButtonType.drawDevelopmentCard,
    layout: {
        x: 900,
        y: 900,
        width: 100,
        height: 100,
        scale: 1.0
    }
}

export const TEST_HUD: HUDEntities = {
    buttons: generateTestButtons(),
    cards: []
}
