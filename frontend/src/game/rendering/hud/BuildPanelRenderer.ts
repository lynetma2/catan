// rendering/hud/BuildPanelRenderer.ts
import { type CanvasRenderingContext2D } from 'dom';
import { type BuildPanelState }  from '@/game/hud/panels/BuildPanel';
import { type SharedState }      from '@/game/core/SharedState';
import { type Rect }             from '@/game/types/Rect';
import { type Resources,
    type PieceType }        from '@/game/types/Player';

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

const CARD_HEIGHT  = 52;
const CARD_SPACING = 8;
const CARD_OFFSET  = 44;

export class BuildPanelRenderer {
    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly shared: SharedState,
    ) {}

    render(state: BuildPanelState, bounds: Rect) {
        this.drawPanelChrome(bounds, 'Build');

        PIECES.forEach((piece, i) => {
            const cardBounds = this.cardBounds(bounds, i);
            const player     = this.shared.localPlayer;
            const affordable = player
                ? this.canAfford(player.resources, PIECE_COSTS[piece])
                : false;

            this.drawCard(
                cardBounds,
                piece,
                state.hoveredPiece  === piece,
                state.selectedPiece === piece,
                affordable
            );
        });
    }

    private cardBounds(panelBounds: Rect, index: number): Rect {
        return {
            x:      panelBounds.x + 8,
            y:      panelBounds.y + CARD_OFFSET + index * (CARD_HEIGHT + CARD_SPACING),
            width:  panelBounds.width - 16,
            height: CARD_HEIGHT,
        };
    }

    private drawCard(
        bounds:     Rect,
        piece:      PieceType,
        hovered:    boolean,
        selected:   boolean,
        affordable: boolean
    ) {
        const { ctx } = this;
        const { x, y, width, height } = bounds;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 6);

        if (selected) {
            ctx.fillStyle   = PIECE_COLORS[piece] + 'cc';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth   = 2;
        } else if (hovered && affordable) {
            ctx.fillStyle   = 'rgba(255,255,255,0.15)';
            ctx.strokeStyle = PIECE_COLORS[piece];
            ctx.lineWidth   = 1.5;
        } else {
            ctx.fillStyle   = affordable ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)';
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth   = 1;
        }
        ctx.fill();
        ctx.stroke();

        // Color swatch
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, 32, 32, 4);
        ctx.fillStyle = affordable ? PIECE_COLORS[piece] : PIECE_COLORS[piece] + '55';
        ctx.fill();

        // Label
        ctx.font         = 'bold 13px monospace';
        ctx.fillStyle    = affordable ? '#ffffff' : '#888888';
        ctx.textBaseline = 'middle';
        ctx.fillText(piece.charAt(0).toUpperCase() + piece.slice(1), x + 52, y + 18);

        // Cost pips
        let iconX       = x + 52;
        const iconY     = y + 36;
        for (const [resource, amount] of Object.entries(PIECE_COSTS[piece])) {
            ctx.beginPath();
            ctx.arc(iconX + 5, iconY, 5, 0, Math.PI * 2);
            ctx.fillStyle = RESOURCE_COLORS[resource as keyof Resources];
            ctx.fill();
            ctx.font      = '10px monospace';
            ctx.fillStyle = '#ccc';
            ctx.fillText(String(amount), iconX + 13, iconY + 1);
            iconX += 28;
        }

        ctx.restore();
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

    private canAfford(resources: Resources, cost: Partial<Resources>): boolean {
        return (Object.keys(cost) as (keyof Resources)[])
            .every(k => resources[k] >= (cost[k] ?? 0));
    }
}