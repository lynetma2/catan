
export interface WorldEventPayloads {
    DICE_ROLLED:             { values: [number, number]; total: number };
}

export type BuildRejectionReason =
    | 'NO_ADJACENT_ROAD'
    | 'INSUFFICIENT_RESOURCES'
    | 'SPOT_OCCUPIED';

// The subset of event names this file owns
export type WorldEventType = keyof WorldEventPayloads;