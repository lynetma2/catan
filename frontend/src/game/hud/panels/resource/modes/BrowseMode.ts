import type {ResourcePanel} from "../ResourcePanel";
import {type BrowseModeState, type ResourcePanelMode, ResourcePanelModeKind} from "../types";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent";

export class BrowseMode implements ResourcePanelMode<BrowseModeState> {
    private selectedIds = new Set<string>();

    constructor(private panel: ResourcePanel) {}

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
        return false;
    }

    getState(): BrowseModeState {
        return {
            kind: ResourcePanelModeKind.Browse,
            canConfirm: false,
            selectedIds: this.selectedIds,
            label: null
        };
    }

    private toggleSelection(uid: string) {
        if (this.selectedIds.has(uid)) this.selectedIds.delete(uid);
        else this.selectedIds.add(uid);
    }
}