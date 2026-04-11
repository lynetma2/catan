// hud/panels/overview/PlayerOverviewPanel.ts
import {type EventBus} from '@/game/core/EventBus';
import {type SharedState} from '@/game/core/SharedState';
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent';
import {type Resolution, type ResolutionManager} from '@/game/core/ResolutionManager';
import {type EventPayloads, GameEventType} from '@/game/events/GameEventTypes';
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import {resolveOverviewPanelBounds, resolvePlayerRows} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";
import {TradeOfferIncomingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferIncomingPanel.ts";
import {TradeOfferOutgoingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferOutgoingPanel.ts";
import {TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";

export class TradeOfferManager {
    // Panel owns this state — no other system needs it
    private readonly activeTradePanels: (TradeOfferIncomingPanel | TradeOfferOutgoingPanel)[] = [];

    constructor(
        private readonly bus:        EventBus,
        private readonly shared:     SharedState,
        private readonly frameQueue: FrameQueue,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // Snapshot — full state on load/reload
        this.bus.on(GameEventType.GAME_STATE_LOADED, e => this.onGameStateLoaded(e.payload));

        // Add incoming trade event.
        this.bus.on(GameEventType.TRADE_OFFER_INCOME_RECIEVED, e => this.onIncomingTradeOffer(e.payload));

        // Add outgoing trade event.
        this.bus.on(GameEventType.TRADE_OFFER_OUTGOING_RECIEVED, e => this.onOutgoingTradeOffer(e.payload));

        // Update trade event.
        this.bus.on(GameEventType.TRADE_OFFER_ACCEPTED, e => this.onUpdatePlayerResponse(e.payload, TradeOfferResponseKind.Accept));
        this.bus.on(GameEventType.TRADE_OFFER_DECLINED, e => this.onUpdatePlayerResponse(e.payload, TradeOfferResponseKind.Decline));

        this.bus.on(GameEventType.TRADE_OFFER_CANCELLED, e => this.onTradeOfferCancelled(e.payload));

    }

    // ─── Event handlers ───────────────────────────────────────────────

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

    private onUpdatePlayerResponse(payload: EventPayloads[GameEventType.TRADE_OFFER_ACCEPTED],
                                   response: TradeOfferResponseKind) {
        for (const element of this.activeTradePanels) {
            const panel = element;
            if (panel.getTradeOfferId() === payload.tradeOfferId) {
                panel.updatePlayerResponse(payload.playerId, response);
            }
        }
    }

    private onTradeOfferCancelled(payload: EventPayloads[GameEventType.TRADE_OFFER_CANCELLED]) {
        const index = this.activeTradePanels.findIndex(panel => panel.getTradeOfferId() === payload.tradeOfferId);
        if (index !== -1) {
            this.activeTradePanels.splice(index, 1);
        }
    }

    private onIncomingTradeOffer(payload: EventPayloads[GameEventType.TRADE_OFFER_INCOME_RECIEVED]) {
        const tradePanel = new TradeOfferIncomingPanel(this.resolution, this.frameQueue, this.shared, payload);
        this.activeTradePanels.push(tradePanel);
    }

    private onOutgoingTradeOffer(payload: EventPayloads[GameEventType.TRADE_OFFER_OUTGOING_RECIEVED]) {
        const tradePanel = new TradeOfferOutgoingPanel(this.resolution, this.frameQueue, this.shared, payload);
        this.activeTradePanels.push(tradePanel);
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