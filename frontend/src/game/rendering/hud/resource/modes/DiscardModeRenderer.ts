// rendering/hud/resource/modes/DiscardModeRenderer.ts
import { type Rect }                      from '@/game/utils/Rect';
import { drawModeOverlay, drawModeLabel } from '../shared/ModeOverlay';
import type {DiscardModeState} from "@/game/hud/panels/resource/types.ts";

const DISCARD_STYLE = {
    overlayColor: 'rgba(80, 0, 0, 0.25)',
    labelColor:   'rgba(255, 100, 100, 0.9)',
};

export class DiscardModeRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    render(mode: DiscardModeState, bounds: Rect) {
        drawModeOverlay(this.ctx, bounds, DISCARD_STYLE);
        drawModeLabel(this.ctx, mode.label, bounds, DISCARD_STYLE.labelColor);
        // No confirm button — DiscardMode auto-confirms at right count
    }
}