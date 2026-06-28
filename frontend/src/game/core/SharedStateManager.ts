// core/SharedStateManager.ts
import type {SharedState} from "@/game/core/SharedState.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameUiEvents} from "@/events/game/GameUiEvents.ts";
import type {Resource} from "@/game/core/types.ts";

export class SharedStateManager {
    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly shared: SharedState,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        // Server → shared state
        this.bus.on(GameServerEvents.state.full.success, (payload) => this.onGameStateLoaded(payload));
        this.bus.on(GameServerEvents.resource.grant.success, (payload) => this.onResourcesGranted(payload));
        this.bus.on(GameServerEvents.resource.spent.success, (payload) => this.onResourcesSpent(payload));
        this.bus.on(GameServerEvents.turn.start.success, (payload) => this.onTurnStarted(payload));

        // UI → shared state
        this.bus.on(GameUiEvents.build.enter, (payload) => this.shared.setBuildMode(payload.pieceType));
        this.bus.on(GameUiEvents.build.exit, () => this.shared.setBuildMode(null));
    }

    private onGameStateLoaded(payload: GameEventMap[typeof GameServerEvents.state.full.success]) {
        this.shared.loadFromSnapshot(payload.snapshot, payload.localPlayerId);
    }

    private onResourcesGranted(payload: GameEventMap[typeof GameServerEvents.resource.grant.success]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        const current = this.shared.localPlayer?.resources ?? [];
        this.shared.updateLocalPlayerResources([...current, ...payload.resources]);
    }

    private onResourcesSpent(payload: GameEventMap[typeof GameServerEvents.resource.spent.success]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        const current = this.shared.localPlayer?.resources ?? [];
        this.shared.updateLocalPlayerResources(removeResources(current, payload.resources));
    }

    private onTurnStarted(payload: GameEventMap[typeof GameServerEvents.turn.start.success]) {
        this.shared.setCurrentPlayer(payload.playerId);
    }
}

function removeResources(current: Resource[], spent: Resource[]): Resource[] {
    const remaining = [...current];
    for (const res of spent) {
        const idx = remaining.indexOf(res);
        if (idx !== -1) {
            remaining.splice(idx, 1);
        }
    }
    return remaining;
}