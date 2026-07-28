import type {EventBus, EventOf} from "@/game/core/EventBus.ts";

export class FrameQueue<TEvents extends Record<string, any>> {
    private readonly queue: EventOf<TEvents, keyof TEvents>[] = [];
    private readonly MAX_QUEUE_SIZE = 500;

    push<TKey extends keyof TEvents>(
        event: EventOf<TEvents, TKey>
    ) {
        if (this.queue.length >= this.MAX_QUEUE_SIZE) {
            console.warn("[FrameQueue] Queue limit reached, dropping oldest event");
            this.queue.shift();
        }
        this.queue.push(event);
    }

    clear() {
        this.queue.length = 0;
    }

    flush(bus: EventBus<TEvents>) {
        const events = this.queue.splice(0); // drain atomically

        for (const event of events) {
            console.log("Emitting event from framequeue: ", event);
            bus.emit(event);
        }
    }
}