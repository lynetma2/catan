import type {EventBus} from "@/game/core/EventBus.ts";
import type {GameActionEvent} from "@/events/game/GameActionEvents.ts";
import {GameActionEvents, LobbyActionEventCreators,} from "@/events/game/GameActionEvents.ts";

type PublishFn = (destination: string, payload: unknown) => void;

/**
 * Subscribes to the EventBus and translates local GameActionEvents into
 * outbound STOMP messages via the publish callback supplied by GameSocketConnection.
 *
 * Mirrors GameSocketMessageHandler:
 *   Inbound:  STOMP → FrameQueue → EventBus  (GameSocketMessageHandler)
 *   Outbound: EventBus → STOMP publish        (GameSocketOutboundHandler)
 *
 * Add a new subscription here for every client → server message type.
 */
export class GameSocketOutboundHandler {
    private readonly unsubscribers: Array<() => void> = [];

    constructor(
        private readonly gameId: string,
        private readonly bus: EventBus,
        private readonly publish: PublishFn,
    ) {
        this.register();
    }

    public destroy(): void {
        this.unsubscribers.forEach((fn) => fn());
        this.unsubscribers.length = 0;
    }

    // ── Private ────────────────────────────────────────────────────────

    private register(): void {
        console.log("Registering outbound handler");

        // Request game state (client → server)
        this.on(GameActionEvents.state, () => {
            console.log(`Sending REQUEST_GAME_STATE for game ${this.gameId}`);
            this.publish(
                `/app/game/${this.gameId}/events`,
                LobbyActionEventCreators.state(),
            );
        });

        // ── Extend here as the backend grows ──────────────────────────────
        // this.on(GameActionEvents.move, (event) => {
        //   this.publish(`/app/game/${this.gameId}/move`, event.payload);
        // });
    }

    /**
     * Type-safe subscription helper.
     * @param type - One of the known GameActionEvent types
     * @param handler - Callback receiving the full event object
     */
    private on<T extends GameActionEvent["type"]>(
        type: T,
        handler: (event: Extract<GameActionEvent, { type: T }>) => void,
    ): void {
        this.bus.on(type, handler);
        this.unsubscribers.push(() => this.bus.off(type, handler));
    }
}