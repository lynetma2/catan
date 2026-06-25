// hud/panels/overview/PlayerOverviewPanel.ts
import {EventBus} from '@/game/core/EventBus';
import {SharedState} from '@/game/core/SharedState';
import {resolveOverviewPanelBounds, resolvePlayerRows} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import type {PlayerOverviewEntry, PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import type {Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";

export class PlayerOverviewPanel {
    private players: Map<string, PlayerOverviewEntry> = new Map();

    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly shared: SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────
    private subscribeToEvents() {
        // Full state snapshot
        this.bus.on(GameServerEvents.state.full.success, (payload) => this.onGameStateLoaded(payload));

        // Turn tracking
        this.bus.on(GameServerEvents.turn.start.success, (payload) => this.onTurnStarted(payload));

        // Resource changes
        this.bus.on(GameServerEvents.resource.grant.success, (payload) => this.onResourcesGranted(payload));
        this.bus.on(GameServerEvents.resource.spent.success, (payload) => this.onResourcesSpent(payload));

        // Building
        this.bus.on(GameServerEvents.build.settlement.success, (payload) => this.onBuildPlaced(payload));

        // Development cards – opponentCard maps to dev card count
        this.bus.on(GameServerEvents.overview.opponentCard.success, (payload) => this.onDevCardCountChanged(payload));

        // Special cards & victory points
        this.bus.on(GameServerEvents.overview.longestRoad.success, (payload) => this.onLongestRoadChanged(payload));
        this.bus.on(GameServerEvents.overview.largestArmy.success, (payload) => this.onLargestArmyChanged(payload));
        this.bus.on(GameServerEvents.overview.victoryPoint.success, (payload) => this.onVictoryPointsChanged(payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────
    private onGameStateLoaded(
        payload: GameEventMap[typeof GameServerEvents.state.full.success]
    ) {
        this.players.clear();
        const {snapshot} = payload;
        snapshot.players.forEach(p => {
            this.players.set(p.id, {
                playerId:       p.id,
                name:           p.name,
                color:          p.color,
                victoryPoints: p.victoryPoints,
                cardCount: p.cardCount,
                devCardCount:   0,
                hasLongestRoad: p.hasLongestRoad,
                hasLargestArmy: p.hasLargestArmy,
                usedRobbers: p.usedRobbers,
                isCurrentTurn: p.id === snapshot.currentPlayerId,
            });
        });
    }

    private onTurnStarted(
        payload: GameEventMap[typeof GameServerEvents.turn.start.success]
    ) {
        this.players.forEach((entry, id) => {
            entry.isCurrentTurn = id === payload.playerId;
        });
    }

    private onResourcesGranted(
        payload: GameEventMap[typeof GameServerEvents.resource.grant.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.cardCount += payload.resources.length;
    }

    private onResourcesSpent(
        payload: GameEventMap[typeof GameServerEvents.resource.spent.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.cardCount = Math.max(0, player.cardCount - payload.resources.length);
    }

    private onBuildPlaced(
        payload: GameEventMap[typeof GameServerEvents.build.settlement.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (!player) return;
        if (payload.pieceType === 'settlement') player.victoryPoints += 1;
        if (payload.pieceType === 'city')       player.victoryPoints += 2;
    }

    private onDevCardCountChanged(
        payload: GameEventMap[typeof GameServerEvents.overview.opponentCard.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.devCardCount = payload.value;
    }

    private onLongestRoadChanged(
        payload: GameEventMap[typeof GameServerEvents.overview.longestRoad.success]
    ) {
        this.players.forEach((entry, id) => {
            entry.hasLongestRoad = id === payload.playerId;
        });
    }

    private onLargestArmyChanged(
        payload: GameEventMap[typeof GameServerEvents.overview.largestArmy.success]
    ) {
        this.players.forEach((entry, id) => {
            entry.hasLargestArmy = id === payload.playerId;
        });
    }

    private onVictoryPointsChanged(
        payload: GameEventMap[typeof GameServerEvents.overview.victoryPoint.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.victoryPoints = payload.value;
    }

    // ─── Input ────────────────────────────────────────────────────────
    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────
    getState(): PlayerOverviewState {
        const r = this.resolution.get();
        const players = Array.from(this.players.values());

        return {
            bounds: resolveOverviewPanelBounds(players.length, r),
            players,
            rows: resolvePlayerRows(players, r),
        };
    }

    getBounds(r: Resolution) {
        return resolveOverviewPanelBounds(this.players.size, r);
    }
}