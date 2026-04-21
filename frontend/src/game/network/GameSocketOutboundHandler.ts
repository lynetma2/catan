import type { EventBus } from "@/game/core/EventBus.ts";
import {type GameEvent, GameEventType} from "@/game/events/GameEventTypes.ts";

type PublishFn = (destination: string, payload: unknown) => void;

/**
 * Subscribes to the EventBus and translates local GameEvents into
 * outbound STOMP messages via the publish callback supplied by
 * GameSocketConnection.
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
        this.unsubscribers.forEach(fn => fn());
        this.unsubscribers.length = 0;
    }

    // ── Private ────────────────────────────────────────────────────────

    private register(): void {
        this.on(GameEventType.REQUEST_GAME_STATE, () => {
            this.publish(`/app/game/${this.gameId}/snapshot`, {});
        });

        // ── Extend here as the backend grows ──────────────────────────
        // this.on(GameEventType.PLAYER_MOVE, (event) => {
        //     this.publish(`/app/game/${this.gameId}/move`, event.payload);
        // });
    }

    private on<T extends GameEventType>(type: T, handler: (event: GameEvent<T>) => void): void {
        this.bus.on(type, handler);
        this.unsubscribers.push(() => this.bus.off(type, handler));
    }
}