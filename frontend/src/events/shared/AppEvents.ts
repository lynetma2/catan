import {LobbyActionEvents} from "@/events/lobby/LobbyActionEvents";

import {LobbyServerEvents} from "@/events/lobby/LobbyServerEvents";
import type {GameActionEventMap} from "@/events/game/GameActionEvents.ts";
import type {GameUiEventMap} from "@/events/game/GameUiEvents.ts";
import type {GameServerEventMap} from "@/events/game/GameServerEvents.ts";

export const AppEvents = {
    action: {
        lobby: LobbyActionEvents,
    },
    server: {
        lobby: LobbyServerEvents,
    },
} as const;

export type GameEventMap =
    & GameActionEventMap
    & GameUiEventMap
    & GameServerEventMap;