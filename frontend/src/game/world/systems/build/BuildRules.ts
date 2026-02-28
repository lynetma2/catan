

// ─── Piece types ──────────────────────────────────────────────────────

import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import {type BuildTarget, PieceType, ResourceType} from "@/game/core/types.ts";
import {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";

export type ResourceCost = Partial<Record<ResourceType, number>>;

export const PIECE_COSTS: Record<PieceType, ResourceCost> = {
    road:       { [ResourceType.Lumber]: 1, [ResourceType.Brick]: 1 },
    settlement: { [ResourceType.Lumber]: 1, [ResourceType.Brick]: 1, [ResourceType.Wool]: 1, [ResourceType.Grain]: 1 },
    city:       { [ResourceType.Grain]: 2, [ResourceType.Ore]: 3 },
};

export const DEV_CARD_COST: Partial<ResourceCost> = {
    [ResourceType.Ore]: 1,
    [ResourceType.Grain]: 1,
    [ResourceType.Wool]: 1
}

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
        if (!ctx.gamePhase.isPlayersTurn(playerId))       return BuildRejectionReason.NOT_YOUR_TURN;
        if (!ctx.gamePhase.isBuildingPhase() &&
            !ctx.gamePhase.isSetupPhase())                return BuildRejectionReason.WRONG_PHASE;

        if (!ctx.gamePhase.isSetupPhase()) {
            if (!ctx.player.canAfford(playerId, PIECE_COSTS[pieceType]))
                return BuildRejectionReason.INSUFFICIENT_RESOURCES;
        }

        switch (pieceType) {
            case PieceType.Settlement: return buildRules.validateSettlement(target, playerId, ctx);
            case PieceType.City:       return buildRules.validateCity(target, playerId, ctx);
            case PieceType.Road:       return buildRules.validateRoad(target, playerId, ctx);
        }
    },

    validateSettlement: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                            return BuildRejectionReason.INVALID_LOCATION;
        if (!ctx.board.isValidVertex(target.vertex))             return BuildRejectionReason.INVALID_LOCATION;
        if (ctx.board.isVertexOccupied(target.vertex))           return BuildRejectionReason.SPOT_OCCUPIED;
        if (!ctx.board.respectsDistanceRule(target.vertex))      return BuildRejectionReason.DISTANCE_RULE_VIOLATED;
        if (!ctx.gamePhase.isSetupPhase() &&
            !ctx.board.hasAdjacentRoad(target.vertex, playerId)) return BuildRejectionReason.NO_ADJACENT_ROAD;
        return null;
    },

    validateCity: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                             return BuildRejectionReason.INVALID_LOCATION;
        if (!ctx.board.isValidVertex(target.vertex))              return BuildRejectionReason.INVALID_LOCATION;
        if (!ctx.board.hasOwnSettlement(target.vertex, playerId)) return BuildRejectionReason.NO_SETTLEMENT_TO_UPGRADE;
        return null;
    },

    validateRoad: (
        target:   BuildTarget,
        playerId: string,
        ctx:      BuildContext,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'edge')                                        return BuildRejectionReason.INVALID_LOCATION;
        if (!ctx.board.isValidEdge(target.edge))                           return BuildRejectionReason.INVALID_LOCATION;
        if (ctx.board.isEdgeOccupied(target.edge))                         return BuildRejectionReason.SPOT_OCCUPIED;
        if (!ctx.board.hasAdjacentRoadOrSettlement(target.edge, playerId)) return BuildRejectionReason.NO_ADJACENT_ROAD;
        return null;
    },
};