// GameSocketInboundHandler.ts

import type {FrameQueue} from "@/game/core/FrameQueue";
import type {GameServerEventMap} from "@/events/game/GameServerEvents";
import {GameServerEvents} from "@/events/game/GameServerEvents";
import type {GameSnapshot} from "@/game/core/types";

export class GameSocketInboundHandler {
    private readonly handlers: Record<string, (payload: any) => void> = {};

    constructor(
        private readonly frameQueue: FrameQueue<GameServerEventMap>
    ) {
        this.registerHandlers();
        // Optional: verify registration
        console.debug("[Inbound] Registered event types:", Object.keys(this.handlers));
    }

    /**
     * Recursively flatten all nested event type strings.
     */
    private flattenEventTypes(obj: any): string[] {
        const result: string[] = [];
        for (const value of Object.values(obj)) {
            if (typeof value === "string") {
                result.push(value);
            } else if (value && typeof value === "object") {
                result.push(...this.flattenEventTypes(value));
            }
        }
        return result;
    }

    private registerHandlers(): void {
        // 1. Auto‑register every known server event
        const allEventTypes = this.flattenEventTypes(GameServerEvents);
        for (const eventType of allEventTypes) {
            this.handlers[eventType] = (event: any) => {
                console.log("Handling eventType:" + eventType + " payload:", event);
                this.frameQueue.push({
                    type: eventType as any,
                    payload: event.payload,
                });
            };
        }

        // 2. Override the full‑state event to inject lobbyId & localPlayerId
        const fullStateKey = GameServerEvents.state.full.success;
        this.handlers[fullStateKey] = (event: any) => {
            // The server sends the snapshot directly at the root.
            // We wrap it with the required metadata.
            console.log("Handling eventType:" + fullStateKey + " payload:", event);
            this.frameQueue.push({
                type: fullStateKey,
                payload: event.payload,
            });
        };
    }

    public handle(messageType: string, payload: unknown): void {
        console.debug("[Inbound] Handling:", messageType, "Handlers keys:", Object.keys(this.handlers));
        const handler = this.handlers[messageType];
        if (!handler) {
            console.warn(`[WS] Unhandled server event: "${messageType}"`, payload);
            return;
        }
        handler(payload);
    }
}