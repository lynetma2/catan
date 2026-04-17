import type {BrowseModeState} from '@/game/hud/panels/resource/types.ts';
import type {ResourceCardRenderer} from '../ResourceCardRenderer';

export class BrowseModeRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly cardRenderer: ResourceCardRenderer,
    ) {
    }

    render(_state: BrowseModeState) {
        // Hand cards are already drawn by ResourcePanelRenderer.
        // Nothing extra in browse mode.
    }
}