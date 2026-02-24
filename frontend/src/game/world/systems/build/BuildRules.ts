

// ─── Piece types ──────────────────────────────────────────────────────

import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {BuildTarget} from "@/game/core/types.ts";

export type PieceType = 'road' | 'settlement' | 'city';

export type ResourceCost = {
    wood:  number;
    brick: number;
    wool:  number;
    wheat: number;
    ore:   number;
};

export const PIECE_COSTS: Record<PieceType, Partial<ResourceCost>> = {
    road:       { wood: 1, brick: 1 },
    settlement: { wood: 1, brick: 1, wool: 1, wheat: 1 },
    city:       { wheat: 2, ore: 3 },
};

// ─── Query interfaces ─────────────────────────────────────────────────

export interface BoardQuery {
    isValidVertex:               (vertex: Vertex)                   => boolean;
    isValidEdge:                 (edge:   Edge)                     => boolean;
    isVertexOccupied:            (vertex: Vertex)                   => boolean;
    isEdgeOccupied:              (edge:   Edge)                     => boolean;
    hasAdjacentRoad:             (vertex: Vertex, playerId: string) => boolean;
    hasAdjacentRoadOrSettlement: (edge:   Edge,   playerId: string) => boolean;
    respectsDistanceRule:        (vertex: Vertex)                   => boolean;
    hasOwnSettlement:            (vertex: Vertex, playerId: string) => boolean;
}

export interface PlayerQuery {
    canAfford: (playerId: string, cost: Partial<ResourceCost>) => boolean;
}

export interface GamePhaseQuery {
    isPlayersTurn:   (playerId: string) => boolean;
    isBuildingPhase: ()                 => boolean;
    isSetupPhase:    ()                 => boolean;
    canRollDice:     ()                 => boolean;
    mustPlaceRobber: ()                 => boolean;
}

export interface BuildContext {
    board:     BoardQuery;
    player:    PlayerQuery;
    gamePhase: GamePhaseQuery;
}

// ─── Pure validation ──────────────────────────────────────────────────

export const buildRules = {

    validate: (
        pieceType: PieceType,
        target:    BuildTarget,
        playerId:  string,
        ctx:       BuildContext,
    ): BuildRejectionReason | null => {
        if (!ctx.gamePhase.isPlayersTurn(playerId))       return 'NOT_YOUR_TURN';
        if (!ctx.gamePhase.isBuildingPhase() &&
            !ctx.gamePhase.isSetupPhase())                return 'WRONG_PHASE';

        if (!ctx.gamePhase.isSetupPhase()) {
            if (!ctx.player.canAfford(playerId, PIECE_COSTS[pieceType]))
                return 'INSUFFICIENT_RESOURCES';
        }

        switch (pieceType) {
            case 'settlement': return buildRules.validateSettlement(target, playerId, ctx);
            case 'city':       return buildRules.validateCity(target, playerId, ctx);
            case 'road':       return buildRules.validateRoad(target, playerId, ctx);
        }
    },

    validateSettlement: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                            return 'INVALID_LOCATION';
        if (!ctx.board.isValidVertex(target.vertex))             return 'INVALID_LOCATION';
        if (ctx.board.isVertexOccupied(target.vertex))           return 'SPOT_OCCUPIED';
        if (!ctx.board.respectsDistanceRule(target.vertex))      return 'DISTANCE_RULE_VIOLATED';
        if (!ctx.gamePhase.isSetupPhase() &&
            !ctx.board.hasAdjacentRoad(target.vertex, playerId)) return 'NO_ADJACENT_ROAD';
        return null;
    },

    validateCity: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                             return 'INVALID_LOCATION';
        if (!ctx.board.isValidVertex(target.vertex))              return 'INVALID_LOCATION';
        if (!ctx.board.hasOwnSettlement(target.vertex, playerId)) return 'NO_SETTLEMENT_TO_UPGRADE';
        return null;
    },

    validateRoad: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'edge')                                        return 'INVALID_LOCATION';
        if (!ctx.board.isValidEdge(target.edge))                           return 'INVALID_LOCATION';
        if (ctx.board.isEdgeOccupied(target.edge))                         return 'SPOT_OCCUPIED';
        if (!ctx.board.hasAdjacentRoadOrSettlement(target.edge, playerId)) return 'NO_ADJACENT_ROAD';
        return null;
    },
};