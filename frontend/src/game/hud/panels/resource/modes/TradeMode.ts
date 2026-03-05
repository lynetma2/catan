import type {ResourcePanel} from "../ResourcePanel";
import {ResourcePanelModeKind, type ResourcePanelMode, type TradeModeState} from "../types";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent";

export class TradeMode implements ResourcePanelMode<TradeModeState> {
    private selectedIds = new Set<string>();

    constructor(private panel: ResourcePanel, initialSelection?: string) {
        if (initialSelection) {
            this.selectedIds.add(initialSelection);
        }
    }

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

    getState(): TradeModeState {
        return {
            kind: ResourcePanelModeKind.Trade,
            canConfirm: this.selectedIds.size > 0,
            selectedIds: this.selectedIds,
            label: "Select cards to offer",
            offering: Array.from(this.selectedIds)
        };
    }

    private toggleSelection(uid: string) {
        if (this.selectedIds.has(uid)) this.selectedIds.delete(uid);
        else this.selectedIds.add(uid);
    }
}