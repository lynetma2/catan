// hud/panels/overview/PlayerOverviewPanel.ts
import {EventBus} from '@/game/core/EventBus';
import {SharedState} from '@/game/core/SharedState';
import {
    resolveOverviewPanelBounds,
    resolvePlayerRows,
    resolveStatRects
} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import type {HoveredStat, PlayerOverviewEntry, PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import type {Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {GamePhase} from "@/game/core/types.ts";
import {DISCARD_RISK_THRESHOLD} from "@/game/core/GameConfigurationConstants.ts";

export class PlayerOverviewPanel {
    private players: Map<string, PlayerOverviewEntry> = new Map();
    private hoveredStat: HoveredStat | null = null;

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
        this.bus.on(GameServerEvents.state.overview.resource.success, (payload) => this.onResCardCountChanged(payload));

        // Development cards – opponentCard maps to dev card count
        this.bus.on(GameServerEvents.state.overview.developmentCard.success, (payload) => this.onDevCardCountChanged(payload));

        // Special cards & victory points
        this.bus.on(GameServerEvents.state.overview.longestRoad.success, (payload) => this.onLongestRoadChanged(payload));
        this.bus.on(GameServerEvents.state.overview.largestArmy.success, (payload) => this.onLargestArmyChanged(payload));
        this.bus.on(GameServerEvents.state.overview.victoryPoint.success, (payload) => this.onVictoryPointsChanged(payload));
        this.bus.on(GameServerEvents.state.overview.armySize.success, (payload) => this.onArmySizeChanged(payload));
        this.bus.on(GameServerEvents.state.overview.roadLength.success, (payload) => this.onLongestRoadLengthChanged(payload));

        //Discard related.
        this.bus.on(GameServerEvents.resource.discardRequired.success, (payload) => this.onDiscardRequired(payload));
        this.bus.on(GameServerEvents.resource.discardComplete.success, (payload) => this.onDiscardComplete(payload));
        this.bus.on(GameServerEvents.state.phase.change.success, (payload) => this.onPhaseChanged(payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────
    private onGameStateLoaded(
        payload: GameEventMap[typeof GameServerEvents.state.full.success]
    ) {
        this.players.clear();
        const {snapshot} = payload;
        const pending = snapshot.activeFlowState?.type === "discard"
            ? new Set(Object.keys(snapshot.activeFlowState.requiredDiscards))
            : new Set<string>();

        snapshot.players.forEach(p => {
            this.players.set(p.id, {
                playerId:       p.id,
                name:           p.name,
                color:          p.color,
                victoryPoints: p.victoryPoints,
                resCardCount: p.resCardCount,
                devCardCount: p.devCardCount,
                hasLongestRoad: p.hasLongestRoad,
                hasLargestArmy: p.hasLargestArmy,
                usedRobbers: p.knightsUsed,
                longestRoadLength: p.longestRoadLength,
                isCurrentTurn: p.id === snapshot.currentPlayerId,
                isLocalPlayer: p.id === payload.localPlayerId,
                discardStatus: pending.has(p.id) ? 'pending' : 'none',
                isAtDiscardRisk: p.resCardCount > DISCARD_RISK_THRESHOLD
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

    private onDevCardCountChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.developmentCard.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.devCardCount = payload.developmentCards;
    }

    private onResCardCountChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.resource.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) {
            player.resCardCount = payload.resourceCards;
            player.isAtDiscardRisk = player.resCardCount > DISCARD_RISK_THRESHOLD;
        }
    }

    private onLongestRoadChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.longestRoad.success]
    ) {
        this.players.forEach((entry, id) => {
            entry.hasLongestRoad = id === payload.playerId;
        });
    }

    private onLargestArmyChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.largestArmy.success]
    ) {
        this.players.forEach((entry, id) => {
            entry.hasLargestArmy = id === payload.playerId;
        });
    }

    private onVictoryPointsChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.victoryPoint.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.victoryPoints = payload.victoryPoints;
    }

    private onLongestRoadLengthChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.roadLength.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.longestRoadLength = payload.longestRoadLength;
    }

    private onArmySizeChanged(
        payload: GameEventMap[typeof GameServerEvents.state.overview.armySize.success]
    ) {
        const player = this.players.get(payload.playerId);
        if (player) player.usedRobbers = payload.armySize;
    }

    private onDiscardRequired(payload: GameEventMap[typeof GameServerEvents.resource.discardRequired.success]) {
        const player = this.players.get(payload.playerId);
        if (player) player.discardStatus = 'pending';
    }

    private onDiscardComplete(payload: GameEventMap[typeof GameServerEvents.resource.discardComplete.success]) {
        const player = this.players.get(payload.playerId);
        if (player) player.discardStatus = 'done';
    }

    private onPhaseChanged(payload: GameEventMap[typeof GameServerEvents.state.phase.change.success]) {
        if (payload.phase !== GamePhase.Discard) {
            this.players.forEach(p => {
                p.discardStatus = 'none';
            });
        }
    }

    // ─── Input ────────────────────────────────────────────────────────
    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            this.hoveredStat = this.resolveHoveredStat(event.screenPos);
        }
        return false; // still display-only for clicks
    }

    private resolveHoveredStat(pos: { x: number; y: number }): HoveredStat | null {
        const r = this.resolution.get();
        const rows = resolvePlayerRows(Array.from(this.players.values()), r);
        for (const row of rows) {
            for (const {kind, rect} of resolveStatRects(row.bounds)) {
                if (pos.x >= rect.x && pos.x <= rect.x + rect.width &&
                    pos.y >= rect.y && pos.y <= rect.y + rect.height) {
                    return {playerId: row.playerId, stat: kind};
                }
            }
        }
        return null;
    }

    // ─── State ────────────────────────────────────────────────────────
    getState(): PlayerOverviewState {
        const r = this.resolution.get();
        const players = Array.from(this.players.values());

        return {
            bounds: resolveOverviewPanelBounds(players.length, r),
            players,
            rows: resolvePlayerRows(players, r),
            hoveredStat: this.hoveredStat
        };
    }

    getBounds(r: Resolution) {
        return resolveOverviewPanelBounds(this.players.size, r);
    }
}