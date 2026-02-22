// rendering/hud/ResourcePanelRenderer.ts
import { type ResourcePanelState }  from '@/game/hud/panels/resource/types.ts';
import { type PanelTheme }          from '@/game/rendering/theme/theme.ts';
import { drawPanelChrome }          from '../panelChrome.ts';
import { ResourceCardRenderer }     from './ResourceCardRenderer.ts';

// Distinct color from the build panel — warm dark amber instead of cool dark navy
const RESOURCE_PANEL_THEME: PanelTheme = {
    background:   'rgba(28, 18, 10, 0.85)',
    borderColor:  'rgba(255, 200, 100, 0.12)',
    borderWidth:  1,
    borderRadius: 10,
    titleFont:    'bold 11px monospace',
    titleColor:   'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

export class ResourcePanelRenderer {
    private readonly cardRenderer: ResourceCardRenderer;

    constructor(private readonly ctx: CanvasRenderingContext2D) {
        this.cardRenderer = new ResourceCardRenderer(ctx);
    }

    render(state: ResourcePanelState) {
        // Panel background — always drawn even with empty hand
        drawPanelChrome(
            this.ctx,
            state.bounds,
            'Hand',
            RESOURCE_PANEL_THEME
        );

        // Cards on top of background
        if (state.resourceCards.length > 0) {
            this.cardRenderer.render(state);
        } else {
            this.drawEmptyState();
        }
    }

    private drawEmptyState() {
        const { ctx } = this;

        // Subtle hint when hand is empty
        ctx.save();
        ctx.font         = '11px monospace';
        ctx.fillStyle    = 'rgba(255, 200, 100, 0.25)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'No resources',
            this.ctx.canvas.width  / 2,
            this.ctx.canvas.height / 2
        );
        ctx.restore();
    }
}