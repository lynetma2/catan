import type {EventBus} from "@/game/core/EventBus";
import {GameActionEvents} from "@/events/game/GameActionEvents";

/**
 * All GameActionEvents → STOMP (single endpoint)
 */
export class GameSocketOutboundHandler {
    private readonly unsubscribers: Array<() => void> = [];
    private readonly publishDestination: string;

    // The bus is now typed loosely so it can accept the combined bus,
    // but inside we only ever listen to action events (safe).
    constructor(
        private readonly gameId: string,
        private readonly bus: EventBus<any>,
        private readonly publish: (destination: string, payload: unknown) => void,
    ) {
        this.publishDestination = `/app/game/${this.gameId}/events`;
        this.register();
    }

    public destroy(): void {
        this.unsubscribers.forEach(fn => fn());
        this.unsubscribers.length = 0;
    }

    private register(): void {
        console.log("Registering outbound handler (auto-listen mode)");

        const forward = (event: any) => {
            this.publish(this.publishDestination, event);
        };

        const actionEvents = this.collectActionEvents(GameActionEvents);

        for (const eventType of actionEvents) {
            // We know these are valid keys of GameActionEventMap
            const handler = (payload: any) => {
                forward({type: eventType, payload});
            };

            this.bus.on(eventType as any, handler);
            this.unsubscribers.push(() =>
                this.bus.off(eventType as any, handler)
            );
        }
    }

    private collectActionEvents(obj: any): string[] {
        const result: string[] = [];
        for (const value of Object.values(obj)) {
            if (typeof value === "string") {
                result.push(value);
            } else if (typeof value === "object") {
                result.push(...this.collectActionEvents(value));
            }
        }
        return result;
    }
}