// hud/panels/overview/PlayerOverviewPanel.ts
import {type EventBus} from '@/game/core/EventBus';
import {type SharedState} from '@/game/core/SharedState';
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent';
import {type Resolution, type ResolutionManager} from '@/game/core/ResolutionManager';
import {type EventPayloads, GameEventType} from '@/game/events/GameEventTypes';
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import {resolveOverviewPanelBounds, resolvePlayerRows} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";
import type {TradeOfferIncomingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferIncomingPanel.ts";
import type {TradeOfferOutgoingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferOutgoingPanel.ts";

export class TradeOfferManager {
    // Panel owns this state — no other system needs it
    private activeTrades: (TradeOfferIncomingPanel | TradeOfferOutgoingPanel)[];

    constructor(
        private readonly bus:        EventBus,
        private readonly shared:     SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // Snapshot — full state on load/reload
        this.bus.on(GameEventType.GAME_STATE_LOADED, e => this.onGameStateLoaded(e.payload));

        // Structural — fires once at game start
        this.bus.on(GameEventType.GAME_STARTED, e => this.onGameStarted(e.payload));

        // Turn tracking
        this.bus.on(GameEventType.TURN_STARTED, e => this.onTurnStarted(e.payload));

        // Resource changes
        this.bus.on(GameEventType.RESOURCES_GRANTED, e => this.onResourcesGranted(e.payload));
        this.bus.on(GameEventType.RESOURCES_SPENT,   e => this.onResourcesSpent(e.payload));
        this.bus.on(GameEventType.OPPONENT_CARD_COUNT_CHANGED, e => this.onOpponentCardCountChanged(e.payload));

        // Building
        this.bus.on(GameEventType.BUILD_PLACED, e => this.onBuildPlaced(e.payload));

        // Special cards
        this.bus.on(GameEventType.LONGEST_ROAD_CHANGED, e => this.onLongestRoadChanged(e.payload));
        this.bus.on(GameEventType.LARGEST_ARMY_CHANGED, e => this.onLargestArmyChanged(e.payload));
        this.bus.on(GameEventType.VICTORY_POINTS_CHANGED, e => this.onVictoryPointsChanged(e.payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────

    private onGameStarted(payload: EventPayloads[GameEventType.GAME_STARTED]) {
        payload.players.forEach(p => {
            this.players.set(p.id, {
                playerId:       p.id,
                name:           p.name,
                color:          p.color,
                victoryPoints:  0,
                cardCount:      0,
                devCardCount:   0,
                hasLongestRoad: false,
                hasLargestArmy: false,
                usedRobbers:    0,
                isCurrentTurn:  false,
            });
        });
    }

    private onTurnStarted(payload: EventPayloads[GameEventType.TURN_STARTED]) {
        this.players.forEach((p, id) => {
            p.isCurrentTurn = id === payload.playerId;
        });
    }

    private onResourcesGranted(payload: EventPayloads[GameEventType.RESOURCES_GRANTED]) {
        const player = this.players.get(payload.playerId);
        if (player) player.cardCount += payload.resources.length;
    }

    private onResourcesSpent(payload: EventPayloads[GameEventType.RESOURCES_SPENT]) {
        const player = this.players.get(payload.playerId);
        if (player) player.cardCount = Math.max(0, player.cardCount - payload.amount);
    }

    private onBuildPlaced(payload: EventPayloads[GameEventType.BUILD_PLACED]) {
        const player = this.players.get(payload.playerId);
        if (!player) return;
        if (payload.pieceType === 'settlement') player.victoryPoints++;
        if (payload.pieceType === 'city')       player.victoryPoints += 2;
    }

    private onLongestRoadChanged(payload: EventPayloads[GameEventType.LONGEST_ROAD_CHANGED]) {
        this.players.forEach((p, id) => {
            p.hasLongestRoad = id === payload.playerId;
        });
    }

    private onLargestArmyChanged(payload: EventPayloads[GameEventType.LARGEST_ARMY_CHANGED]) {
        this.players.forEach((p, id) => {
            p.hasLargestArmy = id === payload.playerId;
        });
    }

    private onVictoryPointsChanged(payload: EventPayloads[GameEventType.VICTORY_POINTS_CHANGED]) {
        const player = this.players.get(payload.playerId);
        if (player) player.victoryPoints = payload.points;
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GAME_STATE_LOADED]) {
        // Rebuild entire state from snapshot — wipes any previous state
        this.players.clear();
        payload.players.forEach(p => {
            this.players.set(p.id, {
                playerId:       p.id,
                name:           p.name,
                color:          p.color,
                victoryPoints:  p.victoryPoints,   // ← from snapshot, not zero
                cardCount:      p.cardCount,
                devCardCount:   p.devCardCount,
                hasLongestRoad: p.hasLongestRoad,
                hasLargestArmy: p.hasLargestArmy,
                usedRobbers:    p.usedRobbers,
                isCurrentTurn:  p.id === payload.currentPlayerId,
            });
        });
    }

    private onOpponentCardCountChanged(payload: EventPayloads[GameEventType.OPPONENT_CARD_COUNT_CHANGED]) {
        const player = this.players.get(payload.playerId);
        if (player) player.cardCount = payload.cardCount
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): PlayerOverviewState {
        const r       = this.resolution.get();
        const players = Array.from(this.players.values());

        return {
            bounds:  resolveOverviewPanelBounds(players.length, r),
            players,
            rows:    resolvePlayerRows(players, r),
        };
    }

    getBounds(r: Resolution) {
        return resolveOverviewPanelBounds(this.players.size, r);
    }
}