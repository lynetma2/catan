// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import {type ResolutionManager} from '@/game/core/ResolutionManager.ts';
import type {Resource} from "@/game/core/types.ts";

export abstract class TradeOfferBasePanel<Tstate> { //TODO should extend base panel.
    // Panel owns this state — no other system needs it
    private localPlayerGiving: Resource[];
    private localPlayerRecieving: Resource[];
    private tradeOfferId: string;
    private response: boolean;
    private timer: number;

    constructor(
        private readonly resolution: ResolutionManager,
    ) {

    }

    abstract handleInput(_event: NormalizedInputEvent): boolean;

    abstract getState(): Tstate;
}