import { ACTION, DOT_SEPARATOR, PLAYER } from "@/events/shared/RootEventNamespaces.ts";
import { LOBBY } from "@/events/lobby/LobbyNamespace.ts";
import type {EventsFromGroup, EventUnion} from "@/events/shared/EventTypes.ts";

export const LOBBY_ACTION = `${ACTION}${DOT_SEPARATOR}${LOBBY}${DOT_SEPARATOR}`;
export const PLAYER_LOBBY_ACTION = `${LOBBY_ACTION}${PLAYER}${DOT_SEPARATOR}`;

export const LobbyActionEvents = {
    create: `${LOBBY_ACTION}create`,
    join: `${LOBBY_ACTION}join`,
    reconnect: `${LOBBY_ACTION}reconnect`,
    start: `${LOBBY_ACTION}start`,
    player: {
        ready: `${PLAYER_LOBBY_ACTION}ready`,
        unready: `${PLAYER_LOBBY_ACTION}unready`,
    },
} as const;

// Flat event map – each leaf event name maps to its payload type
export interface LobbyActionEventMap {
    [LobbyActionEvents.create]: { playerName: string };
    [LobbyActionEvents.join]: { playerName: string };
    [LobbyActionEvents.reconnect]: { lobbyId: string };
    [LobbyActionEvents.start]: Record<never, never>;
    [LobbyActionEvents.player.ready]: Record<never, never>;   // no payload
    [LobbyActionEvents.player.unready]: Record<never, never>; // no payload
}

export type LobbyActionEvent = EventUnion<LobbyActionEventMap>;

export type LobbyPlayerActionEvent =
    EventsFromGroup<LobbyActionEvent, typeof LobbyActionEvents.player>

export const LobbyActionEventCreators = {
    create(playerName: string) {
        return {
            type: LobbyActionEvents.create,
            payload: { playerName },
        };
    },

    join(playerName: string) {
        return {
            type: LobbyActionEvents.join,
            payload: { playerName },
        };
    },

    reconnect(lobbyId: string) {
        return {
            type: LobbyActionEvents.reconnect,
            payload: { lobbyId },
        };
    },

    start() {
        return {
            type: LobbyActionEvents.start,
            payload: undefined,
        }
    },

    player: {
        ready() {
            return {
                type: LobbyActionEvents.player.ready,
                payload: undefined,
            };
        },

        unready() {
            return {
                type: LobbyActionEvents.player.unready,
                payload: undefined,
            };
        },
    },
} as const;