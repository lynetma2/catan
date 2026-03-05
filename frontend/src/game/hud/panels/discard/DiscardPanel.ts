// hud/panels/DiscardPanel.ts
import {type EventPayloads, GameEventType} from "@/game/events/GameEventTypes.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";

export class DiscardPanel {
    private selectedUids: Set<string> = new Set();

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // Clear selection when discard obligation arrives or clears
        this.bus.on(GameEventType.DISCARD_REQUIRED, _e => this.selectedUids.clear());
        this.bus.on(GameEventType.CARDS_DISCARDED,   e  => this.onCardsDiscarded(e.payload));
    }

    private onCardsDiscarded(payload: EventPayloads[GameEventType.CARDS_DISCARDED]) {
        if (payload.playerId === this.shared.localPlayerId) {
            this.selectedUids.clear();
        }
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (!this.shared.mustDiscard) return false;

        const state = this.getState();

        if (event.type === 'click') {
            // Check confirm button
            if (state.canConfirm && containsPoint(state.confirmBounds, event.screenPos)) {
                this.confirmDiscard();
                return true;
            }

            // Check card clicks
            const card = [...state.cards].reverse().find(c =>
                containsPoint(c.bounds, event.screenPos)
            );

            if (card) {
                this.toggleCard(card.uid);
                return true;
            }
        }

        // Panel is blocking — consume all input while active
        return this.shared.mustDiscard;
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): DiscardPanelState {
        const r            = this.resolution.get();
        const resources    = this.shared.localPlayer?.resources ?? [];
        const discardCount = this.shared.discardCount;

        const cards = resolveDiscardCards(resources, this.selectedUids, r);

        return {
            visible:       this.shared.mustDiscard,
            discardCount,
            selectedCount: this.selectedUids.size,
            remaining:     discardCount - this.selectedUids.size,
            canConfirm:    this.selectedUids.size === discardCount,
            cards,
            confirmBounds: resolveConfirmButtonBounds(r),
            bounds:        resolveDiscardPanelBounds(r),
        };
    }

    getBounds(r: Resolution) {
        return resolveDiscardPanelBounds(r);
    }

    // ─── Private ──────────────────────────────────────────────────────

    private toggleCard(uid: string) {
        if (this.selectedUids.has(uid)) {
            this.selectedUids.delete(uid);
            return;
        }

        // Only allow selecting up to discardCount
        if (this.selectedUids.size < this.shared.discardCount) {
            this.selectedUids.add(uid);
        }
    }

    private confirmDiscard() {
        const resources = this.shared.localPlayer?.resources
            .filter(r => this.selectedUids.has(r.uid)) ?? [];

        this.frameQueue.push({
            type:    GameEventType.CardsSentToServer,
            payload: {
                playerId:  this.shared.localPlayerId!,
                resources,
            },
            source: GameEventSource.Hud,
        });
    }
}