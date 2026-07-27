

// ─── Piece types ──────────────────────────────────────────────────────

import {type BuildTarget, PieceType, ResourceType} from "@/game/core/types.ts";
import {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";
import type {SharedState} from "@/game/core/SharedState.ts";

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
};

// ─── Pure validation ──────────────────────────────────────────────────

export const buildRules = {

    validate: (
        pieceType: PieceType,
        target:    BuildTarget,
        playerId:  string,
        shared:    SharedState,
    ): BuildRejectionReason | null => {
        if (!shared.isPlayersTurn(playerId))       return BuildRejectionReason.NOT_YOUR_TURN;
        if (!shared.isBuildingPhase &&
            !shared.isSetupPhase)                return BuildRejectionReason.WRONG_PHASE;

        if (!shared.isSetupPhase) {
            if (!shared.canPlayerAfford(playerId, pieceType))
                return BuildRejectionReason.INSUFFICIENT_RESOURCES;
        }

        switch (pieceType) {
            case PieceType.Settlement: return buildRules.validateSettlement(target, playerId, shared);
            case PieceType.City:       return buildRules.validateCity(target, playerId, shared);
            case PieceType.Road:       return buildRules.validateRoad(target, playerId, shared);
        }
    },

    validateSettlement: (
        target:   BuildTarget,
        playerId: string,
        shared:   SharedState,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                                   return BuildRejectionReason.INVALID_LOCATION;
        if (!shared.board.hexGrid.isValidVertex(target.vertex))        return BuildRejectionReason.INVALID_LOCATION;
        if (shared.board.placementMap.isVertexOccupied(target.vertex))  return BuildRejectionReason.SPOT_OCCUPIED;
        if (!shared.board.placementMap.respectsDistanceRule(target.vertex)) return BuildRejectionReason.DISTANCE_RULE_VIOLATED;
        if (!shared.isSetupPhase &&
            !shared.board.placementMap.hasAdjacentRoad(target.vertex, playerId)) return BuildRejectionReason.NO_ADJACENT_ROAD;
        return null;
    },

    validateCity: (
        target:   BuildTarget,
        playerId: string,
        shared:   SharedState,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'vertex')                                   return BuildRejectionReason.INVALID_LOCATION;
        if (!shared.board.hexGrid.isValidVertex(target.vertex))        return BuildRejectionReason.INVALID_LOCATION;
        if (!shared.board.placementMap.hasOwnSettlement(target.vertex, playerId)) return BuildRejectionReason.NO_SETTLEMENT_TO_UPGRADE;
        return null;
    },

    validateRoad: (
        target:   BuildTarget,
        playerId: string,
        shared:   SharedState,
    ): BuildRejectionReason | null => {
        if (target.kind !== 'edge')                                     return BuildRejectionReason.INVALID_LOCATION;
        if (!shared.board.hexGrid.isValidEdge(target.edge))            return BuildRejectionReason.INVALID_LOCATION;
        if (shared.board.placementMap.isEdgeOccupied(target.edge))      return BuildRejectionReason.SPOT_OCCUPIED;
        if (!shared.board.placementMap.hasAdjacentRoadOrSettlement(target.edge, playerId)) return BuildRejectionReason.NO_ADJACENT_ROAD;
        return null;
    },
};