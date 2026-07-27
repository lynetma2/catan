import type {PlayerRowTheme} from "@/game/rendering/hud/overview/OverviewTheme.ts";
import type {PlayerOverviewEntry, PlayerRowLayout} from "@/game/hud/panels/overview/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";

export class PlayerRowRenderer {
    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: PlayerRowTheme,
    ) {}

    render(player: PlayerOverviewEntry, layout: PlayerRowLayout) {
        this.drawBackground(player, layout.bounds);
        this.drawColorPip(player, layout.bounds);
        this.drawName(player, layout.bounds);
        this.drawStats(player, layout.bounds);
        this.drawBadges(player, layout.bounds);
        if (player.isCurrentTurn) this.drawTurnIndicator(layout.bounds);
        if (player.discardStatus !== 'none') this.drawDiscardStatus(player, layout.bounds);
    }

    // ─── Background ───────────────────────────────────────────────────
    private drawBackground(player: PlayerOverviewEntry, bounds: Rect) {
        const { ctx, theme } = this;
        const { x, y, width, height } = bounds;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.borderRadius);
        ctx.fillStyle = player.isCurrentTurn
            ? theme.backgroundActive
            : theme.background;
        ctx.fill();
        ctx.restore();
    }

    // ─── Color pip ────────────────────────────────────────────────────
    private drawColorPip(player: PlayerOverviewEntry, bounds: Rect) {
        const { ctx, theme }  = this;
        const pipSize         = theme.colorPipSize;
        const x               = bounds.x + 6;
        const y               = bounds.y + bounds.height / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + pipSize / 2, y, pipSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();

        // Subtle border on pip
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.restore();
    }

    // ─── Name ─────────────────────────────────────────────────────────
    private drawName(player: PlayerOverviewEntry, bounds: Rect) {
        const { ctx, theme } = this;
        const nameX = bounds.x + theme.colorPipSize + 14;
        const nameY = bounds.y + bounds.height / 2 - 5;

        ctx.save();
        ctx.font         = theme.nameFont;
        ctx.fillStyle    = theme.nameColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'left';

        // Truncate long names
        const maxWidth = 60;
        ctx.fillText(player.name, nameX, nameY, maxWidth);
        ctx.restore();
    }

    // ─── Stats row ────────────────────────────────────────────────────
    private drawStats(player: PlayerOverviewEntry, bounds: Rect) {
        const { ctx, theme } = this;
        const nameX = bounds.x + theme.colorPipSize + 14;
        const statsY = bounds.y + bounds.height / 2 + 7;

        ctx.save();
        ctx.font         = theme.statFont;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'left';

        // Victory points — always gold
        ctx.fillStyle = theme.vpColor;
        ctx.fillText(`${player.victoryPoints}VP`, nameX, statsY);

        // Card count
        const cardX = nameX + 32;
        ctx.fillStyle = player.cardCount > 0
            ? theme.statColor
            : theme.statMutedColor;
        ctx.fillText(`${player.cardCount}🂠`, cardX, statsY);

        // Dev card count
        const devX = cardX + 28;
        ctx.fillStyle = player.devCardCount > 0
            ? theme.statColor
            : theme.statMutedColor;
        ctx.fillText(`${player.devCardCount}dev`, devX, statsY);

        ctx.restore();
    }

    // ─── Badges ───────────────────────────────────────────────────────
    private drawBadges(player: PlayerOverviewEntry, bounds: Rect) {
        const { ctx, theme } = this;
        let badgeX = bounds.x + bounds.width - 6;
        const badgeY = bounds.y + bounds.height / 2;

        ctx.save();
        ctx.font         = theme.badgeFont;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'right';

        if (player.hasLargestArmy) {
            this.drawBadge('⚔', badgeX, badgeY, '#e05050');
            badgeX -= 16;
        }
        if (player.hasLongestRoad) {
            this.drawBadge('🛣', badgeX, badgeY, '#50a0e0');
            badgeX -= 16;
        }

        ctx.restore();
    }

    private drawBadge(symbol: string, x: number, y: number, color: string) {
        const { ctx } = this;

        // Badge pill background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x - 12, y - 7, 14, 14, 4);
        ctx.fillStyle = color + '33';
        ctx.fill();
        ctx.strokeStyle = color + '88';
        ctx.lineWidth   = 1;
        ctx.stroke();

        ctx.fillStyle    = color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, x - 5, y);
        ctx.restore();
    }

    // ─── Turn indicator ───────────────────────────────────────────────

    private drawTurnIndicator(bounds: Rect) {
        const { ctx } = this;

        // Glowing left border to indicate active turn
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, 3, bounds.height, 3);
        ctx.fillStyle   = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur  = 6;
        ctx.fill();
        ctx.restore();
    }

    private drawDiscardStatus(player: PlayerOverviewEntry, bounds: Rect) {
        if (player.discardStatus === 'none') return;

        const {ctx} = this;
        const label = player.discardStatus === 'pending' ? '⏳' : '✓';
        const color = player.discardStatus === 'pending' ? '#e0a050' : '#60c060';

        ctx.save();
        ctx.font = '11px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, bounds.x + bounds.width - 34, bounds.y + bounds.height / 2);
        ctx.restore();
    }
}