// rendering/hud/dice/DicePanelRenderer.ts
import {type PanelTheme} from '@/game/rendering/theme/theme';
import type {DicePanelState, DieState} from "@/game/hud/panels/dice/types.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import type {Rect} from "@/game/utils/Rect.ts";

// Same warm chrome as the resource / build panels
const DICE_PANEL_THEME: PanelTheme = {
    background: 'rgba(28, 18, 10, 0.85)',
    borderColor: 'rgba(255, 200, 100, 0.12)',
    borderWidth: 1,
    borderRadius: 10,
    titleFont: 'bold 11px monospace',
    titleColor: 'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

// PreRoll: same chrome, just a touch warmer — no neon
const DICE_PANEL_THEME_ACTIVE: PanelTheme = {
    ...DICE_PANEL_THEME,
    borderColor: 'rgba(255, 200, 100, 0.45)',
    titleColor: 'rgba(255, 200, 100, 0.8)',
};

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
        const {ctx} = this;
        const {panel, status} = state.layout;

        drawPanelChrome(
            ctx,
            panel,
            '',
            state.canRoll ? DICE_PANEL_THEME_ACTIVE : DICE_PANEL_THEME,
        );

        if (state.canRoll) {
            this.drawAwaitingGlow(panel);
        } else if (state.isHovered) {
            this.drawHoverOverlay(panel);
        }

        this.drawDie(state.die1, state.layout.die1, state, 5);
        this.drawDie(state.die2, state.layout.die2, state, 2);

        if (!state.isMyTurn) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(panel.x, panel.y, panel.width, panel.height, 10);
            ctx.fillStyle = 'rgba(8, 10, 16, 0.30)';
            ctx.fill();
            ctx.restore();
        }

        // Status line ABOVE the dice
        if (state.canRoll) {
            this.drawRollHint(status);
        } else if (state.die1.value !== null && !state.rollIsCurrent) {
            this.drawLastRollCaption(status);
        }
    }

    // ─── Die ──────────────────────────────────────────────────────────
    private drawDie(die: DieState, bounds: Rect, state: DicePanelState, placeholder: number) {
        const {ctx} = this;
        const isUnrolled = die.value === null;
        const stale = !isUnrolled && !state.rollIsCurrent;

        ctx.save();
        if (stale) ctx.globalAlpha = 0.45;

        if (isUnrolled) {
            this.drawEmptySlot(bounds, state.canRoll);
            const color = state.canRoll
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(255, 255, 255, 0.15)';
            this.drawDots(placeholder, bounds, color);
        } else {
            this.drawRolledDie(bounds);
            this.drawDots(die.value!, bounds);
        }
        ctx.restore();
    }

    private drawEmptySlot(bounds: Rect, active: boolean) {
        const {ctx} = this;
        const {x, y, width, height} = bounds;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fillStyle = active ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)';
        ctx.fill();

        // Warm amber instead of neon gold
        ctx.strokeStyle = active ? 'rgba(255, 200, 100, 0.6)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        if (active) ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private drawRolledDie(bounds: Rect) {
        const { ctx } = this;
        const { x, y, width, height } = bounds;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fillStyle = 'rgba(245, 230, 190, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(80, 60, 20, 0.6)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
    }

    // ─── Dots ─────────────────────────────────────────────────────────
    private drawDots(value: number, bounds: Rect, color: string = '#2a1a0a') {
        const { ctx }   = this;
        const positions = DOT_POSITIONS[value] ?? [];
        const dotRadius = bounds.width * 0.08;
        ctx.fillStyle = color;
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

    // ─── PreRoll aura — subtle warm pulse, not a beacon ──────────────
    private drawAwaitingGlow(bounds: Rect) {
        const { ctx } = this;
        const pulse = this.pulse();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bounds.x - 1.5, bounds.y - 1.5, bounds.width + 3, bounds.height + 3, 12);
        ctx.strokeStyle = `rgba(255, 200, 100, ${0.25 + 0.25 * pulse})`;
        ctx.lineWidth = 1.5 + pulse;
        ctx.shadowColor = 'rgba(255, 200, 100, 0.5)';
        ctx.shadowBlur = 4 + 4 * pulse;
        ctx.stroke();
        ctx.restore();
    }

    // ─── Status line (inside the panel) ───────────────────────────────
    private drawRollHint(status: Rect) {
        const {ctx} = this;
        const pulse = this.pulse();
        ctx.save();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = `rgba(255, 200, 100, ${0.55 + 0.35 * pulse})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Click to roll', status.x + status.width / 2, status.y + status.height / 2);
        ctx.restore();
    }

    private drawLastRollCaption(status: Rect) {
        const {ctx} = this;
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(255, 200, 100, 0.35)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('last roll', status.x + status.width / 2, status.y + status.height / 2);
        ctx.restore();
    }

    // ─── Hover Overlay ────────────────────────────────────────────────
    private drawHoverOverlay(bounds: Rect) {
        const {ctx} = this;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    /** 0..1 sine pulse */
    private pulse(speed = 4): number {
        return 0.5 + 0.5 * Math.sin((performance.now() / 1000) * speed);
    }
}