import {DOT_SEPARATOR, SERVER} from "@/events/shared/RootEventNamespaces.ts";
import type {DeepValues, EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import {GamePhase, type GameSnapshot, type PieceType, type Resource} from "@/game/core/types.ts";
import {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";

export const GAME_SERVER = `${SERVER}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}` as const;
export const BUILD_GAME_SERVER = `${GAME_SERVER}build${DOT_SEPARATOR}` as const;
export const DICE_GAME_SERVER = `${GAME_SERVER}dice${DOT_SEPARATOR}` as const;
export const OVERVIEW_GAME_SERVER = `${GAME_SERVER}overview${DOT_SEPARATOR}` as const;
export const RESOURCE_GAME_SERVER = `${GAME_SERVER}resource${DOT_SEPARATOR}` as const;
export const TURN_GAME_SERVER = `${GAME_SERVER}turn${DOT_SEPARATOR}` as const;
export const ROBBER_GAME_SERVER = `${GAME_SERVER}robber${DOT_SEPARATOR}` as const;
export const STATE_GAME_SERVER = `${GAME_SERVER}state${DOT_SEPARATOR}` as const;

export const GameServerEvents = {
    state: {
        full: {
            success: `${STATE_GAME_SERVER}full`,
        },
        end: {
            success: `${STATE_GAME_SERVER}end`,
        },
        phase: {
            change: {
                success: `${STATE_GAME_SERVER}phase.change`,
            }
        }
    },
    build: {
        settlement: {
            success: `${BUILD_GAME_SERVER}settlement`,
            rejected: `${BUILD_GAME_SERVER}settlement.rejected`,
        },
        road: {
            success: `${BUILD_GAME_SERVER}road`,
            rejected: `${BUILD_GAME_SERVER}road.rejected`,
        },
        city: {
            success: `${BUILD_GAME_SERVER}city`,
            rejected: `${BUILD_GAME_SERVER}city.rejected`,
        },
    },
    dice: {
        roll: {
            success: `${DICE_GAME_SERVER}roll`,
            rejected: `${DICE_GAME_SERVER}roll.rejected`,
        }
    },
    overview: {
        largestArmy: {
            success: `${OVERVIEW_GAME_SERVER}largestArmy`,
        },
        longestRoad: {
            success: `${OVERVIEW_GAME_SERVER}longestRoad`,
        },
        victoryPoint: {
            success: `${OVERVIEW_GAME_SERVER}victoryPoint`,
        },
        opponentCard: {
            success: `${OVERVIEW_GAME_SERVER}opponentCard`,
        }
    },
    resource: {
        grant: {
            success: `${RESOURCE_GAME_SERVER}grant`,
        },
        spent: {
            success: `${RESOURCE_GAME_SERVER}spent`,
        },
        discardRequired: {
            success: `${RESOURCE_GAME_SERVER}discardRequired`,
        },
        discardCards: {
            success: `${RESOURCE_GAME_SERVER}discardCards`,
        },
        discardComplete: {
            success: `${RESOURCE_GAME_SERVER}discardComplete`,
        }
    },
    turn: {
        end: {
            success: `${TURN_GAME_SERVER}end`,
        },
        start: {
            success: `${TURN_GAME_SERVER}start`,
        }
    },
    robber: {
        placed: {
            success: `${ROBBER_GAME_SERVER}place`
        },
        stealTargetRequired: {
            success: `${ROBBER_GAME_SERVER}stealTargetRequired`,
        }
    }
} as const;

export interface GameServerEventMap {
    [GameServerEvents.state.full.success]: {
        lobbyId: string;
        snapshot: GameSnapshot;
        localPlayerId: string;
    };
    [GameServerEvents.state.end.success]: Record<never, never>;
    [GameServerEvents.state.phase.change.success]: { phase: GamePhase };
    [GameServerEvents.build.settlement.success]: { pieceType: PieceType; vertex: Vertex; playerId: string };
    [GameServerEvents.build.settlement.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.build.road.success]: { pieceType: PieceType; edge: Edge; playerId: string };
    [GameServerEvents.build.road.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.build.city.success]: { pieceType: PieceType; vertex: Vertex; playerId: string };
    [GameServerEvents.build.city.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.dice.roll.success]: { diceRoll: { values: [number, number] } };
    [GameServerEvents.dice.roll.rejected]: { reason: string };
    [GameServerEvents.overview.largestArmy.success]: { playerId: string, value: number };
    [GameServerEvents.overview.longestRoad.success]: { playerId: string, value: number };
    [GameServerEvents.overview.victoryPoint.success]: { playerId: string, value: number };
    [GameServerEvents.overview.opponentCard.success]: { playerId: string, value: number };
    [GameServerEvents.resource.grant.success]: { playerId: string; resources: Resource[] };
    [GameServerEvents.resource.spent.success]: { playerId: string; resources: Resource[] };
    [GameServerEvents.resource.discardRequired.success]: { playerId: string, amount: number };
    [GameServerEvents.resource.discardCards.success]: { playerId: string, resources: Resource[] };
    [GameServerEvents.resource.discardComplete.success]: { playerId: string };
    [GameServerEvents.turn.end.success]: { playerId: string };
    [GameServerEvents.turn.start.success]: { playerId: string };
    [GameServerEvents.robber.placed.success]: { playerId: string, hex: Hex };
    [GameServerEvents.robber.stealTargetRequired.success]: { candidates: string[] };
}

export type GameServerEventValues =
    DeepValues<typeof GameServerEvents>;

export type GameServerEvent =
    EventUnion<GameServerEventMap>;