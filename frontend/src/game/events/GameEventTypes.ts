import type {NetworkEventPayloads} from "@/game/events/NetworkEvents.ts";
import type {HudEventPayloads} from "@/game/events/HudEvents.ts";
import type {WorldEventPayloads} from "@/game/events/WorldEvents.ts";

export enum GameEventSources {
    HUD = "hud",
    World = "world",
    Network = "Network",
    Input = "input"
}

export interface GameEvent<T extends GameEventType = GameEventType> {
    type: T;
    payload: EventPayloads[T];
    source: GameEventSources;
}

export type EventPayloads = WorldEventPayloads & HudEventPayloads & NetworkEventPayloads;

export type GameEventType = keyof EventPayloads;