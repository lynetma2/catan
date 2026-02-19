import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";

export interface InputLayer {
    priority: number;
    handleInput(event: NormalizedInputEvent): boolean;
}

