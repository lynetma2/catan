import type {Phase} from "@/game/state/phase/Phase.ts";

export interface UIStateHandler {
    tradingPhase: undefined;
    gamePhase: Phase;

    onUIEvent(): void;
    onInputEvent(): void;
}

export class UIStateHandlerImpl implements UIStateHandler {
    tradingPhase = undefined;
    gamePhase: Phase;

    constructor() {
        this.gamePhase = new Phase();
    }

    //Should be used to change Phase, nothing else.
    onUIEvent(): void {
    }

    //Should be delegated to the current phase.
    onInputEvent(): void {
        this.gamePhase.onClick()
    }
}