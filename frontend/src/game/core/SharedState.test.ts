import { describe, it, expect, beforeEach } from 'vitest';
import { SharedState } from './SharedState';
import { GamePhase, PieceType, TileKind, TileType } from './types';

describe('SharedState Rich Domain Model', () => {
    let shared: SharedState;

    beforeEach(() => {
        shared = new SharedState();
        shared.setLocalPlayerId('p1');
        shared.setCurrentPlayer('p1');
        shared.setCurrentPhase(GamePhase.PostRoll);
        shared.setPlayers([
            { id: 'p1', name: 'Alice', color: '#ff0000', resources: [
                { resourceType: 'lumber', uid: 'r1' },
                { resourceType: 'brick', uid: 'r2' },
                { resourceType: 'wool', uid: 'r3' },
                { resourceType: 'grain', uid: 'r4' },
                { resourceType: 'grain', uid: 'r5' },
                { resourceType: 'ore', uid: 'r6' },
                { resourceType: 'ore', uid: 'r7' },
                { resourceType: 'ore', uid: 'r8' },
            ] }
        ]);
    });

    it('initializes with a Board', () => {
        expect(shared.board).toBeDefined();
        expect(shared.board.hexGrid).toBeDefined();
        expect(shared.board.placementMap).toBeDefined();
    });

    it('loads board tiles and placements from snapshot', () => {
        const h0 = { q: 0, r: 0, s: 0 };
        const h1 = { q: 1, r: -1, s: 0 };
        const h2 = { q: 0, r: -1, s: 1 };

        shared.loadFromSnapshot({
            currentPhase: GamePhase.PostRoll,
            currentPlayerId: 'p1',
            players: [
                { id: 'p1', name: 'Alice', color: '#ff0000', resources: [] }
            ],
            tiles: [
                { hex: h0, kind: TileKind.Land, type: TileType.Fields, number: 6, hasRobber: false }
            ],
            placements: {
                roads: [{ edge: { hexes: [h0, h1] }, playerId: 'p1' }],
                settlements: [{ vertex: { hexes: [h0, h1, h2] }, playerId: 'p1' }],
                cities: []
            },
            activeFlowState: null
        }, 'p1');

        expect(shared.board.hexGrid.isValidHex(h0)).toBe(true);
        expect(shared.board.placementMap.isVertexOccupied({ hexes: [h0, h1, h2] })).toBe(true);
    });

    it('mutates board via placement methods', () => {
        const h0 = { q: 0, r: 0, s: 0 };
        const h1 = { q: 1, r: -1, s: 0 };
        const h2 = { q: 0, r: -1, s: 1 };
        const v = { hexes: [h0, h1, h2] as const };
        const e = { hexes: [h0, h1] as const };

        shared.placeSettlement(v, 'p1');
        expect(shared.board.placementMap.isVertexOccupied(v)).toBe(true);
        expect(shared.board.placementMap.hasOwnSettlement(v, 'p1')).toBe(true);

        shared.placeCity(v, 'p1');
        expect(shared.board.placementMap.getState().vertices.length).toBe(1);

        shared.placeRoad(e, 'p1');
        expect(shared.board.placementMap.isEdgeOccupied(e)).toBe(true);
    });

    it('validates player resource affordability', () => {
        expect(shared.canAfford(PieceType.Road)).toBe(true);
        expect(shared.canAfford(PieceType.Settlement)).toBe(true);
        expect(shared.canAfford(PieceType.City)).toBe(true);
    });
});
