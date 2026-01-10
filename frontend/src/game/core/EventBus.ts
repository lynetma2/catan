import type {GameEvent} from "@/game/model/events.ts";

export class EventBus {
    private eventQueue: GameEvent[] = [];

    public emit(event: GameEvent): void {
        this.eventQueue.push(event);
    }

    public poll(): GameEvent[] {
        const events = this.eventQueue;
        this.eventQueue = [];
        return events;
    }
}