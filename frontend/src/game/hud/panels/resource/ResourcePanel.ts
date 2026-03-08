// hud/panels/ResourcePanel.ts
import type { SharedState }                        from "@/game/core/SharedState.ts";
import { InputType, type NormalizedInputEvent }    from "@/game/core/Input/InputEvent.ts";
import { type Resolution, ResolutionManager }      from "@/game/core/ResolutionManager.ts";
import type { ResourcePanelMode,
    ResourcePanelModeState,
    ResourcePanelState,
    TradeButtonKind,
    PanelHit }                           from "@/game/hud/panels/resource/types.ts";
import { ResourcePanelModeKind }                   from "@/game/hud/panels/resource/types.ts";
import type { Resource, ResourceType }             from "@/game/core/types.ts";
import { resolveResourceCards,
    resolveResourcePanelBounds,
    resolveOfferCards,
    resolveWantedCards,
    resolveSelectorCards,
    resolveTradeLayout }                     from "@/game/hud/panels/resource/ResourcePanelLayout.ts";
import { containsPoint }                           from "@/game/utils/Rect.ts";
import type { Vec2 }                               from "@/game/utils/Vec2.ts";
import type { EventBus }                           from "@/game/core/EventBus.ts";
import type { FrameQueue }                         from "@/game/core/FrameQueue.ts";
import { BrowseMode }                              from "@/game/hud/panels/resource/modes/BrowseMode.ts";
import { GameEventType }                           from "@/game/events/GameEventTypes.ts";
import { DiscardMode }                             from "@/game/hud/panels/resource/modes/DiscardMode.ts";
import { TradeMode }                               from "@/game/hud/panels/resource/modes/TradeMode.ts";

export class ResourcePanel {
    private mode:              ResourcePanelMode<any>;
    private hoveredCardId:     string | null          = null;
    private hoveredButtonKind: TradeButtonKind | null = null;

    constructor(
        public readonly shared:      SharedState,
        public readonly resolution:  ResolutionManager,
        public readonly bus:         EventBus,
        private readonly frameQueue: FrameQueue,
    ) {
        this.mode = new BrowseMode(this);
        this.subscribeToEvents();
    }

    // ─── Events ───────────────────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.DISCARD_REQUIRED, () => {
            this.setMode(new DiscardMode(this, this.frameQueue));
        });

        this.bus.on(GameEventType.CARDS_DISCARDED, (e) => {
            if (e.payload.playerId === this.shared.localPlayerId) {
                this.setMode(new BrowseMode(this));
            }
        });

        this.bus.on(GameEventType.TRADE_STARTED, (e) => {
            this.setMode(new TradeMode(this, e.payload.initialSelection));
        });

        this.bus.on(GameEventType.TRADE_ENDED, () => {
            this.setMode(new BrowseMode(this));
        });
    }

    private setMode(mode: ResourcePanelMode<any>) {
        this.mode.onExit();
        this.mode              = mode;
        this.hoveredCardId     = null;
        this.hoveredButtonKind = null;
        this.mode.onEnter();
    }

    // ─── Input ────────────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            // Reuse resolveHit so hover always matches the click hit-test exactly
            const hit = this.resolveHit(event.screenPos);

            this.hoveredCardId = (
                hit.kind === 'hand'     ||
                hit.kind === 'offered'  ||
                hit.kind === 'wanted'   ||
                hit.kind === 'selector'
            ) ? hit.cardId : null;

            this.hoveredButtonKind = (
                hit.kind === 'tradeCancel'        ||
                hit.kind === 'tradeConfirmGlobal' ||
                hit.kind === 'tradeConfirmBank'
            ) ? hit.kind : null;
        }

        if (event.type === InputType.MouseClick) {
            const hit = this.resolveHit(event.screenPos);
            return this.mode.handleHit(hit);
        }

        return this.mode.handleInput(event);
    }

    /**
     * Translates a screen position into a semantic PanelHit.
     *
     * All layout calls pass this.hoveredCardId so hit-test bounds are identical
     * to the bounds used when the frame was rendered — fixing the hitbox offset
     * bug that occurred when cards were in a hovered/fanned position.
     *
     * Priority order: offered → wanted → selector → buttons → hand.
     * Each region is only tested when the active mode exposes it.
     */
    private resolveHit(pos: Vec2): PanelHit {
        const r           = this.resolution.get();
        const modeState   = this.mode.getState();
        const isTradeMode = 'wantedTypes' in modeState;

        if (isTradeMode) {
            // Offered cards
            if (modeState.selectedIds.size > 0) {
                const offeredResources = this.getResources()
                    .filter(res => modeState.selectedIds.has(res.uid));
                const offeredCards = resolveOfferCards(offeredResources, this.hoveredCardId, r);
                const hit = [...offeredCards].reverse().find(c => containsPoint(c.bounds, pos));
                if (hit) return { kind: 'offered', cardId: hit.uid };
            }

            // Wanted cards
            const wantedResources = this.mode.getWantedResources?.() ?? [];
            if (wantedResources.length > 0) {
                const wantedCards = resolveWantedCards(wantedResources, this.hoveredCardId, r);
                const hit = [...wantedCards].reverse().find(c => containsPoint(c.bounds, pos));
                if (hit) return { kind: 'wanted', cardId: hit.uid };
            }

            // Selector cards
            const selectorCards = resolveSelectorCards(r, this.hoveredCardId);
            const selectorHit   = [...selectorCards].reverse()
                .find(c => containsPoint(c.bounds, pos));
            if (selectorHit) return { kind: 'selector', resourceType: selectorHit.resourceType as ResourceType };

            // Trade buttons
            const layout = resolveTradeLayout(r);
            if (containsPoint(layout.cancelButton,        pos)) return { kind: 'tradeCancel' };
            if (containsPoint(layout.confirmGlobalButton, pos)) return { kind: 'tradeConfirmGlobal' };
            if (containsPoint(layout.confirmBankButton,   pos)) return { kind: 'tradeConfirmBank' };
        }

        // Hand cards
        const handResources = this.getResources()
            .filter(res => !this.mode.getHandFilter().has(res.uid));
        const handCards = resolveResourceCards(handResources, this.hoveredCardId, r);
        const handHit   = [...handCards].reverse().find(c => containsPoint(c.bounds, pos));
        if (handHit) return { kind: 'hand', cardId: handHit.uid };

        return { kind: 'none' };
    }

    // ─── State ────────────────────────────────────────────────────────────────

    getState(): ResourcePanelState {
        const r             = this.resolution.get();
        const modeState     = this.mode.getState();
        const handResources = this.getResources()
            .filter(res => !this.mode.getHandFilter().has(res.uid));

        const cards = resolveResourceCards(handResources, this.hoveredCardId, r)
            .map(card => ({
                ...card,
                isSelected: modeState.selectedIds?.has(card.uid) ?? false,
                isDisabled: false,
            }));

        // Inject hover state into TradeModeState here — ResourcePanel owns hover,
        // not the mode itself.
        const mode = modeState.kind === ResourcePanelModeKind.Trade
            ? {
                ...modeState,
                hoveredCardId: this.hoveredCardId,
                hoveredButton: this.hoveredButtonKind,
            }
            : modeState;

        return {
            bounds:        resolveResourcePanelBounds(r),
            resourceCards: cards,
            mode,
        };
    }

    getBounds(r: Resolution) {
        return resolveResourcePanelBounds(r);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public getResources(): Resource[] {
        return this.shared.localPlayer?.resources ?? [];
    }

    public cardAtPos(pos: Vec2, excludeIds?: Set<string>): string | null {
        const r         = this.resolution.get();
        const resources = excludeIds
            ? this.getResources().filter(res => !excludeIds.has(res.uid))
            : this.getResources();

        const cards = resolveResourceCards(resources, null, r);
        const hit   = [...cards].reverse().find(c => containsPoint(c.bounds, pos));
        return hit?.uid ?? null;
    }
}