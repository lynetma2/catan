// hud/panels/resource/modes/TradeMode.ts
import type { ResourcePanel }             from "../ResourcePanel";
import { ResourcePanelModeKind,
    type ResourcePanelMode,
    type TradeModeState,
    type PanelHit }                 from "../types";
import type { NormalizedInputEvent }      from "@/game/core/Input/InputEvent";
import { GameEventSource, GameEventType } from "@/game/events/GameEventTypes";
import type { Resource, ResourceType }    from "@/game/core/types";

export class TradeMode implements ResourcePanelMode<TradeModeState> {
    private selectedIds     = new Set<string>();
    private wantedResources: Resource[] = [];
    private offeredResources: Resource[] = [];

    constructor(private panel: ResourcePanel, initialSelection?: string) {
        if (initialSelection) {
            this.selectedIds.add(initialSelection);
        }
    }

    onEnter() {}
    onExit() {
        this.selectedIds.clear();
        this.wantedResources = [];
    }

    // ─── Input ────────────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        // Non-click events (keyboard shortcuts etc.) handled here in future.
        return false;
    }

    handleHit(hit: PanelHit): boolean {
        switch (hit.kind) {
            case 'offered':
                this.toggleOffered(hit.cardId);
                console.log("ToggleOffered hit.")
                return true;

            case 'wanted':
                this.removeWanted(hit.cardId);
                return true;

            case 'selector':
                this.addWanted(hit.resourceType);
                return true;

            case 'hand':
                this.toggleOffered(hit.cardId);
                return true;

            case 'tradeCancel':
                this.cancel();
                return true;

            case 'tradeConfirmGlobal':
                if (this.selectedIds.size === 0) return false;
                this.confirmGlobal();
                return true;

            case 'tradeConfirmBank':
                if (this.selectedIds.size === 0) return false;
                this.confirmBank();
                return true;

            default:
                return false;
        }
    }

    // ─── State ────────────────────────────────────────────────────────────────

    getState(): TradeModeState {
        const canConfirm = this.selectedIds.size > 0;
        return {
            kind:             ResourcePanelModeKind.Trade,
            selectedIds:      new Set(this.selectedIds),
            offeredResources: this.panel.getResources()
                .filter(r => this.selectedIds.has(r.uid)),
            wantedTypes:      this.wantedResources.map(r => r.resourceType),
            canConfirmGlobal: canConfirm,
            canConfirmBank:   canConfirm,
        };
    }

    getHandFilter(): Set<string> {
        return this.selectedIds;
    }

    /** Exposed so ResourcePanel.resolveHit() can hit-test wanted cards. */
    getWantedResources(): Resource[] {
        return this.wantedResources;
    }

    // ─── Private — actions ────────────────────────────────────────────────────

    private toggleOffered(uid: string) {
        if (this.selectedIds.has(uid)) {
            this.selectedIds.delete(uid);
        } else {
            this.selectedIds.add(uid);
        }
    }

    private addWanted(type: ResourceType) {
        const newResource: Resource = {
            resourceType: type,
            uid: `wanted-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        this.wantedResources.push(newResource);
    }

    private removeWanted(uid: string) {
        this.wantedResources = this.wantedResources.filter(r => r.uid !== uid);
    }

    private cancel() {
        this.panel.bus.emit({
            type:    GameEventType.TRADE_ENDED,
            payload: {},
            source:  GameEventSource.Hud,
        });
    }

    private confirmGlobal() {
        this.panel.bus.emit({
            type: GameEventType.TRADE_ANNOUNCED,
            payload: {
                offered: [...this.selectedIds],
                wanted:  this.wantedResources.map(r => r.resourceType),
            },
            source: GameEventSource.Hud,
        });
    }

    private confirmBank() {
        this.panel.bus.emit({
            type: GameEventType.TRADE_CONFIRMED_BANK,
            payload: {
                offered: [...this.selectedIds],
                wanted:  this.wantedResources.map(r => r.resourceType),
            },
            source: GameEventSource.Hud,
        });
    }
}