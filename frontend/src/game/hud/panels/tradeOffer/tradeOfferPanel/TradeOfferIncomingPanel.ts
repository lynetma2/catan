// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import {type Resolution, type ResolutionManager} from '@/game/core/ResolutionManager.ts';
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import {resolveOverviewPanelBounds, resolvePlayerRows} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";
import type {Resource} from "@/game/core/types.ts";
import type {TradeButtonType} from "@/game/hud/panels/resource/types.ts";
import type {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";

export class TradeOfferIncomingPanel implements TradeOfferBasePanel<TradeOfferIncomingState> {
    // Panel owns this state — no other system needs it
    private localPlayerGiving: Resource[];
    private localPlayerRecieving: Resource[];
    private tradeOfferId: string;
    private response: boolean;
    private timer: number;
    private hoveringButton: TradeButtonType | null = null;

    constructor(
        private readonly resolution: ResolutionManager,
    ) {

    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): PlayerOverviewState {
        const r = this.resolution.get();
        const players = Array.from(this.players.values());

        return {
            bounds: resolveOverviewPanelBounds(players.length, r),
            players,
            rows: resolvePlayerRows(players, r),
        };
    }

    getBounds(r: Resolution) {
        return resolveOverviewPanelBounds(this.players.size, r);
    }
}