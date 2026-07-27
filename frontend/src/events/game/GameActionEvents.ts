import {ACTION, DOT_SEPARATOR} from "@/events/shared/RootEventNamespaces.ts";
import type {EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";

export const GAME_ACTION = `${ACTION}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}`;
export const BUILD_GAME_ACTION = `${GAME_ACTION}build${DOT_SEPARATOR}`;
export const DEVELOPMENT_CARD_GAME_ACTION = `${GAME_ACTION}developmentCard${DOT_SEPARATOR}`;
export const TURN_GAME_ACTION = `${GAME_ACTION}turn${DOT_SEPARATOR}`;
export const ROBBER_GAME_ACTION = `${GAME_ACTION}robber${DOT_SEPARATOR}`;
export const RESOURCE_GAME_ACTION = `${GAME_ACTION}resource${DOT_SEPARATOR}`;

export const GameActionEvents = {
    state: `${GAME_ACTION}state`,
    diceRoll: `${GAME_ACTION}dice${DOT_SEPARATOR}roll`,
    build: {
        settlement: `${BUILD_GAME_ACTION}settlement`,
        road: `${BUILD_GAME_ACTION}road`,
        city: `${BUILD_GAME_ACTION}city`,
    },
    developmentCard: {
        draw: `${DEVELOPMENT_CARD_GAME_ACTION}draw`,
    },
    turn: {
        end: `${TURN_GAME_ACTION}end`,
    },
    robber: {
        place: `${ROBBER_GAME_ACTION}place`,
        steal: `${ROBBER_GAME_ACTION}steal`,
    },
    resource: {
        discard: `${RESOURCE_GAME_ACTION}discard`,
    }
} as const;

// Flat event map – each leaf event name maps to its payload type
export interface GameActionEventMap {
    [GameActionEvents.state]: Record<never, never>;
    [GameActionEvents.diceRoll]: Record<never, never>;
    [GameActionEvents.build.settlement]: { target: Vertex };
    [GameActionEvents.build.road]: { target: Edge };
    [GameActionEvents.build.city]: { target: Vertex };
    [GameActionEvents.developmentCard.draw]: Record<never, never>;
    [GameActionEvents.turn.end]: Record<never, never>;
    [GameActionEvents.robber.place]: { target: Hex };
    [GameActionEvents.robber.steal]: { targetPlayerId: string };
    [GameActionEvents.resource.discard]: { discardedResources: string[] };
}

export type GameActionEvent = EventUnion<GameActionEventMap>;

export const GameActionEventCreators = {
    state() {
        return {
            type: GameActionEvents.state,
            payload: undefined,
        }
    },
    diceRoll() {
        return {
            type: GameActionEvents.diceRoll,
            payload: undefined,
        }
    },
    placeSettlement(target: Vertex) {
        return {
            type: GameActionEvents.build.settlement,
            payload: {
                target,
            },
        }
    },
    placeRoad(target: Edge) {
        return {
            type: GameActionEvents.build.road,
            payload: {
                target,
            },
        }
    },
    placeCity(target: Vertex) {
        return {
            type: GameActionEvents.build.city,
            payload: {
                target,
            },
        }
    },
    placeRobber(target: Hex) {
        return {
            type: GameActionEvents.robber.place,
            payload: {
                target,
            }
        }
    },
    drawDevelopmentCard() {
        return {
            type: GameActionEvents.developmentCard.draw,
            payload: undefined,
        }
    },
    endTurn() {
        return {
            type: GameActionEvents.turn.end,
            payload: undefined,
        }
    },
    discard(discardedResources: string[]) {
        return {
            type: GameActionEvents.resource.discard,
            payload: {
                discardedResources,
            },
        }
    }
} as const;