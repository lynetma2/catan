import {ResourceType, type SeaTile, type Tile, TileKind} from "@/game/core/types.ts";
import type {TileTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex} from "@/game/utils/HexGeometry/Hex.ts";
import {RESOURCE_STYLES} from "@/game/rendering/theme/ResourceTheme.ts";
import {debugFlags} from "@/game/rendering/world/debugFlags.ts";

// Map your SVGs to the internal tile type strings
const TILE_WATERMARK_RESOURCE: Partial<Record<Tile['type'], ResourceType>> = {
    forest: ResourceType.Lumber,
    hills: ResourceType.Brick,
    pasture: ResourceType.Wool,
    fields: ResourceType.Grain,
    mountains: ResourceType.Ore,
};

export class TileRenderer {
    private readonly imageCache = new Map<string, HTMLImageElement>();
    private readonly watermarkCache = new Map<string, HTMLCanvasElement>();

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: TileTheme,
        private readonly camera: Camera,
    ) {}

    render(tile: Tile) {
        const corners = this.camera.hexCornersWorld(tile.hex);

        if (debugFlags.wireframe) {
            this.drawWireframe(tile, corners);
            return; // skip fill, watermark, token, robber, ports
        }

        this.drawFill(tile, corners);
        this.drawStroke(corners);

        if (tile.kind === TileKind.Land) {
            this.drawWatermark(tile, corners);
            this.drawToken(tile.number, corners);
        }
        if (tile.kind === TileKind.Sea && tile.isPort && tile.portFacing !== null) {
            this.drawDock(tile);
            this.drawPortIcon(tile);
        }
        if (tile.hasRobber) {
            this.drawBlockedTint(corners);
            this.drawRobber(corners);
        }
    }

    // ─── Watermark ─────────────────────────────────────────────────
    private drawWatermark(tile: Tile, corners: Vec2[]) {
        const watermark = this.getWatermark(tile.type);
        if (!watermark) return; // unknown type or asset still loading

        const { ctx, theme } = this;
        const center = this.centerOf(corners);
        const hexRadius = Math.hypot(corners[0].x - center.x, corners[0].y - center.y);

        const size = hexRadius * 0.36;

        // Top-left pocket — diagonally opposite the robber.
        const iconCenterX = center.x - hexRadius * 0.40;
        const iconCenterY = center.y - hexRadius * 0.46;

        ctx.save();
        ctx.globalAlpha = theme.watermark?.opacity ?? 0.15;
        ctx.drawImage(
            watermark,
            iconCenterX - size / 2,
            iconCenterY - size / 2,
            size,
            size,
        );
        ctx.restore();
    }

// ─── Number token ──────────────────────────────────────────────
    private drawToken(number: number, corners: Vec2[]) {
        const { ctx, theme } = this;
        const center = this.centerOf(corners);
        const isRed = number === 6 || number === 8;
        const dotCount = this.dotCount(number);

        // Token background circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, theme.token.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.token.background;
        ctx.fill();

        // Number text
        ctx.font         = theme.token.font;
        ctx.fillStyle    = isRed ? theme.token.textColorRed : theme.token.textColor;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(number), center.x, center.y - 4);

        // Probability dots below number
        const dotColor = isRed ? theme.token.dotColorRed : theme.token.dotColor;
        const dotRadius = 2;
        const dotSpacing = 5;
        const totalWidth = (dotCount - 1) * dotSpacing;
        const startX     = center.x - totalWidth / 2;
        const dotY       = center.y + 6;
        for (let i = 0; i < dotCount; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }
    }

    private getTintedIcon(resource: ResourceType, color: string): HTMLCanvasElement | null {
        const src = RESOURCE_STYLES[resource].imageSrc;
        const cacheKey = `${src}_${color}`;

        const cached = this.watermarkCache.get(cacheKey);
        if (cached) return cached;

        const img = this.getImage(src);
        if (!img.complete || img.naturalWidth === 0) return null;

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const wctx = canvas.getContext('2d')!;
        wctx.drawImage(img, 0, 0);
        wctx.globalCompositeOperation = 'source-in';
        wctx.fillStyle = color;
        wctx.fillRect(0, 0, canvas.width, canvas.height);

        this.watermarkCache.set(cacheKey, canvas);
        return canvas;
    }

    private getWatermark(type: Tile['type']): HTMLCanvasElement | null {
        const resource = TILE_WATERMARK_RESOURCE[type];
        if (!resource) return null;
        return this.getTintedIcon(resource, this.theme.watermark?.color ?? '#000000');
    }

    // ─── Fill ─────────────────────────────────────────────────
    private drawFill(tile: Tile, corners: Vec2[]) {
        const {ctx, theme} = this;
        ctx.beginPath();
        this.tracePath(corners);
        ctx.fillStyle = theme.colors[tile.type];
        ctx.fill();
    }

    // ─── Stroke ───────────────────────────────────────────────
    private drawStroke(corners: Vec2[]) {
        const {ctx, theme} = this;
        ctx.beginPath();
        this.tracePath(corners);
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth = theme.strokeWidth;
        ctx.stroke();
    }

    // ─── Blocked tint ───────────────────────────────────────────────
    private drawBlockedTint(corners: Vec2[]) {
        const {ctx, theme} = this;
        ctx.beginPath();
        this.tracePath(corners);
        ctx.fillStyle = theme.robber.blockedTint;
        ctx.fill();
    }

    // ─── Robber ───────────────────────────────────────────────────────
    private drawRobber(corners: Vec2[]) {
        const { ctx, theme } = this;
        const center = this.centerOf(corners);
        const hexRadius = Math.hypot(corners[0].x - center.x, corners[0].y - center.y);

        const x = center.x + hexRadius * 0.36;
        const y = center.y + hexRadius * 0.34;
        const r = hexRadius * 0.27;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.85, r * 0.75, r * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fill();
        ctx.restore();

        this.drawRobberFigure(x, y, r, theme);
    }

    private drawRobberFigure(x: number, y: number, r: number, theme: TileTheme) {
        const {ctx} = this;
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle   = theme.robber.fillColor;
        ctx.strokeStyle = theme.robber.strokeColor;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(0, -r * 0.45);
        ctx.quadraticCurveTo(r * 0.9, r * 0.40, r * 0.62, r * 0.85);
        ctx.quadraticCurveTo(0, r * 0.60, -r * 0.62, r * 0.85);
        ctx.quadraticCurveTo(-r * 0.9, r * 0.40, 0, -r * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -r * 0.5, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-r * 0.15, -r * 0.52, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.15, -r * 0.52, r * 0.07, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // ─── Port dock ────────────────────────────────────────────────────
    private drawDock(tile: SeaTile) {
        const { ctx, theme } = this;
        const center      = this.camera.hexToWorld(tile.hex);
        const neighbor    = hex.neighbor(tile.hex, tile.portFacing!);
        const neighborPos = this.camera.hexToWorld(neighbor);

        const dx  = neighborPos.x - center.x;
        const dy  = neighborPos.y - center.y;
        const len = Math.hypot(dx, dy);
        const nx  = dx / len;
        const ny  = dy / len;
        const px = -ny;
        const py = nx;

        const halfWidth = theme.port?.dockWidth ?? 5;

        // Pier runs from the shared edge (t ≈ 0.50) to just before the badge
        const edgeT = 0.50;
        const innerT = 0.30;
        const ex = center.x + nx * len * edgeT;
        const ey = center.y + ny * len * edgeT;
        const ix = center.x + nx * len * innerT;
        const iy = center.y + ny * len * innerT;

        const dockColor = theme.port?.dockColor ?? '#8B6914';
        const strokeColor = theme.port?.dockStrokeColor ?? '#5C4510';

        ctx.save();

        // Deck — constant width, no wedge
        ctx.beginPath();
        ctx.moveTo(ex + px * halfWidth, ey + py * halfWidth);
        ctx.lineTo(ix + px * halfWidth, iy + py * halfWidth);
        ctx.lineTo(ix - px * halfWidth, iy - py * halfWidth);
        ctx.lineTo(ex - px * halfWidth, ey - py * halfWidth);
        ctx.closePath();
        ctx.fillStyle = dockColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Plank seams
        ctx.lineWidth = 0.75;
        for (const t of [0.35, 0.43]) {
            const cx = center.x + nx * len * t;
            const cy = center.y + ny * len * t;
            ctx.beginPath();
            ctx.moveTo(cx + px * halfWidth, cy + py * halfWidth);
            ctx.lineTo(cx - px * halfWidth, cy - py * halfWidth);
            ctx.stroke();
        }

        // Mooring posts at the seaward end
        ctx.fillStyle = strokeColor;
        for (const s of [-1, 1]) {
            ctx.beginPath();
            ctx.arc(ix + px * halfWidth * 1.15 * s, iy + py * halfWidth * 1.15 * s, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // ─── Port badge ───────────────────────────────────────────────────
    private drawPortIcon(tile: SeaTile) {
        const {ctx, theme} = this;
        if (!tile.portType) return;

        const center = this.camera.hexToWorld(tile.hex);
        const ratio = tile.portType === 'any' ? '3:1' : '2:1';
        const isGeneric = tile.portType === 'any';

        const r = 18;

        // Dark markings, like the rest of the board (tokens, watermarks, robber)
        const markColor = theme.port?.badgeText ?? '#1a1a1a';

        ctx.save();

        // Soft water shadow under the badge
        ctx.beginPath();
        ctx.arc(center.x, center.y + 1.5, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fill();

        // Disc — resource color, or token-like cream for 3:1 ports (swapped)
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isGeneric
            ? theme.port?.badgeBackground ?? 'rgba(245, 235, 215, 0.95)'
            : RESOURCE_STYLES[tile.portType as ResourceType].fillColor;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = theme.port?.discStroke ?? 'rgba(0, 0, 0, 0.4)';
        ctx.stroke();

        // Icon — top half of the disc, black tint like the board silhouettes
        const iconSize = 18;
        const iconY = center.y - 5;
        if (!isGeneric) {
            const icon = this.getTintedIcon(
                tile.portType as ResourceType,
                theme.port?.iconColor ?? '#000000',
            );
            if (icon) {
                ctx.drawImage(
                    icon,
                    center.x - iconSize / 2,
                    iconY - iconSize / 2,
                    iconSize,
                    iconSize,
                );
            }
        } else {
            // 3:1 — swapped: black star on the light disc
            ctx.font = '14px sans-serif';
            ctx.fillStyle = markColor;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✦', center.x, iconY);
        }

        // Ratio text — bottom half of the disc
        ctx.font         = 'bold 10px monospace';
        ctx.fillStyle = markColor;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ratio, center.x, center.y + 10);

        ctx.restore();
    }

    // ─── Image cache ──────────────────────────────────────────────────
    private getImage(src: string): HTMLImageElement {
        if (!this.imageCache.has(src)) {
            const img = new Image();
            img.src   = src;
            this.imageCache.set(src, img);
        }
        return this.imageCache.get(src)!;
    }

    // ─── Debug wireframe ─────────────────────────────────────────────
    private drawWireframe(tile: Tile, corners: Vec2[]) {
        const {ctx} = this;

        // Outline only — sea tinted so coastlines are readable
        ctx.beginPath();
        this.tracePath(corners);
        ctx.strokeStyle = tile.kind === TileKind.Sea
            ? 'rgba(26, 111, 168, 0.6)'
            : 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Coordinates in the middle
        const center = this.centerOf(corners);
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(`${tile.hex.q}, ${tile.hex.r}`, center.x, center.y);
    }

    // ─── Helpers ──────────────────────────────────────────────────────
    private centerOf(corners: Vec2[]): Vec2 {
        return {
            x: corners.reduce((sum, c) => sum + c.x, 0) / corners.length,
            y: corners.reduce((sum, c) => sum + c.y, 0) / corners.length,
        };
    }

    private tracePath(corners: Vec2[]) {
        const { ctx } = this;
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
    }

    private dotCount(number: number): number {
        return 6 - Math.abs(7 - number);
    }
}