// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import {type ResolutionManager} from '@/game/core/ResolutionManager.ts';
import type {TradeButtonType} from "@/game/hud/panels/resource/types.ts";
import type {TradeOfferOutgoingState, TradeOfferPanelData} from "@/game/hud/panels/tradeOffer/types.ts";
import {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";

export class TradeOfferOutgoingPanel extends TradeOfferBasePanel<TradeOfferOutgoingState> {
    // Panel owns this state — no other system needs it
    private hoveringButton: TradeButtonType | null = null;

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData
    ) {
        super(resolution, frameQueue, sharedState, data);
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): TradeOfferOutgoingState {
        //TODO implement this.
    }
}