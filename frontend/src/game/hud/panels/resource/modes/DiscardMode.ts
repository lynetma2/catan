import type { ResourcePanel }              from "../ResourcePanel";
import { type DiscardModeState,
    type ResourcePanelMode,
    type PanelHit,
    ResourcePanelModeKind }           from "../types";
import type { FrameQueue }                 from "@/game/core/FrameQueue";
import { GameKey,
    InputType,
    type NormalizedInputEvent }       from "@/game/core/Input/InputEvent";
import { GameEventSource,
    GameEventType }                   from "@/game/events/GameEventTypes";

export class DiscardMode implements ResourcePanelMode<DiscardModeState> {
    private selectedIds = new Set<string>();

    constructor(
        private panel:      ResourcePanel,
        private frameQueue: FrameQueue,
    ) {}

    onEnter() {}
    onExit() { this.selectedIds.clear(); }

    handleInput(event: NormalizedInputEvent): boolean {
        // Fallback confirm via Enter key
        if (event.type === InputType.KeyDown && event.key === GameKey.Enter) {
            this.confirm();
            return true;
        }
        // Consume all input to prevent bleed-through during discard
        return true;
    }

    handleHit(hit: PanelHit): boolean {
        if (hit.kind === 'hand') {
            this.toggleSelection(hit.cardId);
            return true;
        }
        return true; // consume all clicks during discard
    }

    getHandFilter(): Set<string> {
        return new Set(); // all cards remain in the hand during discard
    }

    getState(): DiscardModeState {
        const discardCount  = this.panel.shared.discardCount;
        const selectedCount = this.selectedIds.size;

        return {
            kind:           ResourcePanelModeKind.Discard,
            canConfirm:     selectedCount === discardCount,
            selectedIds:    this.selectedIds,
            label:          `Discard ${discardCount} cards`,
            mustDiscard:    discardCount,
            discardedSoFar: selectedCount,
        };
    }

    private toggleSelection(uid: string) {
        if (this.selectedIds.has(uid)) {
            this.selectedIds.delete(uid);
        } else {
            if (this.selectedIds.size < this.panel.shared.discardCount) {
                this.selectedIds.add(uid);
            }
        }
    }

    private confirm() {
        if (this.selectedIds.size !== this.panel.shared.discardCount) return;

        const resources = this.panel.getResources()
            .filter(r => this.selectedIds.has(r.uid));

        this.frameQueue.push({
            type:    GameEventType.CARDS_DISCARDED,
            payload: { playerId: this.panel.shared.localPlayerId!, resources },
            source:  GameEventSource.Hud,
        });
    }
}