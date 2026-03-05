import type {ResourcePanel} from "../ResourcePanel";
import {type DiscardModeState, type ResourcePanelMode, ResourcePanelModeKind} from "../types";
import type {FrameQueue} from "@/game/core/FrameQueue";
import {GameKey, InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent";
import {GameEventSource, GameEventType} from "@/game/events/GameEventTypes";

export class DiscardMode implements ResourcePanelMode<DiscardModeState> {
    private selectedIds = new Set<string>();

    constructor(
        private panel: ResourcePanel,
        private frameQueue: FrameQueue
    ) {}

    onEnter() {}
    onExit() { this.selectedIds.clear(); }

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseClick) {
            const cardId = this.panel.cardAtPos(event.screenPos);
            if (cardId) {
                this.toggleSelection(cardId);
                return true;
            }
        }

        // Fallback confirm via Enter key
        if (event.type === InputType.KeyDown && event.key === GameKey.Enter) {
            this.confirm();
            return true;
        }

        return true; // Consume all input in panel to prevent bleed-through
    }

    getState(): DiscardModeState {
        const discardCount = this.panel.shared.discardCount;
        const selectedCount = this.selectedIds.size;

        return {
            kind: ResourcePanelModeKind.Discard,
            canConfirm: selectedCount === discardCount,
            selectedIds: this.selectedIds,
            label: `Discard ${discardCount} cards`,
            mustDiscard: discardCount,
            discardedSoFar: selectedCount
        };
    }

    private toggleSelection(uid: string) {
        if (this.selectedIds.has(uid)) {
            this.selectedIds.delete(uid);
        } else {
            // Only allow selecting up to the required amount
            if (this.selectedIds.size < this.panel.shared.discardCount) {
                this.selectedIds.add(uid);
            }
        }
    }

    private confirm() {
        if (this.selectedIds.size !== this.panel.shared.discardCount) return;

        const resources = this.panel.getResources().filter(r => this.selectedIds.has(r.uid));

        this.frameQueue.push({
            type: GameEventType.CARDS_DISCARDED,
            payload: { playerId: this.panel.shared.localPlayerId!, resources },
            source: GameEventSource.Hud
        });
    }
}