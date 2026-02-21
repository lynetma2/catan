// rendering/hud/ResourcePanelRenderer.ts
import { type ResourcePanelState } from '@/game/hud/panels/ResourcePanel';
import { type SharedState }        from '@/game/core/SharedState';
import { type Rect }               from '@/game/types/Rect';
import { type Resources }          from '@/game/types/Player';

const RESOURCE_COLORS: Record<keyof Resources, string> = {
    wood:  '#4a7c59',
    brick: '#c0522a',
    wool:  '#a8c070',
    wheat: '#d4a843',
    ore:   '#8a8a9a',
};

export class ResourcePanelRenderer {
    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly shared: SharedState,
    ) {}

    render(_state: ResourcePanelState, bounds: Rect) {
        this.drawPanelChrome(bounds, 'Resources');

        const player = this.shared.localPlayer;
        if (!player) return;

        const entries = Object.entries(player.resources) as [keyof Resources, number][];
        entries.forEach(([type, amount], i) => {
            this.drawRow(bounds.x + 12, bounds.y + 44 + i * 26, type, amount);
        });
    }

    private drawRow(x: number, y: number, type: keyof Resources, amount: number) {
        const { ctx } = this;

        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 6, 0, Math.PI * 2);
        ctx.fillStyle = RESOURCE_COLORS[type];
        ctx.fill();

        ctx.font         = '12px monospace';
        ctx.fillStyle    = '#cccccc';
        ctx.textBaseline = 'top';
        ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), x + 18, y);

        ctx.font      = 'bold 13px monospace';
        ctx.fillStyle = amount > 0 ? '#ffffff' : '#555555';
        ctx.textAlign = 'right';
        ctx.fillText(String(amount), x + bounds.width - 24, y);
        ctx.textAlign = 'left';
    }

    private drawPanelChrome(bounds: Rect, title: string) {
        const { ctx }              = this;
        const { x, y, width, height } = bounds;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fillStyle   = 'rgba(10, 12, 20, 0.82)';
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth   = 1;
        ctx.fill();
        ctx.stroke();

        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle    = 'rgba(255,255,255,0.35)';
        ctx.textBaseline = 'top';
        ctx.fillText(title.toUpperCase(), x + 12, y + 12);
        ctx.restore();
    }
}