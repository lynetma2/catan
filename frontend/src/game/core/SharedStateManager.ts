// core/SharedStateManager.ts
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import {type EventPayloads, GameEventType} from "@/game/events/GameEventTypes.ts";

export class SharedStateManager {
    constructor(
        private readonly bus:    EventBus,
        private readonly shared: SharedState,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        // Nobody else owns these — they live here
        this.bus.on(GameEventType.GAME_STATE_LOADED,  e => this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.RESOURCES_GRANTED, e => this.onResourcesGranted(e.payload));
        this.bus.on(GameEventType.RESOURCES_SPENT,   e => this.onResourcesSpent(e.payload));
        this.bus.on(GameEventType.BUILD_MODE_ENTERED, e => this.shared.setBuildMode(e.payload.pieceType));
        this.bus.on(GameEventType.BUILD_MODE_EXITED,  _e => this.shared.setBuildMode(null));
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GAME_STATE_LOADED]) {
        this.shared.loadFromSnapshot(payload, this.shared.localPlayerId!);
    }

    private onResourcesGranted(payload: EventPayloads[GameEventType.RESOURCES_GRANTED]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        const current = this.shared.localPlayer?.resources ?? [];
        this.shared.updateLocalPlayerResources([...current, ...payload.resources]);
    }

    private onResourcesSpent(payload: EventPayloads[GameEventType.RESOURCES_SPENT]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        const current = this.shared.localPlayer?.resources ?? [];
        this.shared.updateLocalPlayerResources(current.slice(payload.amount));
    }
}