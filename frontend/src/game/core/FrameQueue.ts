import type {EventBus, EventOf} from "@/game/core/EventBus.ts";

export class FrameQueue<TEvents extends Record<string, any>> {
    private readonly queue: EventOf<TEvents, keyof TEvents>[] = [];

    push<TKey extends keyof TEvents>(
        event: EventOf<TEvents, TKey>
    ) {
        this.queue.push(event);
    }

    flush(bus: EventBus<TEvents>) {
        const events = this.queue.splice(0); // drain atomically

        for (const event of events) {
            console.log("Emitting event from framequeue: ", event);
            bus.emit(event);
        }
    }
}