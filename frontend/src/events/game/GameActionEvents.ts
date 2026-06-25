import {ACTION, DOT_SEPARATOR} from "@/events/shared/RootEventNamespaces.ts";
import type {EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";

export const GAME_ACTION = `${ACTION}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}`;
export const BUILD_GAME_ACTION = `${GAME_ACTION}build${DOT_SEPARATOR}`;
export const DEVELOPMENT_CARD_GAME_ACTION = `${GAME_ACTION}developmentCard${DOT_SEPARATOR}`;
export const TURN_GAME_ACTION = `${GAME_ACTION}turn${DOT_SEPARATOR}`;

export const GameActionEvents = {
    state: `${GAME_ACTION}state`,
    diceRoll: `${GAME_ACTION}diceRoll`,
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
} as const;