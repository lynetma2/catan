// dev/testData.ts

// ─── Players ──────────────────────────────────────────────────────────


import {type Hex, hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import {
    GamePhase,
    type GameSnapshot,
    type PlacementSnapshot,
    type PlayerSnapshot,
    ResourceType,
    TileKind,
    type TileSnapshot,
    TileType
} from "@/game/core/types.ts";
import {TradeOfferKind, type TradeOfferPanelData, TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";

const v = (q: number, r: number, dir1: number, dir2: number): Vertex => {
    const center = hex.create(q, r, -q - r);
    const n1     = hex.neighbor(center, dir1);
    const n2     = hex.neighbor(center, dir2);

    // Sort so the key is stable regardless of order
    const sorted = [center, n1, n2].sort((a, b) =>
        a.q !== b.q ? a.q - b.q :
            a.r !== b.r ? a.r - b.r :
                a.s - b.s
    );

    return { hexes: sorted as [Hex, Hex, Hex] };
};

// Builds an edge from a center hex and one direction index
const e = (q: number, r: number, dir: number): Edge => {
    const center    = hex.create(q, r, -q - r);
    const neighbour = hex.neighbor(center, dir);

    const sorted = [center, neighbour].sort((a, b) =>
        a.q !== b.q ? a.q - b.q :
            a.r !== b.r ? a.r - b.r :
                a.s - b.s
    );

    return { hexes: sorted as [Hex, Hex] };
};

function createPlayers(count: 2 | 3 | 4): PlayerSnapshot[] {
    return [
        {
            id:             'p1',
            name:           'Alice',
            color:          '#e05050',
            resources:      [
                { uid: 'r1', resourceType: ResourceType.Lumber  },
                { uid: 'r2', resourceType: ResourceType.Lumber  },
                { uid: 'r3', resourceType: ResourceType.Brick    },
                { uid: 'r4', resourceType: ResourceType.Wool    },
                { uid: 'r5', resourceType: ResourceType.Grain    },
                { uid: 'r6', resourceType: ResourceType.Brick    },
            ],
            devCards:       [],
            victoryPoints:  2,
            cardCount:      3,
            devCardCount:   0,
            hasLongestRoad: true,
            hasLargestArmy: false,
            usedRobbers:    0,
        },
        {
            id:             'p2',
            name:           'Bob',
            color:          '#50a0e0',
            resources:      [],
            devCards:       [],
            victoryPoints:  2,
            cardCount:      5,
            devCardCount:   1,
            hasLongestRoad: false,
            hasLargestArmy: true,
            usedRobbers:    2,
        },
        {
            id:             'p3',
            name:           'Carol',
            color:          '#50c050',
            resources:      [],
            devCards:       [],
            victoryPoints:  3,
            cardCount:      2,
            devCardCount:   0,
            hasLongestRoad: false,
            hasLargestArmy: false,
            usedRobbers:    0,
        },
        {
            id:             'p4',
            name:           'Dave',
            color:          '#e0a030',
            resources:      [],
            devCards:       [],
            victoryPoints:  1,
            cardCount:      0,
            devCardCount:   0,
            hasLongestRoad: false,
            hasLargestArmy: false,
            usedRobbers:    0,
        },
    ].slice(0, count);
}

// ─── Board ────────────────────────────────────────────────────────────

// Standard Catan board layout in cube coordinates
// Ring 0: center
// Ring 1: 6 tiles
// Ring 2: 12 tiles (outer land + sea border)
function createTiles(): TileSnapshot[] {
    const tiles: TileSnapshot[] = [];

    // ── Land tiles ────────────────────────────────────────────────────

    // Standard Catan tile distribution:
    // Forest x4, Hills x3, Pasture x4, Fields x4, Mountains x3, Desert x1

    const landLayout: { q: number; r: number; type: TileSnapshot['type']; number: number | null }[] = [
        // Center
        { q:  0, r:  0, type: TileType.Desert,    number: null },

        // Ring 1
        { q:  1, r: -1, type: TileType.Fields,    number: 9  },
        { q:  1, r:  0, type: TileType.Forest,    number: 11 },
        { q:  0, r:  1, type: TileType.Hills,     number: 3  },
        { q: -1, r:  1, type: TileType.Pasture,   number: 6  },
        { q: -1, r:  0, type: TileType.Mountains, number: 8  },
        { q:  0, r: -1, type: TileType.Forest,    number: 4  },

        // Ring 2 — land tiles
        { q:  2, r: -2, type: TileType.Pasture,   number: 5  },
        { q:  2, r: -1, type: TileType.Hills,     number: 2  },
        { q:  2, r:  0, type: TileType.Fields,    number: 6  },
        { q:  1, r:  1, type: TileType.Forest,    number: 11 },
        { q:  0, r:  2, type: TileType.Mountains, number: 3  },
        { q: -1, r:  2, type: TileType.Fields,    number: 4  },
        { q: -2, r:  2, type: TileType.Forest,    number: 8  },
        { q: -2, r:  1, type: TileType.Pasture,   number: 10 },
        { q: -2, r:  0, type: TileType.Hills,     number: 9  },
        { q: -1, r: -1, type: TileType.Fields,    number: 5  },
        { q:  0, r: -2, type: TileType.Mountains, number: 10 },
        { q:  1, r: -2, type: TileType.Pasture,   number: 12 },
    ];

    landLayout.forEach(({ q, r, type, number }) => {
        const s = -q - r;
        tiles.push({
            hex:      { q, r, s },
            kind:     type === TileType.Desert ? TileKind.Desert : TileKind.Land,
            type,
            number,
            hasRobber: type === 'desert',
            isPort:   false,
            portType: null,
            portFacing: null,
        });
    });

    // ── Sea tiles with ports ──────────────────────────────────────────

    const seaLayout = [
        { q:  3, r: -3, isPort: false, portType: null,                portFacing: null },
        { q:  3, r: -2, isPort: true,  portType: 'any',               portFacing: 3    }, // → left
        { q:  3, r: -1, isPort: false, portType: null,                portFacing: null },
        { q:  3, r:  0, isPort: true,  portType: ResourceType.Grain,  portFacing: 4    }, // → lower-left
        { q:  2, r:  1, isPort: false, portType: null,                portFacing: null },
        { q:  1, r:  2, isPort: true,  portType: 'any',               portFacing: 3    }, // → left
        { q:  0, r:  3, isPort: false, portType: null,                portFacing: null },
        { q: -1, r:  3, isPort: true,  portType: ResourceType.Brick,  portFacing: 2    }, // → upper-left
        { q: -2, r:  3, isPort: false, portType: null,                portFacing: null },
        { q: -3, r:  3, isPort: true,  portType: 'any',               portFacing: 1    }, // → upper-right
        { q: -3, r:  2, isPort: false, portType: null,                portFacing: null },
        { q: -3, r:  1, isPort: true,  portType: ResourceType.Wool,   portFacing: 0    }, // → right
        { q: -3, r:  0, isPort: false, portType: null,                portFacing: null },
        { q: -3, r: -1, isPort: true,  portType: 'any',               portFacing: 0    }, // → right
        { q: -2, r: -2, isPort: false, portType: null,                portFacing: null },
        { q: -1, r: -3, isPort: true,  portType: ResourceType.Lumber, portFacing: 5    }, // → lower-right
        { q:  0, r: -3, isPort: false, portType: null,                portFacing: null },
        { q:  1, r: -3, isPort: true,  portType: ResourceType.Ore,    portFacing: 4    }, // → lower-left
        { q:  2, r: -3, isPort: false, portType: null,                portFacing: null },
    ];

    seaLayout.forEach(({ q, r, isPort, portType, portFacing }) => {
        const s = -q - r;
        tiles.push({
            hex:       { q, r, s },
            kind:      TileKind.Sea,
            type:      TileType.Sea,
            number:    null,
            hasRobber: false,
            isPort,
            portType,
            portFacing,
        });
    });

    return tiles;
}

// ─── Placements ───────────────────────────────────────────────────────

function createPlacements(playerCount: 2 | 3 | 4): PlacementSnapshot {
    const settlements = [
        { vertex: v( 0,  0, 1, 2), playerId: 'p1' },  // upper area
        { vertex: v(-1,  0, 0, 1), playerId: 'p1' },
        { vertex: v( 1,  0, 3, 4), playerId: 'p2' },
        { vertex: v( 0,  1, 1, 2), playerId: 'p2' },
        { vertex: v(-1,  1, 0, 1), playerId: 'p3' },
        { vertex: v( 1, -1, 4, 5), playerId: 'p3' },
        { vertex: v(-2,  1, 0, 1), playerId: 'p4' },
        { vertex: v( 0, -1, 3, 4), playerId: 'p4' },
    ].slice(0, playerCount * 2);

    const roads = [
        { edge: e( 0,  0, 1), playerId: 'p1' },
        { edge: e(-1,  0, 0), playerId: 'p1' },
        { edge: e( 0,  0, 4), playerId: 'p2' },
        { edge: e( 0,  1, 1), playerId: 'p2' },
        { edge: e(-1,  1, 0), playerId: 'p3' },
        { edge: e( 1, -1, 4), playerId: 'p3' },
        { edge: e(-2,  1, 0), playerId: 'p4' },
        { edge: e( 0, -1, 4), playerId: 'p4' },
    ].slice(0, playerCount * 2);

    return { settlements, cities: [], roads };
}

function createActiveTradeOffers(players: PlayerSnapshot[]): TradeOfferPanelData[] {
    return [
        {
            kind: TradeOfferKind.Incoming,
            tradeOfferId: 'trade-1',
            tradeOwnerId: 'p2',
            offeredResources: [
                {uid: 't1', resourceType: ResourceType.Lumber},
                {uid: 't2', resourceType: ResourceType.Lumber},
            ],
            wantedResources: [
                {uid: 't3', resourceType: ResourceType.Brick},
            ],
            playerResponses: players
                .filter(p => p.id !== 'p2')
                .map(p => ({
                    playerId: p.id,
                    response: TradeOfferResponseKind.NoAnswer,
                })),
        },
    ];
}

// ─── Main factory ─────────────────────────────────────────────────────

export function createTestGameState(
    playerCount:      2 | 3 | 4 = 4,
    currentPlayerId:  string     = 'p1',
    phase:            GamePhase  = GamePhase.PostRoll,
): GameSnapshot {
    const players = createPlayers(playerCount);

    return {
        players,
        tiles: createTiles(),
        placements: createPlacements(playerCount),
        currentPhase: phase,
        currentPlayerId,
        turnNumber: 4,
        activeTradeOffers: createActiveTradeOffers(players),
    };
}

// ─── Scenario presets ─────────────────────────────────────────────────
// Useful for testing specific game states from the browser console
// e.g. window.loadScenario('robber')

export const TEST_SCENARIOS: Record<string, () => GameSnapshot> = {
    default:  ()  => createTestGameState(4),
    twoPlayer:()  => createTestGameState(2),
    preRoll:  ()  => createTestGameState(4, 'p1', GamePhase.PreRoll),
    robber:   ()  => createTestGameState(4, 'p1', GamePhase.RobberPlacement),
    setup:    ()  => createTestGameState(4, 'p1', GamePhase.SetupPlaceSettlement),
    endGame:  ()  => {
        const state = createTestGameState(4);
        state.players[0].victoryPoints = 9;
        return state;
    },
};