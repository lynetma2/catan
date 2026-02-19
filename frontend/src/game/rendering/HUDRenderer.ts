// rendering/HudRenderer.ts
import { HudState }       from '../types/HudState';
import { SharedState }    from '../core/SharedState';
import { BuildPanel, BUILD_PANEL_BOUNDS }       from '../hud/panels/BuildPanel';
import { RESOURCE_PANEL_BOUNDS } from '../hud/panels/ResourcePanel';
import { Resources }      from '../types/Player';
import { PieceType }      from '../types/Player';

const PIECES: PieceType[] = ['road', 'settlement', 'city'];

const PIECE_COSTS: Record<PieceType, Partial<Resources>> = {
    road:       { wood: 1, brick: 1 },
    settlement: { wood: 1, brick: 1, wool: 1, wheat: 1 },
    city:       { wheat: 2, ore: 3 },
};

const PIECE_COLORS: Record<PieceType, string> = {
    road:       '#c07a3a',
    settlement: '#4a90d9',
    city:       '#7b5ea7',
};

const RESOURCE_COLORS: Record<keyof Resources, string> = {
    wood:  '#4a7c59',
    brick: '#c0522a',
    wool:  '#a8c070',
    wheat: '#d4a843',
    ore:   '#8a8a9a',
};

export class HudRenderer {
    // BuildPanel reference needed for hover/selected state
    constructor(
        private ctx:    CanvasRenderingContext2D,
        private shared: SharedState
    ) {}

    render(state: HudState) {
        this.drawBuildPanel(state);
        this.drawResourcePanel();
        if (state.toast) this.drawToast(state.toast);
        if (state.buildMode) this.drawBuildModeIndicator(state.buildMode);
    }

    // ─── Build Panel ─────────────────────────────────────────────────

    private drawBuildPanel(state: HudState) {
        const b = BUILD_PANEL_BOUNDS;
        const ctx = this.ctx;

        // Panel background
        this.drawPanel(b.x, b.y, b.width, b.height, 'Build');

        // Cards
        PIECES.forEach((piece, i) => {
            const bounds   = this.buildPanel.cardBounds(i);
            const hovered  = this.buildPanel.getHovered() === piece;
            const selected = state.panels.build.selectedPiece === piece;
            const player   = this.shared.localPlayer;
            const affordable = player
                ? this.canAfford(player.resources, PIECE_COSTS[piece])
                : false;

            this.drawBuildCard(bounds, piece, hovered, selected, affordable);
        });
    }

    private drawBuildCard(
        bounds: Rect,
        piece: PieceType,
        hovered: boolean,
        selected: boolean,
        affordable: boolean
    ) {
        const ctx = this.ctx;
        const { x, y, width, height } = bounds;

        // Card background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 6);

        if (selected) {
            ctx.fillStyle = PIECE_COLORS[piece] + 'cc';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
        } else if (hovered && affordable) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.strokeStyle = PIECE_COLORS[piece];
            ctx.lineWidth = 1.5;
        } else {
            ctx.fillStyle = affordable
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.3)';
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
        }

        ctx.fill();
        ctx.stroke();

        // Piece color swatch
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, 32, 32, 4);
        ctx.fillStyle = affordable ? PIECE_COLORS[piece] : PIECE_COLORS[piece] + '55';
        ctx.fill();

        // Piece name
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = affordable ? '#ffffff' : '#888888';
        ctx.textBaseline = 'middle';
        ctx.fillText(piece.charAt(0).toUpperCase() + piece.slice(1), x + 52, y + 18);

        // Cost icons
        const cost = PIECE_COSTS[piece];
        let iconX = x + 52;
        const iconY = y + 36;
        for (const [resource, amount] of Object.entries(cost)) {
            ctx.beginPath();
            ctx.arc(iconX + 5, iconY, 5, 0, Math.PI * 2);
            ctx.fillStyle = RESOURCE_COLORS[resource as keyof Resources];
            ctx.fill();
            ctx.font = '10px monospace';
            ctx.fillStyle = '#ccc';
            ctx.fillText(String(amount), iconX + 13, iconY + 1);
            iconX += 28;
        }

        ctx.restore();
    }

    // ─── Resource Panel ───────────────────────────────────────────────

    private drawResourcePanel() {
        const b = RESOURCE_PANEL_BOUNDS;
        const player = this.shared.localPlayer;

        this.drawPanel(b.x, b.y, b.width, b.height, 'Resources');

        if (!player) return;

        const resources = player.resources;
        const entries = Object.entries(resources) as [keyof Resources, number][];

        entries.forEach(([type, amount], i) => {
            this.drawResourceRow(b.x + 12, b.y + 44 + i * 26, type, amount);
        });
    }

    private drawResourceRow(x: number, y: number, type: keyof Resources, amount: number) {
        const ctx = this.ctx;

        // Color pip
        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 6, 0, Math.PI * 2);
        ctx.fillStyle = RESOURCE_COLORS[type];
        ctx.fill();

        // Resource name
        ctx.font = '12px monospace';
        ctx.fillStyle = '#cccccc';
        ctx.textBaseline = 'top';
        ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), x + 18, y);

        // Amount — right aligned
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = amount > 0 ? '#ffffff' : '#555555';
        ctx.textAlign = 'right';
        ctx.fillText(String(amount), x + 176, y);
        ctx.textAlign = 'left';
    }

    // ─── Toast ───────────────────────────────────────────────────────

    private drawToast(toast: HudState['toast'] & {}) {
        const ctx   = this.ctx;
        const w     = 260;
        const h     = 40;
        const x     = ctx.canvas.width / 2 - w / 2;
        const y     = ctx.canvas.height - 80;

        const alpha = Math.min(1, toast.remainingMs / 300); // fade out last 300ms

        const bgColors = {
            error:   `rgba(180, 50, 50, ${alpha * 0.9})`,
            success: `rgba(50, 150, 80, ${alpha * 0.9})`,
            info:    `rgba(50, 100, 180, ${alpha * 0.9})`,
        };

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fillStyle = bgColors[toast.kind];
        ctx.fill();

        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toast.message, x + w / 2, y + h / 2);
        ctx.restore();
    }

    // ─── Build Mode Indicator ─────────────────────────────────────────

    private drawBuildModeIndicator(pieceType: PieceType) {
        const ctx = this.ctx;
        const text = `Placing ${pieceType} — ESC to cancel`;

        ctx.save();
        ctx.font = '12px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, ctx.canvas.width / 2, 12);
        ctx.restore();
    }

    // ─── Shared panel chrome ─────────────────────────────────────────

    private drawPanel(x: number, y: number, w: number, h: number, title: string) {
        const ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fillStyle = 'rgba(10, 12, 20, 0.82)';
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.textBaseline = 'top';
        ctx.fillText(title.toUpperCase(), x + 12, y + 12);
        ctx.restore();
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private canAfford(resources: Resources, cost: Partial<Resources>): boolean {
        return (Object.keys(cost) as (keyof Resources)[])
            .every(type => resources[type] >= (cost[type] ?? 0));
    }
}