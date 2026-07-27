// core/SharedStateManager.ts
import type {SharedState} from "@/game/core/SharedState.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameUiEvents} from "@/events/game/GameUiEvents.ts";
import type {Resource, StealFlowState} from "@/game/core/types.ts";

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
        this.bus.on(GameServerEvents.robber.stealTargetRequired.success, (payload) => this.onStealTargetRequired(payload));
        this.bus.on(GameServerEvents.robber.placed.success, (payload) => this.onRobberPlaced(payload));

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
        console.log("Resources spent event inside shared state manager: ", payload);
        if (payload.playerId !== this.shared.localPlayerId) return;
        const current = this.shared.localPlayer?.resources ?? [];
        this.shared.updateLocalPlayerResources(removeResources(current, payload.resources));
    }

    private onTurnStarted(payload: GameEventMap[typeof GameServerEvents.turn.start.success]) {
        this.shared.setCurrentPlayer(payload.playerId);
    }

    private onStealTargetRequired(payload: GameEventMap[typeof GameServerEvents.robber.stealTargetRequired.success]) {
        const state: StealFlowState = {
            type: "steal",
            retrievingPlayerId: payload.retrievingPlayerId,
            candidates: payload.candidates
        }
        this.shared.setActiveFlowState(state);
    }

    private onRobberPlaced(payload: GameEventMap[typeof GameServerEvents.robber.placed.success]) {
        this.shared.setRobberHex(payload.hex);
    }

    //TODO add something to clear the steal candidates.
}

function removeResources(current: Resource[], spent: Resource[]): Resource[] {
    const remaining = [];
    for (const resource of current) {
        let used: boolean = false;
        for (const spentResource of spent) {
            if (resource.uid === spentResource.uid) {
                used = true;
                console.log("Spent resource " + resource.uid);
            }
        }
        if (!used) {
            remaining.push(resource);
        }
    }
    return remaining;
}