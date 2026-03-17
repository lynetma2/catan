// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import type {Resource} from "@/game/core/types.ts";
import type {TradeButtonType} from "@/game/hud/panels/resource/types.ts";
import type {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import type {TradeOfferIncomingState} from "@/game/hud/panels/tradeOffer/types.ts";

export class TradeOfferIncomingPanel implements TradeOfferBasePanel<TradeOfferIncomingState> {
    // Panel owns this state — no other system needs it
    private localPlayerGiving: Resource[];
    private localPlayerRecieving: Resource[];
    private tradeOfferId: string;
    private response: boolean;
    private timer: number;
    private hoveringButton: TradeButtonType | null = null;

    constructor() {

    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): TradeOfferIncomingState {
        //TODO implement this.
    }
}