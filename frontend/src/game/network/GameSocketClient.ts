import {Client, type IMessage} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import {GameSocketInboundHandler} from "@/game/network/GameSocketInboundHandler.ts";
import {GameSocketOutboundHandler} from "@/game/network/GameSocketOutboundHandler.ts";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:8080/ws";

/**
 * Owns the full WebSocket lifecycle for one game session.
 *
 * Wires together:
 *  - GameSocketInboundHandler  (STOMP → FrameQueue)
 *  - GameSocketOutboundHandler (EventBus → STOMP)
 */
export class GameSocketConnection {
    private readonly client: Client;
    private readonly inbound: GameSocketInboundHandler;
    private readonly outbound: GameSocketOutboundHandler;

    constructor(
        private readonly gameId: string,
        bus: EventBus,
        frameQueue: FrameQueue,
    ) {
        this.inbound = new GameSocketInboundHandler(frameQueue);

        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL) as WebSocket,

            onConnect: () => {
                console.info(`%c[WS] Connected — game: ${this.gameId}`, "color: #50c050");
                this.subscribe();
                bus.emit({ type: GameEventType.REQUEST_GAME_STATE, payload: {}, source: GameEventSource.Network });
            },

            onDisconnect: () => {
                console.warn(`[WS] Disconnected — game: ${this.gameId}`);
            },

            onStompError: (frame) => {
                console.error("[WS] STOMP error", frame.headers["message"], frame.body);
            },

            onWebSocketError: (event) => {
                console.error("[WS] WebSocket error", event);
            },

            reconnectDelay: 0,
        });

        // Outbound handler is created after the client so the publish
        // callback can safely close over `this.client`
        this.outbound = new GameSocketOutboundHandler(
            gameId,
            bus,
            (destination, payload) => this.publish(destination, payload),
        );

        this.client.activate();
    }

    public destroy(): void {
        this.outbound.destroy();
        this.client.deactivate().catch((err) => {
            console.error("[WS] Error during deactivation", err);
        });
    }

    // ── Private ────────────────────────────────────────────────────────

    private subscribe(): void {
        this.client.subscribe(
            `/topic/game/${this.gameId}`,
            (msg) => this.onMessage(msg),
        );

        this.client.subscribe(
            `/user/queue/game/${this.gameId}`,
            (msg) => this.onMessage(msg),
        );
    }

    private publish(destination: string, payload: unknown): void {
        if (!this.client.connected) {
            console.warn(`[WS] Cannot send to "${destination}" — not connected`);
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(payload),
            headers: { "content-type": "application/json" },
        });
    }

    private onMessage(msg: IMessage): void {
        try {
            const payload = JSON.parse(msg.body);
            const messageType: string = msg.headers["message-type"] ?? payload?.type;

            if (!messageType) {
                console.warn("[WS] Received message with no type", payload);
                return;
            }

            this.inbound.handle(messageType, payload);
        } catch (err) {
            console.error("[WS] Failed to parse message", msg.body, err);
        }
    }
}