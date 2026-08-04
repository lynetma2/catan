import type {OverviewStatKind, PlayerOverviewEntry, PlayerRowLayout} from "@/game/hud/panels/overview/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";
import type {PlayerRowTheme} from "@/game/rendering/hud/overview/PlayerOverviewTheme.ts";
import {resolveStatRects} from "@/game/hud/panels/overview/OverviewPanelLayout.ts";

// SVG paths on a 12x12 grid, content optically centered on (6,6)
const ICONS: Record<OverviewStatKind, { path: Path2D; mode: 'fill' | 'stroke' }> = {
    victoryPoints: {
        mode: 'fill',
        path: new Path2D('M6 1.5 L7.2 4.5 L10.5 4.8 L8 7 L8.8 10.5 L6 8.8 L3.2 10.5 L4 7 L1.5 4.8 L4.8 4.5 Z')
    },
    resources: {mode: 'stroke', path: new Path2D('M3 2 h6 v8 h-6 z M3 5 h6')},
    devCards: {mode: 'stroke', path: new Path2D('M3 2 h6 v8 h-6 z M6 4.2 L7.6 6 L6 7.8 L4.4 6 Z')}, // card with diamond
    knights: {mode: 'stroke', path: new Path2D('M6 1 L10 3 V6 C10 8.5 6 11 6 11 C6 11 2 8.5 2 6 V3 Z')},
    road: {mode: 'stroke', path: new Path2D('M2.5 10 C2.5 6 6.5 6 6.5 2 M5.5 10 C5.5 6 9.5 6 9.5 2')},
};

export class PlayerRowRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly theme: PlayerRowTheme,
    ) {}

    render(player: PlayerOverviewEntry, layout: PlayerRowLayout) {
        this.drawBackground(player, layout.bounds);
        if (player.isCurrentTurn) this.drawTurnIndicator(layout.bounds);

        const line1Y = layout.bounds.y + 16;

        // ─── Line 1: Identity & Status Badges ───────────────────────
        const pipX = layout.bounds.x + 12;
        this.drawColorPip(player, pipX, line1Y);

        const nameX = pipX + 14;
        this.drawName(player, nameX, line1Y);

        let badgeX = nameX + this.getNameWidth(player) + 6;
        if (player.isLocalPlayer) {
            this.drawYouBadge(badgeX, line1Y);
            badgeX += 34;
        }
        if (player.discardStatus !== 'none') {
            this.drawDiscardStatusBadge(badgeX, line1Y, player.discardStatus);
        }

        // ─── Line 2: Stats ──────────────────────────────────────────
        this.drawStats(player, layout.bounds);
    }

    // ─── Background & Turn Indicator ────────────────────────────────
    private drawBackground(player: PlayerOverviewEntry, bounds: Rect) {
        const {ctx, theme} = this;
        const {x, y, width, height} = bounds;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.borderRadius);

        if (player.isCurrentTurn) ctx.fillStyle = theme.backgroundActive;
        else if (player.isLocalPlayer) ctx.fillStyle = theme.backgroundLocal;
        else ctx.fillStyle = theme.background;
        ctx.fill();

        if (player.isLocalPlayer) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        ctx.restore();
    }

    private drawTurnIndicator(bounds: Rect) {
        const {ctx} = this;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, 3, bounds.height, 3);
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
    }

    // ─── Line 1 Elements ────────────────────────────────────────────
    private drawColorPip(player: PlayerOverviewEntry, x: number, y: number) {
        const {ctx, theme} = this;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, theme.colorPipSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    private drawName(player: PlayerOverviewEntry, x: number, y: number) {
        const {ctx, theme} = this;
        ctx.save();
        ctx.font = theme.nameFont;
        ctx.fillStyle = theme.nameColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(player.name, x, y, 80);
        ctx.restore();
    }

    private getNameWidth(player: PlayerOverviewEntry): number {
        this.ctx.font = this.theme.nameFont;
        return Math.min(this.ctx.measureText(player.name).width, 80);
    }

    private drawYouBadge(x: number, y: number) {
        const {ctx, theme} = this;
        const text = "YOU";
        ctx.save();
        ctx.font = 'bold 8px monospace';
        const w = ctx.measureText(text).width + 8;
        const h = 12;
        const by = y - h / 2 - 1;

        ctx.beginPath();
        ctx.roundRect(x, by, w, h, 3);
        ctx.fillStyle = theme.youBadgeBackground;
        ctx.fill();

        ctx.fillStyle = theme.youBadgeColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + w / 2, by + h / 2 + 1);
        ctx.restore();
    }

    private drawDiscardStatusBadge(x: number, y: number, status: 'pending' | 'done') {
        const {ctx} = this;
        const isPending = status === 'pending';
        const text = isPending ? 'DISCARD' : 'DONE';
        const color = isPending ? '#e0a050' : '#60c060';
        const bgColor = isPending ? 'rgba(224, 160, 80, 0.15)' : 'rgba(96, 192, 96, 0.15)';

        ctx.save();
        ctx.font = 'bold 7px monospace';
        const w = ctx.measureText(text).width + 6;
        const h = 10;
        const by = y - h / 2 - 1;

        ctx.beginPath();
        ctx.roundRect(x, by, w, h, 3);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + w / 2, by + h / 2 + 1);
        ctx.restore();
    }

    // ─── Line 2: Stats (slot-based, optically centered) ─────────────
    private drawStats(player: PlayerOverviewEntry, bounds: Rect) {
        const {ctx, theme} = this;
        ctx.save();
        ctx.font = theme.statFont;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        for (const {kind, rect} of resolveStatRects(bounds)) {
            const centerY = rect.y + rect.height / 2;
            const right = rect.x + rect.width;
            const {text, color} = this.statValue(player, kind);

            const metrics = ctx.measureText(text);
            const textW = metrics.width;

            // Optical centering: shift digits so their *visible* glyph
            // (not the em-box) is centered on centerY.
            const dy = ((metrics.actualBoundingBoxAscent ?? 0) - (metrics.actualBoundingBoxDescent ?? 0)) / 2;

            const textX = right - textW;
            ctx.fillStyle = color;
            ctx.fillText(text, textX, centerY + dy);

            // Icon centered on the exact same centerY
            this.drawIcon(ICONS[kind], textX - 4 - theme.iconSize, centerY - theme.iconSize / 2, theme.iconSize, color);
        }
        ctx.restore();
    }

    private statValue(player: PlayerOverviewEntry, kind: OverviewStatKind): { text: string; color: string } {
        const {theme} = this;
        switch (kind) {
            case 'victoryPoints':
                return {text: `${player.victoryPoints}`, color: theme.vpColor};
            case 'resources':
                return {
                    text: `${player.resCardCount}`,
                    color: player.isAtDiscardRisk
                        ? theme.discardRiskColor
                        : player.resCardCount > 0
                            ? theme.statColor
                            : theme.statMutedColor,
                };
            case 'devCards':
                return {
                    text: `${player.devCardCount}`,
                    color: player.devCardCount > 0 ? theme.statColor : theme.statMutedColor
                };
            case 'knights':
                return {
                    text: `${player.usedRobbers}`,
                    color: player.hasLargestArmy ? theme.largestArmyColor : theme.statColor
                };
            case 'road':
                return {
                    text: `${player.longestRoadLength ?? 0}`,
                    color: player.hasLongestRoad ? theme.longestRoadColor : theme.statColor
                };
        }
    }

    private drawIcon(icon: {
        path: Path2D;
        mode: 'fill' | 'stroke'
    }, x: number, y: number, size: number, color: string) {
        const {ctx} = this;
        ctx.save();
        ctx.translate(x, y);
        const scale = size / 12;
        ctx.scale(scale, scale);

        if (icon.mode === 'fill') {
            ctx.fillStyle = color;
            ctx.fill(icon.path);
        } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5 / scale;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.stroke(icon.path);
        }
        ctx.restore();
    }
}