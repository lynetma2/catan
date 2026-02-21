// rendering/hud/HudRenderer.ts
import { type HudState }             from '@/game/types/HudState';
import { type Resolution,
    type ResolutionManager }    from '@/game/core/ResolutionManager';
import { type SharedState }          from '@/game/core/SharedState';
import { type PieceType }            from '@/game/types/Player';
import { BuildPanelRenderer }        from './BuildPanelRenderer';
import { ResourcePanelRenderer }     from './ResourcePanelRenderer';

export class HudRenderer {
    private readonly buildPanelRenderer:    BuildPanelRenderer;
    private readonly resourcePanelRenderer: ResourcePanelRenderer;
    private resolution: Resolution;

    constructor(
        private readonly ctx:        CanvasRenderingContext2D,
        private readonly shared:     SharedState,
        resolutionManager:           ResolutionManager,
    ) {
        this.resolution             = resolutionManager.get();
        this.buildPanelRenderer    = new BuildPanelRenderer(ctx, shared);
        this.resourcePanelRenderer = new ResourcePanelRenderer(ctx, shared);

        resolutionManager.onChange(r => { this.resolution = r; });
    }

    render(state: HudState) {
        this.buildPanelRenderer.render(state.panels.build, state.bounds.build);
        this.resourcePanelRenderer.render(state.panels.resource, state.bounds.resource);

        if (state.toast)     this.drawToast(state.toast, state);
        if (state.buildMode) this.drawBuildModeIndicator(state.buildMode);
    }

    private drawToast(toast: NonNullable<HudState['toast']>, state: HudState) {
        const { ctx, resolution } = this;
        const w     = 260;
        const h     = 40;
        const x     = resolution.cssWidth  / 2 - w / 2;  // CSS dimensions — not pixel buffer
        const y     = resolution.cssHeight - 80;

        const alpha = Math.min(1, toast.remainingMs / 300);

        const bgColors = {
            error:   `rgba(180, 50, 50,  ${alpha * 0.9})`,
            success: `rgba(50,  150, 80,  ${alpha * 0.9})`,
            info:    `rgba(50,  100, 180, ${alpha * 0.9})`,
        };

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fillStyle = bgColors[toast.kind];
        ctx.fill();

        ctx.font         = 'bold 13px monospace';
        ctx.fillStyle    = `rgba(255,255,255,${alpha})`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toast.message, x + w / 2, y + h / 2);
        ctx.restore();
    }

    private drawBuildModeIndicator(pieceType: PieceType) {
        const { ctx, resolution } = this;

        ctx.save();
        ctx.font         = '12px monospace';
        ctx.fillStyle    = 'rgba(255,255,255,0.6)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(
            `Placing ${pieceType} — ESC to cancel`,
            resolution.cssWidth / 2,  // CSS dimensions
            12
        );
        ctx.restore();
    }
}