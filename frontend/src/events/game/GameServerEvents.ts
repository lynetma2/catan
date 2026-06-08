import {DOT_SEPARATOR, SERVER} from "@/events/shared/RootEventNamespaces.ts";
import type {DeepValues, EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import type {GameSnapshot} from "@/game/core/types.ts";

export const GAME_SERVER = `${SERVER}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}` as const;

export const GameServerEvents = {
    state: {
        success: `${GAME_SERVER}state`,
    }
} as const;

export interface LobbyServerEventMap {
    [GameServerEvents.state.success]: {
        lobbyId: string;
        snapshot: GameSnapshot;
        localPlayerId: string;
    };
}

export type GameServerEventValues =
    DeepValues<typeof GameServerEvents>;

export type LobbyServerEvent =
    EventUnion<LobbyServerEventMap>;