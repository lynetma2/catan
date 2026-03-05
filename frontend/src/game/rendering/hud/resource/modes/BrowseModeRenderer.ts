// rendering/hud/resource/modes/BrowseModeRenderer.ts
import { type Rect }            from '@/game/utils/Rect';
import type {BrowseModeState} from "@/game/hud/panels/resource/types.ts";

export class BrowseModeRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    render(_mode: BrowseModeState, _bounds: Rect) {
        // Nothing extra in browse mode
    }
}