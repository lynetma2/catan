import type {
    Board,
    Building,
    GameState,
    HUDEntities,
    InputState,
    Player,
    Road,
    Tile
} from "@/game/model/types.ts";
import {
    BuildingType,
    EdgeDirection,
    GamePhase,
    ResourceType,
    TileKind,
    VertexDirection
} from "@/game/model/enums.ts";
import {DEFAULT_PHASE_CONFIG} from "@/game/config/defaultPhaseConfig.ts";


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
    // buildings.set("q0r0dWest", {
    //     vertex: { q: 0, r: 0, direction: VertexDirection.West },
    //     type: BuildingType.Settlement,
    //     playerName: "Player 1"
    // });
    return buildings;
}

export const generateTestRoad = (): Map<string, Road> => {
    const roads = new Map<string, Road>();
    // roads.set("q0r0dEast", {
    //     edge: { q: 0, r: 0, direction: EdgeDirection.East },
    //     playerName: "Player 1"
    // });
    return roads;
}

export const TEST_TILES: Map<string, Tile> = generateTestTiles();

export const TEST_PLAYERS: Player[] = [
    {
        playerName: "Player 1",
        inventory: {
            resources: {
                [ResourceType.Wood]: 5,
                [ResourceType.Brick]: 5,
                [ResourceType.Sheep]: 5,
                [ResourceType.Wheat]: 5,
                [ResourceType.Ore]: 5
            },
            hiddenCount: 0
        },
        points: 0,
        isActive: true,
        isLocal: true,
        style: { fillColor: "#e74c3c", strokeColor: "#c0392b" }
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
            },
            hiddenCount: 0
        },
        points: 0,
        isActive: false,
        isLocal: false,
        style: { fillColor: "#3498db", strokeColor: "#2980b9" }
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
            },
            hiddenCount: 0
        },
        points: 0,
        isActive: false,
        isLocal: false,
        style: { fillColor: "#2ecc71", strokeColor: "#27ae60" }
    }
]

export const TEST_BUILDINGS: Map<string, Building> = generateTestBuildings();

export const TEST_ROADS: Map<string, Road> = generateTestRoad();

export const TEST_BOARD: Board = {
    buildings: TEST_BUILDINGS,
    roads: TEST_ROADS,
    tiles: TEST_TILES,
    robber: { q: 0, r: 0 } // Desert location based on generation order
}

export const INITIAL_INPUT: InputState = {
    pressedKeys: new Set(),
    mousePosition: null
}

export const TEST_GAMESTATE: GameState = {
    board: TEST_BOARD,
    players: TEST_PLAYERS,
    dices: [1, 1],
    phase: GamePhase.SetupSettlement,
    phaseConfig: DEFAULT_PHASE_CONFIG,
    inputState: INITIAL_INPUT
};

export const TEST_HUD: HUDEntities = {
    buttons: [],
    cards: [],
    playerPanels: []
}
