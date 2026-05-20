import type {EventOfPayloadMap, EventOfPrefix} from "@/events/shared/EventUtils.ts";

import type {LobbyEventPayloads} from "@/events/lobby/LobbyPayloads.ts";

export type LobbyEvent =
    EventOfPayloadMap<LobbyEventPayloads>;

export type LobbyClientAction =
    EventOfPrefix<
        LobbyEvent,
        'action'
    >;

export type LobbyServerEvent =
    EventOfPrefix<
        LobbyEvent,
        'server'
    >;