import {DiscardButtonType, type DiscardModeState} from '@/game/hud/panels/resource/types.ts';
import {type Rect} from '@/game/utils/Rect';
import {drawModeOverlay} from '../shared/ModeOverlay';

const DISCARD_STYLE = {
    overlayColor: 'rgba(80, 0, 0, 0.25)',
    labelColor:   'rgba(255, 100, 100, 0.9)',
};

const BUTTON_THEMES: Record<DiscardButtonType, { fill: string; stroke: string; label: string }> = {
    [DiscardButtonType.Confirm]: {
        fill: 'rgba(30, 100, 50, 0.85)',
        stroke: 'rgba(100, 255, 140, 0.6)',
        label: 'Discard',
    },
    [DiscardButtonType.Cancel]: {
        fill: 'rgba(120, 40, 40, 0.85)',
        stroke: 'rgba(255, 100, 100, 0.6)',
        label: 'Cancel',
    },
};

const BUTTON_HOVER_OVERLAY = 'rgba(255, 255, 255, 0.08)';

export class DiscardModeRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
    ) {
    }

    render(state: DiscardModeState) {
        drawModeOverlay(this.ctx, state.hand.bounds, DISCARD_STYLE);

        this.drawButton(
            state.buttons.cancel,
            DiscardButtonType.Cancel,
            state.hoveredButton === DiscardButtonType.Cancel,
        );
        this.drawButton(
            state.buttons.confirm,
            DiscardButtonType.Confirm,
            state.hoveredButton === DiscardButtonType.Confirm,
        );
    }

    private drawButton(bounds: Rect, kind: DiscardButtonType, hovered: boolean) {
        const {ctx} = this;
        const theme = BUTTON_THEMES[kind];

        ctx.save();

        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 6);
        ctx.fillStyle = theme.fill;
        ctx.fill();

        if (hovered) {
            ctx.fillStyle = BUTTON_HOVER_OVERLAY;
            ctx.fill();
        }

        ctx.strokeStyle = theme.stroke;
        ctx.lineWidth = hovered ? 2 : 1.5;
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(theme.label, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

        ctx.restore();
    }
}