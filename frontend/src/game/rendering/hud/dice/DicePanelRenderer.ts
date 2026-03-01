
import { DEFAULT_HUD_THEME }    from '@/game/rendering/theme/theme';
import type {DicePanelState, DieState} from "@/game/hud/panels/dice/types.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import type {Rect} from "@/game/utils/Rect.ts";

// ─── Dot positions as fractions of die size ───────────────────────────

const DOT_POSITIONS: Record<number, [number, number][]> = {
    1: [[0.5,  0.5 ]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5,  0.5 ], [0.72, 0.72]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5,  0.5 ], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.5 ], [0.72, 0.5 ], [0.28, 0.72], [0.72, 0.72]],
};

export class DicePanelRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    render(state: DicePanelState) {
        drawPanelChrome(this.ctx, state.layout.panel, 'Dice', DEFAULT_HUD_THEME.panel);

        this.drawDie(state.die1, state.layout.die1, state.canRoll);
        this.drawDie(state.die2, state.layout.die2, state.canRoll);

        if (state.canRoll && state.die1.value === null) {
            this.drawRollHint(state.layout.panel);
        }
    }

    // ─── Die ──────────────────────────────────────────────────────────

    private drawDie(die: DieState, bounds: Rect, canRoll: boolean) {
        const isUnrolled = die.value === null;

        this.drawDieBackground(bounds, isUnrolled, canRoll);

        if (isUnrolled) {
            this.drawQuestionMark(bounds, canRoll);
        } else {
            this.drawDots(die.value!, bounds);
        }
    }

    private drawDieBackground(bounds: Rect, isUnrolled: boolean, canRoll: boolean) {
        const { ctx } = this;
        const { x, y, width, height } = bounds;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);

        ctx.fillStyle = isUnrolled
            ? canRoll
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.05)'
            : 'rgba(245, 230, 190, 0.95)';
        ctx.fill();

        ctx.strokeStyle = isUnrolled
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(80, 60, 20, 0.6)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
    }

    // ─── Question mark ────────────────────────────────────────────────

    private drawQuestionMark(bounds: Rect, canRoll: boolean) {
        const { ctx } = this;

        ctx.font         = 'bold 22px sans-serif';
        ctx.fillStyle    = canRoll
            ? 'rgba(255, 255, 255, 0.6)'
            : 'rgba(255, 255, 255, 0.2)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '?',
            bounds.x + bounds.width  / 2,
            bounds.y + bounds.height / 2,
        );
    }

    // ─── Dots ─────────────────────────────────────────────────────────

    private drawDots(value: number, bounds: Rect) {
        const { ctx }   = this;
        const positions = DOT_POSITIONS[value] ?? [];
        const dotRadius = bounds.width * 0.08;

        ctx.fillStyle = '#2a1a0a';

        positions.forEach(([fx, fy]) => {
            ctx.beginPath();
            ctx.arc(
                bounds.x + bounds.width  * fx,
                bounds.y + bounds.height * fy,
                dotRadius,
                0, Math.PI * 2,
            );
            ctx.fill();
        });
    }

    // ─── Roll hint ────────────────────────────────────────────────────

    private drawRollHint(panelBounds: Rect) {
        const { ctx } = this;

        ctx.font         = '11px monospace';
        ctx.fillStyle    = 'rgba(200, 170, 80, 0.7)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(
            'Click to roll',
            panelBounds.x + panelBounds.width  / 2,
            panelBounds.y + panelBounds.height + 4,
        );
    }
}