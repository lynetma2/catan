import {DiscardButtonType, type DiscardModeState} from '@/game/hud/panels/resource/types.ts';
import {type Rect} from '@/game/utils/Rect';
import {drawModeOverlay} from '../shared/ModeOverlay';

const DISCARD_STYLE = {
    overlayColor: 'rgba(80, 0, 0, 0.25)',
    labelColor: 'rgba(255, 100, 100, 0.9)',
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

        this.drawDiscardCounter(
            state.counter,
            state.amountSelected,
            state.mustDiscard,
        );

        const confirmEnabled = state.amountSelected === state.mustDiscard;

        this.drawButton(
            state.buttons.cancel,
            DiscardButtonType.Cancel,
            state.hoveredButton === DiscardButtonType.Cancel,
            true,
        );

        this.drawButton(
            state.buttons.confirm,
            DiscardButtonType.Confirm,
            state.hoveredButton === DiscardButtonType.Confirm,
            confirmEnabled,
        );
    }

    private drawDiscardCounter(
        bounds: Rect,
        selected: number,
        required: number,
    ) {
        const {ctx} = this;

        ctx.save();

        let color = 'rgba(235,235,235,0.95)';

        if (selected === required) {
            color = 'rgba(100,255,150,0.95)';
        } else if (selected > required) {
            color = 'rgba(255,100,100,0.95)';
        }

        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
            `${selected} / ${required}`,
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
        );

        ctx.restore();
    }

    private drawButton(
        bounds: Rect,
        kind: DiscardButtonType,
        hovered: boolean,
        enabled: boolean,
    ) {
        const {ctx} = this;
        const theme = BUTTON_THEMES[kind];

        ctx.save();

        //
        // Background
        //
        ctx.beginPath();
        ctx.roundRect(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
            6,
        );

        ctx.globalAlpha = enabled ? 1 : 0.35;
        ctx.fillStyle = enabled
            ? theme.fill
            : 'rgba(80, 80, 80, 0.8)';

        ctx.fill();

        //
        // Hover overlay
        //
        if (hovered && enabled) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = BUTTON_HOVER_OVERLAY;
            ctx.fill();
        }

        //
        // Border
        //
        ctx.globalAlpha = 1;

        ctx.strokeStyle = enabled
            ? theme.stroke
            : 'rgba(160,160,160,0.35)';

        ctx.lineWidth = hovered && enabled ? 2 : 1.5;
        ctx.stroke();

        //
        // Text
        //
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = enabled
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(210,210,210,0.95)';

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
            theme.label,
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
        );

        ctx.restore();
    }
}