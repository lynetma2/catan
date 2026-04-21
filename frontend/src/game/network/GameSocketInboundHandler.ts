import { FrameQueue } from "@/game/core/FrameQueue.ts";
import { GameEventSource, GameEventType } from "@/game/events/GameEventTypes.ts";
import type { GameSnapshot } from "@/game/core/types.ts";

/**
 * Translates raw STOMP message payloads into typed GameEvents and
 * pushes them onto the FrameQueue.
 *
 * Add a new `case` here for every server → client message type.
 * The string keys must match whatever the backend puts in the
 * `message-type` header (or `payload.type` field).
 */
export class GameSocketInboundHandler {
    constructor(private readonly frameQueue: FrameQueue) {}

    public handle(messageType: string, payload: unknown): void {
        switch (messageType) {
            case GameEventType.GAME_STATE_LOADED:
                // @ts-ignore this is bad
                this.onGameStateLoaded(payload.payload as GameSnapshot);
                break;

            // ── Extend here as the backend grows ──────────────────────
            // case "PLAYER_MOVED":
            //     this.onPlayerMoved(payload as PlayerMovedPayload);
            //     break;

            default:
                console.warn(`[WS] Unhandled message type: "${messageType}"`, payload);
        }
    }

    // ── Handlers ───────────────────────────────────────────────────────

    private onGameStateLoaded(snapshot: GameSnapshot): void {
        console.log("this is payload", snapshot);
        this.frameQueue.push({
            type:    GameEventType.GAME_STATE_LOADED,
            payload: snapshot,
            source:  GameEventSource.Network,
        });
    }
}