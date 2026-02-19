// events/NetworkEvents.ts
export interface NetworkEventPayloads {
    PLAYER_JOINED:       { playerId: string; name: string };
    PLAYER_DISCONNECTED: { playerId: string };
    TURN_STARTED:        { playerId: string };
    TURN_ENDED:          { playerId: string };
}

export type NetworkEventType = keyof NetworkEventPayloads;