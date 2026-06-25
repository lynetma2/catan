// hud/panels/tradeOffer/TradeOfferManager.ts
import { type EventBus } from '@/game/core/EventBus';
import { type SharedState } from '@/game/core/SharedState';
import { type NormalizedInputEvent } from '@/game/core/Input/InputEvent';
import { type ResolutionManager } from '@/game/core/ResolutionManager';
import { GameEventType } from '@/game/events/GameEventTypes';
import { TradeOfferIncomingPanel } from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferIncomingPanel.ts";
import { TradeOfferOutgoingPanel } from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferOutgoingPanel.ts";
import {
    TradeOfferKind,
    type TradeOfferManagerState,
    type TradeOfferPanelData,
    TradeOfferResponseKind
} from "@/game/hud/panels/tradeOffer/types.ts";
import type { FrameQueue } from "@/game/core/FrameQueue.ts";
import { resolveTradeOfferPanelBounds } from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";
import type { GameEventMap } from "@/events/shared/AppEvents.ts";
import { GameServerEvents } from "@/events/game/GameServerEvents.ts";

export class TradeOfferManager {
    private readonly activeTradePanels: (TradeOfferIncomingPanel | TradeOfferOutgoingPanel)[] = [];

    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly shared: SharedState,
        private readonly frameQueue: FrameQueue<GameEventMap>,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────
    private subscribeToEvents() {
        // Full state reload – mapped to new server event
        this.bus.on(GameServerEvents.state.full.success, (payload) => this.onGameStateLoaded(payload));

        // ------------------------------------------------------------------
        // Trade offer events have no new equivalents yet – keep old ones via any cast
        // ------------------------------------------------------------------
        const bus = this.bus as EventBus<any>;

        bus.on(GameEventType.TRADE_OFFER_INCOME_RECIEVED, (payload: any) => this.onIncomingTradeOffer(payload));
        bus.on(GameEventType.TRADE_OFFER_OUTGOING_RECIEVED, (payload: any) => this.onOutgoingTradeOffer(payload));
        bus.on(GameEventType.TRADE_OFFER_ACCEPTED, (payload: any) =>
            this.onUpdatePlayerResponse(payload, TradeOfferResponseKind.Accept),
        );
        bus.on(GameEventType.TRADE_OFFER_DECLINED, (payload: any) =>
            this.onUpdatePlayerResponse(payload, TradeOfferResponseKind.Decline),
        );
        bus.on(GameEventType.TRADE_OFFER_CANCELLED, (payload: any) => this.onTradeOfferCancelled(payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────
    private onGameStateLoaded(
        payload: GameEventMap[typeof GameServerEvents.state.full.success],
    ) {
        this.activeTradePanels.splice(0);
        const tradeOffers = payload.snapshot.activeTradeOffers as TradeOfferPanelData[];
        tradeOffers.forEach((tradeOffer) => {
            if (tradeOffer.kind === TradeOfferKind.Incoming) {
                const panel = new TradeOfferIncomingPanel(
                    this.resolution, this.frameQueue, this.shared, tradeOffer,
                );
                this.activeTradePanels.push(panel);
            } else {
                const panel = new TradeOfferOutgoingPanel(
                    this.resolution, this.frameQueue, this.shared, tradeOffer,
                );
                this.activeTradePanels.push(panel);
            }
        });
    }

    private onUpdatePlayerResponse(
        payload: any,
        response: TradeOfferResponseKind,
    ) {
        for (const panel of this.activeTradePanels) {
            if (panel.getTradeOfferId() === payload.tradeOfferId) {
                panel.updatePlayerResponse(payload.playerId, response);
            }
        }
    }

    private onTradeOfferCancelled(payload: any) {
        const idx = this.activeTradePanels.findIndex(
            (p) => p.getTradeOfferId() === payload.tradeOfferId,
        );
        if (idx !== -1) this.activeTradePanels.splice(idx, 1);
    }

    private onIncomingTradeOffer(payload: any) {
        const panel = new TradeOfferIncomingPanel(
            this.resolution, this.frameQueue, this.shared, payload,
        );
        this.activeTradePanels.push(panel);
    }

    private onOutgoingTradeOffer(payload: any) {
        const panel = new TradeOfferOutgoingPanel(
            this.resolution, this.frameQueue, this.shared, payload,
        );
        this.activeTradePanels.push(panel);
    }

    // ─── Input ────────────────────────────────────────────────────────
    handleInput(_event: NormalizedInputEvent): boolean {
        // display‑only for now
        this.activeTradePanels.forEach((panel, index) =>
            resolveTradeOfferPanelBounds(this.resolution.get(), index),
        );
        return false;
    }

    // ─── State ────────────────────────────────────────────────────────
    getState(): TradeOfferManagerState {
        const states = this.activeTradePanels.map((panel, index) =>
            panel.getState(index),
        );
        return {
            activeTradePanels: states,
        };
    }
}