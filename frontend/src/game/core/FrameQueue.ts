import type {GameEvent} from "@/game/events/GameEventTypes.ts";
import type {EventBus} from "@/game/core/EventBus.ts";

export class FrameQueue {
    private readonly queue: GameEvent[] = [];

    push(event: GameEvent) {
        this.queue.push(event);
    }

    flush(bus: EventBus) {
        const events = this.queue.splice(0); // drain atomically
        for (const event of events) {
            console.log("Emitting event from framequeue: ", event);
            bus.emit(event);
        }
    }
}