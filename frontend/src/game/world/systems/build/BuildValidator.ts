

// ─── Interface ────────────────────────────────────────────────────────

import type {BuildTarget, PieceType} from "@/game/core/types.ts";
import type {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";
import type {Board} from "@/game/world/board/Board.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {type BuildContext, buildRules} from "@/game/world/systems/build/BuildRules.ts";

export interface BuildValidator {
    validate: (pieceType: PieceType, target: BuildTarget, playerId: string) => BuildRejectionReason | null;
    canBuild: (pieceType: PieceType, target: BuildTarget, playerId: string) => boolean;
}

// ─── Factory ──────────────────────────────────────────────────────────

export function createBuildValidator(
    board:     Board,
    shared:    SharedState
): BuildValidator {
    // Context created once — arrow functions close over live object references
    // so state is always current at validation time
    const context: BuildContext = {
        board: {
            isValidVertex:               v     => board.hexGrid.isValidVertex(v),
            isValidEdge:                 e     => board.hexGrid.isValidEdge(e),
            isVertexOccupied:            v     => board.placementMap.isVertexOccupied(v),
            isEdgeOccupied:              e     => board.placementMap.isEdgeOccupied(e),
            hasAdjacentRoad:             (v,p) => board.placementMap.hasAdjacentRoad(v, p),
            hasAdjacentRoadOrSettlement: (e,p) => board.placementMap.hasAdjacentRoadOrSettlement(e, p),
            respectsDistanceRule:        v     => board.placementMap.respectsDistanceRule(v),
            hasOwnSettlement:            (v,p) => board.placementMap.hasOwnSettlement(v, p),
        },
        player: {
            canAfford: (playerId, cost) => {
                const resources = shared.players.get(playerId)?.resources ?? [];
                return (Object.keys(cost) as (keyof typeof cost)[])
                    .every(type =>
                        resources
                            .filter(r => r.resourceType === type)
                            .length >= (cost[type] ?? 0)
                    );
            },
        },
        gamePhase: {
            isPlayersTurn:   id => shared.isPlayersTurn(id),
            isBuildingPhase: ()  => shared.isBuildingPhase,
            isSetupPhase:    ()  => shared.isSetupPhase,
            canRollDice:     ()  => shared.canRollDice,
            mustPlaceRobber: ()  => shared.mustPlaceRobber,
        },
    };

    return {
        validate: (pieceType, target, playerId) =>
            buildRules.validate(pieceType, target, playerId, context),

        canBuild: (pieceType, target, playerId) =>
            buildRules.validate(pieceType, target, playerId, context) === null,
    };
}