// hud/panels/tradeOffer/TradeOfferManager.ts
import {type EventBus} from '@/game/core/EventBus';
import {type SharedState} from '@/game/core/SharedState';
import {InputType, type NormalizedInputEvent} from '@/game/core/Input/InputEvent';
import {type ResolutionManager} from '@/game/core/ResolutionManager';
import {containsPoint} from '@/game/utils/Rect';
import type {Vec2} from '@/game/utils/Vec2';
import {TradeOfferIncomingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferIncomingPanel.ts";
import {TradeOfferOutgoingPanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferOutgoingPanel.ts";
import {
    type TradeOfferDTO,
    TradeOfferKind,
    type TradeOfferManagerState,
    type TradeOfferPanelData,
    TradeOfferResponseKind,
} from "@/game/hud/panels/tradeOffer/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {resolveTradeOfferPanelBounds} from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";

type TradePanel = TradeOfferIncomingPanel | TradeOfferOutgoingPanel;

export class TradeOfferManager {
    private readonly activeTradePanels: TradePanel[] = [];

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
        this.bus.on(GameServerEvents.state.full.success, (payload) => this.onGameStateLoaded(payload));

        this.bus.on(GameServerEvents.trade.public.start.success, (payload) => this.onTradeStarted(payload));
        this.bus.on(GameServerEvents.trade.public.cancel.success, (payload) => this.onTradeEnded(payload.tradeId));
        this.bus.on(GameServerEvents.trade.public.confirm.success, (payload) => this.onTradeEnded(payload.tradeId));
        this.bus.on(GameServerEvents.trade.public.responderAccept.success, (payload) =>
            this.onUpdatePlayerResponse(payload.tradeId, payload.playerId, payload.response),
        );
        this.bus.on(GameServerEvents.trade.public.responderDecline.success, (payload) =>
            this.onUpdatePlayerResponse(payload.tradeId, payload.playerId, payload.response),
        );
    }

    // ─── Event handlers ───────────────────────────────────────────────
    private onGameStateLoaded(
        payload: GameEventMap[typeof GameServerEvents.state.full.success],
    ) {
        this.activeTradePanels.splice(0);
        payload.snapshot.activeTradeOffers.forEach((dto: TradeOfferDTO) => {
            this.activeTradePanels.push(this.createPanel(dto));
        });
    }

    private onTradeStarted(
        payload: GameEventMap[typeof GameServerEvents.trade.public.start.success],
    ) {
        this.activeTradePanels.push(this.createPanel(payload.tradeOfferDTO));
    }

    private onUpdatePlayerResponse(
        tradeId: string,
        playerId: string,
        response: TradeOfferResponseKind,
    ) {
        for (const panel of this.activeTradePanels) {
            if (panel.getTradeOfferId() === tradeId) {
                panel.updatePlayerResponse(playerId, response);
            }
        }
    }

    private onTradeEnded(tradeId: string) {
        const idx = this.activeTradePanels.findIndex(p => p.getTradeOfferId() === tradeId);
        if (idx !== -1) this.activeTradePanels.splice(idx, 1);
    }

    // ─── Panel creation ───────────────────────────────────────────────
    private createPanel(dto: TradeOfferDTO): TradePanel {
        const data = this.toPanelData(dto);
        return data.kind === TradeOfferKind.Incoming
            ? new TradeOfferIncomingPanel(this.resolution, this.frameQueue, this.shared, data)
            : new TradeOfferOutgoingPanel(this.resolution, this.frameQueue, this.shared, data);
    }

    private toPanelData(dto: TradeOfferDTO): TradeOfferPanelData {
        const isOwnedByLocalPlayer = dto.tradeOwnerId === this.shared.localPlayerId;
        return {
            kind: isOwnedByLocalPlayer ? TradeOfferKind.Outgoing : TradeOfferKind.Incoming,
            tradeOfferId: dto.tradeOfferId,
            tradeOwnerId: dto.tradeOwnerId,
            wantedResources: dto.wantedResources,
            offeredResources: dto.offeredResources,
            playerResponses: dto.playerResponses.map(r => ({
                playerId: r.playerId,
                response: r.response,
            })),
        };
    }

    // ─── Input ────────────────────────────────────────────────────────
    isOverAnyPanel(screenPos: Vec2): boolean {
        const res = this.resolution.get();
        return this.activeTradePanels.some((_, index) =>
            containsPoint(resolveTradeOfferPanelBounds(res, index), screenPos)
        );
    }

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            this.activeTradePanels.forEach((panel, index) =>
                panel.handleInput(event, index),
            );
            return this.isOverAnyPanel(event.screenPos);
        }

        let handled = false;
        for (let i = 0; i < this.activeTradePanels.length; i++) {
            if (this.activeTradePanels[i].handleInput(event, i)) {
                handled = true;
                break;
            }
        }
        return handled;
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