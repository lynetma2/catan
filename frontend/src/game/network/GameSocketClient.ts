import type {IMessage, StompSubscription} from "@stomp/stompjs";
import type {EventBus} from "@/game/core/EventBus";
import type {FrameQueue} from "@/game/core/FrameQueue";
import {GameSocketInboundHandler} from "@/game/network/GameSocketInboundHandler";
import {GameSocketOutboundHandler} from "@/game/network/GameSocketOutboundHandler";
import type {WebSocketContextValue} from "@/WebSocketContext";
import {GameActionEvents} from "@/events/game/GameActionEvents";

export class GameSocketConnection {
    private readonly inbound: GameSocketInboundHandler;
    private readonly outbound: GameSocketOutboundHandler;
    private readonly webSocket: WebSocketContextValue;
    private readonly subscriptions: StompSubscription[] = [];
    private unregisterOnConnect: (() => void) | null = null;

    constructor(
        private readonly gameId: string,
        webSocket: WebSocketContextValue,
        bus: EventBus<any>,               // ← accepts the combined bus
        frameQueue: FrameQueue<any>,      // ← accepts the combined queue
    ) {
        this.webSocket = webSocket;

        // inbound: STOMP → FrameQueue (cast to narrow server type internally)
        this.inbound = new GameSocketInboundHandler(
            frameQueue as FrameQueue<any> // already `any`, handler expects <GameServerEventMap>
        );

        // outbound: EventBus → STOMP (cast to action map internally)
        this.outbound = new GameSocketOutboundHandler(
            gameId,
            bus as EventBus<any>,   // outbound handler expects <GameActionEventMap>
            (destination, payload) =>
                this.webSocket.sendMessage(destination, payload),
        );

        this.initialize(bus);
    }

    public destroy(): void {
        if (this.unregisterOnConnect) {
            this.unregisterOnConnect();
            this.unregisterOnConnect = null;
        }
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.length = 0;
        this.outbound.destroy();
    }

    // ────────────────────────────────────────────────────────────────

    private initialize(bus: EventBus<any>): void {
        const subscribeAndRequest = () => {
            console.info(`[WS] Connected — game: ${this.gameId}`);
            this.subscribe(bus);
            this.requestFullState(bus);
        };

        if (this.webSocket.isConnected) {
            subscribeAndRequest();
        } else {
            this.unregisterOnConnect = this.webSocket.onConnect(() => subscribeAndRequest());
        }
    }

    private subscribe(_bus: EventBus<any>): void {
        const topicSub = this.webSocket.subscribe(
            `/topic/game/${this.gameId}`,
            (msg) => this.onMessage(msg),
        );
        if (topicSub) this.subscriptions.push(topicSub);

        const userSub = this.webSocket.subscribe(
            `/user/queue/game`,
            (msg) => this.onMessage(msg),
        );
        if (userSub) this.subscriptions.push(userSub);
    }

    private onMessage(msg: IMessage): void {
        try {
            const payload = JSON.parse(msg.body);
            const messageType: string =
                msg.headers["message-type"] ?? payload?.type;

            if (!messageType) {
                console.warn("[WS] Received message with no type", payload);
                return;
            }

            this.inbound.handle(messageType, payload);
        } catch (err) {
            console.error("[WS] Failed to parse message", msg.body, err);
        }
    }

    /**
     * Request the full game state – uses the new "state" action.
     * The outbound handler automatically forwards it to the server.
     */
    private requestFullState(bus: EventBus<any>): void {
        bus.emit({
            type: GameActionEvents.state,
            payload: {},
        });
    }
}