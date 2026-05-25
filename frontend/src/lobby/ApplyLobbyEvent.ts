import type { Lobby } from "../datalayer/domain/lobby/Lobby.ts";

import type {
    LobbyPlayerServerEvent,
} from "@/events/lobby/LobbyServerEvents";

import { LobbyServerEvents } from "@/events/lobby/LobbyServerEvents";

/**
 * -------------------------------------------------------
 * 1. CORE HANDLER TYPE
 * -------------------------------------------------------
 */
type HandlerMap = {
    [E in LobbyPlayerServerEvent as E["type"]]: (
        lobby: Lobby,
        event: E
    ) => Lobby;
};

/**
 * -------------------------------------------------------
 * 2. PLAYER HANDLERS (modular section)
 * -------------------------------------------------------
 */
const playerHandlers: HandlerMap = {
    [LobbyServerEvents.player.join.success]: (lobby, event) => {
        const players = new Map(lobby.players);

        players.set(event.payload.playerId, {
            playerId: event.payload.playerId,
            username: event.payload.playerName,
            isReady: false,
            isLeader: false,
        });

        return {
            ...lobby,
            players,
        };
    },

    [LobbyServerEvents.player.ready.success]: (lobby, event) => {
        const players = new Map(lobby.players);

        const player = players.get(event.payload.playerId);
        if (!player) return lobby;

        players.set(event.payload.playerId, {
            ...player,
            isReady: true,
        });

        return {
            ...lobby,
            players,
        };
    },

    [LobbyServerEvents.player.unready.success]: (lobby, event) => {
        const players = new Map(lobby.players);

        const player = players.get(event.payload.playerId);
        if (!player) return lobby;

        players.set(event.payload.playerId, {
            ...player,
            isReady: false,
        });

        return {
            ...lobby,
            players,
        };
    },

    [LobbyServerEvents.player.disconnect.success]: (lobby) => {
        return lobby;
    },

    [LobbyServerEvents.player.reconnect.success]: (lobby) => {
        return lobby;
    },

    [LobbyServerEvents.player.reconnect.rejected]: (lobby) => {
        return lobby;
    },

    [LobbyServerEvents.player.join.rejected]: (lobby) => {
        return lobby;
    }
};

/**
 * -------------------------------------------------------
 * 3. SYSTEM HANDLERS (optional future expansion)
 * -------------------------------------------------------
 * You can move server/state events here later.
 */
const systemHandlers: Partial<HandlerMap> = {
    // Example (future use):
    // [LobbyServerEvents.state.success]: (lobby, event) => ...
};

/**
 * -------------------------------------------------------
 * 4. FINAL HANDLER REGISTRY
 * -------------------------------------------------------
 */
const handlers: HandlerMap = {
    ...playerHandlers,
    ...systemHandlers,
};

/**
 * -------------------------------------------------------
 * 5. APPLY FUNCTION (NO SWITCH, NO assertNever)
 * -------------------------------------------------------
 */
export function applyLobbyEvent(
    lobby: Lobby,
    event: LobbyPlayerServerEvent
): Lobby {

    const handler =
        handlers[event.type];

    return handler(lobby, event);
}