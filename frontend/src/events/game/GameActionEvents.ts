import {ACTION, DOT_SEPARATOR} from "@/events/shared/RootEventNamespaces.ts";
import type {EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";

export const GAME_ACTION = `${ACTION}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}`;

export const GameActionEvents = {
    state: `${GAME_ACTION}state`,
} as const;

// Flat event map – each leaf event name maps to its payload type
export interface GameActionEventMap {
    [GameActionEvents.state]: Record<never, never>;
}

export type GameActionEvent = EventUnion<GameActionEventMap>;

export const LobbyActionEventCreators = {
    state() {
        return {
            type: GameActionEvents.state,
            payload: undefined,
        }
    },
} as const;