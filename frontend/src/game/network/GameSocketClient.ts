import {Client, type IMessage} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import {GameSocketInboundHandler} from "@/game/network/GameSocketInboundHandler.ts";
import {GameSocketOutboundHandler} from "@/game/network/GameSocketOutboundHandler.ts";
import type {WebSocketContextValue} from "@/WebSocketContext.ts";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:8080/ws";

/**
 * Owns the full WebSocket lifecycle for one game session.
 *
 * Wires together:
 *  - GameSocketInboundHandler  (STOMP → FrameQueue)
 *  - GameSocketOutboundHandler (EventBus → STOMP)
 */
export class GameSocketConnection {
    private readonly inbound: GameSocketInboundHandler;
    private readonly outbound: GameSocketOutboundHandler;
    private readonly webSocket: WebSocketContextValue;

    constructor(
        private readonly gameId: string,
        webSocket: WebSocketContextValue,
        bus: EventBus,
        frameQueue: FrameQueue,
    ) {
        this.webSocket = webSocket;
        this.inbound = new GameSocketInboundHandler(frameQueue);

        this.outbound = new GameSocketOutboundHandler(
            gameId,
            bus,
            (destination, payload) => this.webSocket.sendMessage(destination, payload),
        );

        if (this.webSocket.isConnected) {
            //Setup the subscribers, and ask for the initial game state.
            this.subscribe();
            this.requestFullState(bus);
        } else {
            this.webSocket.onConnect(() => {
                console.info(`%c[WS] Connected — game: ${this.gameId}`, "color: #50c050");
                //Setup the subscribers, and ask for the initial game state.
                this.subscribe();
                this.requestFullState(bus);
            })
        }
    }

    public destroy(): void {
        this.outbound.destroy();
    }

    // ── Private ────────────────────────────────────────────────────────

    private subscribe(): void {
        //Everything
        this.webSocket.subscribe(
            `/topic/game/${this.gameId}`,
            (msg) => this.onMessage(msg),
        );

        //Private messages
        this.webSocket.subscribe(
            `/user/queue/game`,
            (msg) => this.onMessage(msg),
        );
    }

    private onMessage(msg: IMessage): void {
        try {
            const payload = JSON.parse(msg.body);
            const messageType: string = msg.headers["message-type"] ?? payload?.type;

            if (!messageType) {
                console.warn("[WS] Received message with no type", payload);
                return;
            }

            console.log("Got a message", payload);

            this.inbound.handle(messageType, payload);
        } catch (err) {
            console.error("[WS] Failed to parse message", msg.body, err);
        }
    }

    private requestFullState(bus: EventBus): void {
        bus.emit({type: GameEventType.REQUEST_GAME_STATE, payload: {}, source: GameEventSource.Network});
    }
}