// rendering/hud/overview/PlayerOverviewRenderer.ts

import {DEFAULT_OVERVIEW_THEME, type PlayerOverviewTheme} from "@/game/rendering/hud/overview/PlayerOverviewTheme.ts";
import {PlayerRowRenderer} from "@/game/rendering/hud/overview/RowRenderer.ts";
import type {OverviewStatKind, PlayerOverviewEntry, PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import {resolveStatRects} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";

export class PlayerOverviewRenderer {
    private readonly rowRenderer: PlayerRowRenderer;

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: PlayerOverviewTheme = DEFAULT_OVERVIEW_THEME,
    ) {
        this.rowRenderer = new PlayerRowRenderer(ctx, theme.row);
    }

    render(state: PlayerOverviewState) {
        if (state.players.length === 0) return;
        drawPanelChrome(this.ctx, state.bounds, '', this.theme.panel);

        state.players.forEach(player => {
            const row = state.rows.find(r => r.playerId === player.playerId);
            if (row) this.rowRenderer.render(player, row);
        });

        // Tooltip last so it renders above every row
        if (state.hoveredStat) this.drawTooltip(state);
    }

    private drawTooltip(state: PlayerOverviewState) {
        const hovered = state.hoveredStat!;
        const row = state.rows.find(r => r.playerId === hovered.playerId);
        const player = state.players.find(p => p.playerId === hovered.playerId);
        if (!row || !player) return;
        const stat = resolveStatRects(row.bounds).find(s => s.kind === hovered.stat);
        if (!stat) return;

        const {ctx} = this;
        const t = this.theme.tooltip; // <-- reads from the top-level section now
        const label = this.tooltipLabel(player, hovered.stat);

        ctx.save();
        ctx.font = t.font;
        const w = ctx.measureText(label).width + 14;
        const h = 20;
        // Right-align to the stat so it never overflows the screen edge
        const x = stat.rect.x + stat.rect.width - w;
        const y = stat.rect.y + stat.rect.height + 4;

        // Drop shadow first, so the box visually lifts off the panel
        ctx.shadowColor = t.shadow;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, t.borderRadius);
        ctx.fillStyle = t.background;
        ctx.fill();

        // Kill the shadow before border + text
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = t.border;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = t.text;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + 7, y + h / 2 + 0.5);
        ctx.restore();
    }

    private tooltipLabel(player: PlayerOverviewEntry, kind: OverviewStatKind): string {
        switch (kind) {
            case 'victoryPoints':
                return `Victory Points: ${player.victoryPoints}`;
            case 'resources':
                return `Resource Cards: ${player.resCardCount}`;
            case 'devCards':
                return `Development Cards: ${player.devCardCount}`;
            case 'knights':
                return player.hasLargestArmy
                    ? `Knights: ${player.usedRobbers} — Largest Army (+2 VP)`
                    : `Knights Played: ${player.usedRobbers}`;
            case 'road':
                return player.hasLongestRoad
                    ? `Longest Road: ${player.longestRoadLength ?? 0} (+2 VP)`
                    : `Longest Road: ${player.longestRoadLength ?? 0}`;
        }
    }
}