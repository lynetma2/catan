import {SERVER, DOT_SEPARATOR, PLAYER} from "@/events/shared/RootEventNamespaces.ts";
import type {DeepValues, EventsFromGroup, EventUnion} from "@/events/shared/EventTypes.ts";
import type {Lobby} from "@/datalayer/domain/lobby/Lobby.ts";

export const LOBBY = "lobby" as const;
export const LOBBY_SERVER = `${SERVER}${DOT_SEPARATOR}${LOBBY}${DOT_SEPARATOR}` as const;
export const PLAYER_LOBBY_SERVER = `${LOBBY_SERVER}${PLAYER}${DOT_SEPARATOR}` as const;

export const LobbyServerPlayerEvents = {
    disconnect: {
        success: `${PLAYER_LOBBY_SERVER}disconnect`,
    },
    reconnect: {
        success: `${PLAYER_LOBBY_SERVER}reconnect`,
        rejected: `${PLAYER_LOBBY_SERVER}reconnect.rejected`,
    },
    join: {
        success: `${PLAYER_LOBBY_SERVER}join`,
        rejected: `${PLAYER_LOBBY_SERVER}join.rejected`,
    },
    ready: {
        success: `${PLAYER_LOBBY_SERVER}ready`,
    },
    unready: {
        success: `${PLAYER_LOBBY_SERVER}unready`,
    }
} as const;

export const LobbyServerEvents = {
    initialized: {
        success: `${LOBBY_SERVER}initialized`,
        rejected: `${LOBBY_SERVER}initialized.rejected`,
        error: `${LOBBY_SERVER}initialized.error`,
    },
    start: {
        rejected: `${LOBBY_SERVER}start.rejected`,
    },
    state: {
        success: `${LOBBY_SERVER}state`,
    },
    player: LobbyServerPlayerEvents
} as const;

export interface LobbyServerEventMap {
    [LobbyServerEvents.initialized.success]: Record<never, never>;  // empty payload
    [LobbyServerEvents.initialized.rejected]: { reason: string };
    [LobbyServerEvents.initialized.error]: { message: string };
    [LobbyServerEvents.start.rejected]: { reason: string };
    [LobbyServerEvents.state.success]: {
        lobbyId: string;
        snapshot: Lobby;
        localPlayerId: string;
    };

    [LobbyServerEvents.player.disconnect.success]: { playerId: string };
    [LobbyServerEvents.player.reconnect.success]: { playerId: string };
    [LobbyServerEvents.player.reconnect.rejected]: { reason: string };
    [LobbyServerEvents.player.join.success]: { playerId: string; playerName: string };
    [LobbyServerEvents.player.join.rejected]: { reason: string };
    [LobbyServerEvents.player.ready.success]: { playerId: string };
    [LobbyServerEvents.player.unready.success]: { playerId: string };
}

export type LobbyServerEventValues =
    DeepValues<typeof LobbyServerEvents>;

export type LobbyServerEvent =
    EventUnion<LobbyServerEventMap>;

export type LobbyPlayerServerEvent =
    EventsFromGroup<
        LobbyServerEvent,
        typeof LobbyServerEvents.player
    >;