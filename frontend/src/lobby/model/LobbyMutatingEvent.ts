// In LobbyMutatingEvent.ts
import type {LobbyEventPayloads} from "@/events/lobby/LobbyPayloads.ts";
import {LobbyEventType} from "@/events/lobby/LobbyEvents.ts";

// Helper: extract only the keys you want
type MutatingEventKeys =
    | typeof LobbyEventType.server.playerJoined
    | typeof LobbyEventType.server.playerReady
    | typeof LobbyEventType.server.playerUnready
    | typeof LobbyEventType.server.playerDisconnected
    | typeof LobbyEventType.server.state;

// Build the discriminated union
export type LobbyMutatingEvent = {
    [K in MutatingEventKeys]: {
    type: K;
} & LobbyEventPayloads[K];
}[MutatingEventKeys];