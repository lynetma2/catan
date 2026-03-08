import type { ResourcePanel }              from "../ResourcePanel";
import { type BrowseModeState,
    type ResourcePanelMode,
    type PanelHit,
    ResourcePanelModeKind }           from "../types";
import { InputType,
    type NormalizedInputEvent }       from "@/game/core/Input/InputEvent";
import { GameEventSource,
    GameEventType }                   from "@/game/events/GameEventTypes.ts";

export class BrowseMode implements ResourcePanelMode<BrowseModeState> {
    private selectedIds = new Set<string>();

    constructor(private panel: ResourcePanel) {}

    onEnter() {}
    onExit() { this.selectedIds.clear(); }

    handleInput(_event: NormalizedInputEvent): boolean {
        return false;
    }

    handleHit(hit: PanelHit): boolean {
        if (hit.kind === 'hand') {
            this.panel.bus.emit({
                type:    GameEventType.TRADE_STARTED,
                payload: { initialSelection: hit.cardId },
                source:  GameEventSource.Hud,
            });
            return true;
        }
        return false;
    }

    getHandFilter(): Set<string> {
        return this.selectedIds; // always empty in browse mode
    }

    getState(): BrowseModeState {
        return {
            kind:        ResourcePanelModeKind.Browse,
            canConfirm:  false,
            selectedIds: this.selectedIds,
            label:       null,
        };
    }
}