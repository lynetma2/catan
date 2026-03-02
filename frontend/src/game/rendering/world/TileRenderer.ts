import {ResourceType, type SeaTile, type Tile, TileKind} from "@/game/core/types.ts";
import type {TileTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex, type Hex} from "@/game/utils/HexGeometry/Hex.ts";
import {RESOURCE_STYLES} from "@/game/rendering/theme/ResourceTheme.ts";

export class TileRenderer {
    private readonly imageCache = new Map<string, HTMLImageElement>();

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: TileTheme,
        private readonly camera: Camera,
    ) {}

    render(tile: Tile) {
        const corners = this.camera.hexCornersWorld(tile.hex);

        this.drawFill(tile, corners);
        this.drawStroke(corners);

        if (tile.kind === TileKind.Land) {
            this.drawToken(tile.number, tile.hex, tile.hasRobber);
        }

        if (tile.kind === TileKind.Sea && tile.isPort && tile.portFacing !== null) {
            this.drawDock(tile);
            this.drawPortIcon(tile);
        }

        if (tile.hasRobber) {
            this.drawRobber(corners);
        }
    }

    // ─── Fill ─────────────────────────────────────────────────────────

    private drawFill(tile: Tile, corners: Vec2[]) {
        const { ctx, theme } = this;

        ctx.beginPath();
        this.tracePath(corners);
        ctx.fillStyle = theme.colors[tile.type];
        ctx.fill();
    }

    // ─── Stroke ───────────────────────────────────────────────────────

    private drawStroke(corners: Vec2[]) {
        const { ctx, theme } = this;

        ctx.beginPath();
        this.tracePath(corners);
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth   = theme.strokeWidth;
        ctx.stroke();
    }

    // ─── Number token ─────────────────────────────────────────────────

    private drawToken(number: number, hex: Hex, hasRobber: boolean) {
        if (hasRobber) return;   // robber covers token

        const { ctx, theme } = this;
        const center         = this.camera.hexToWorld(hex);
        const isRed          = number === 6 || number === 8;
        const dotCount       = this.dotCount(number);

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
        const dotColor  = isRed ? theme.token.dotColorRed : theme.token.dotColor;
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

    // ─── Robber ───────────────────────────────────────────────────────

    private drawRobber(corners: Vec2[]) {
        const { ctx, theme } = this;
        const center = {
            x: corners.reduce((sum, c) => sum + c.x, 0) / corners.length,
            y: corners.reduce((sum, c) => sum + c.y, 0) / corners.length,
        };

        ctx.beginPath();
        ctx.arc(center.x, center.y, theme.robber.radius, 0, Math.PI * 2);
        ctx.fillStyle   = theme.robber.fillColor;
        ctx.fill();
        ctx.strokeStyle = theme.robber.strokeColor;
        ctx.lineWidth   = 2;
        ctx.stroke();
    }

    // ─── Port dock ────────────────────────────────────────────────────

    private drawDock(tile: SeaTile) {
        const { ctx, theme } = this;

        const center      = this.camera.hexToWorld(tile.hex);
        const neighbor    = hex.neighbor(tile.hex, tile.portFacing!);
        const neighborPos = this.camera.hexToWorld(neighbor);

        // Direction vector from sea tile toward land
        const dx  = neighborPos.x - center.x;
        const dy  = neighborPos.y - center.y;
        const len = Math.hypot(dx, dy);
        const nx  = dx / len;
        const ny  = dy / len;

        // Dock starts near sea tile center, ends at the shared edge
        const dockStart = {
            x: center.x + nx * (len * 0.15),  // ← start close to center
            y: center.y + ny * (len * 0.15),
        };
        const dockEnd = {
            x: center.x + nx * (len * 0.52),  // ← end just at the edge
            y: center.y + ny * (len * 0.52),
        };

        const px       = -ny;
        const py       =  nx;
        const halfWidth = theme.port?.dockWidth ?? 6;

        ctx.beginPath();
        ctx.moveTo(dockStart.x + px * halfWidth,       dockStart.y + py * halfWidth);
        ctx.lineTo(dockStart.x - px * halfWidth,       dockStart.y - py * halfWidth);
        ctx.lineTo(dockEnd.x   - px * halfWidth * 0.5, dockEnd.y   - py * halfWidth * 0.5);
        ctx.lineTo(dockEnd.x   + px * halfWidth * 0.5, dockEnd.y   + py * halfWidth * 0.5);
        ctx.closePath();

        ctx.fillStyle   = theme.port?.dockColor       ?? '#8B6914';
        ctx.fill();
        ctx.strokeStyle = theme.port?.dockStrokeColor ?? '#5C4510';
        ctx.lineWidth   = 1;
        ctx.stroke();
    }

    // ─── Port icon ────────────────────────────────────────────────────

    private drawPortIcon(tile: SeaTile) {
        const { ctx } = this;
        if (!tile.portType) return;

        const center = this.camera.hexToWorld(tile.hex);
        const ratio  = tile.portType === 'any' ? '3:1' : '2:1';

        // Draw resource icon if not generic port
        if (tile.portType !== 'any') {
            const style = RESOURCE_STYLES[tile.portType as ResourceType];
            const image = this.getImage(style.imageSrc);

            if (image.complete) {
                const iconSize = 18;
                ctx.drawImage(
                    image,
                    center.x - iconSize / 2,
                    center.y - iconSize - 2,
                    iconSize,
                    iconSize,
                );
            }
        } else {
            // Generic port — draw a simple star/asterisk
            ctx.font         = '18px sans-serif';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = '#ffffff';
            ctx.fillText('✦', center.x, center.y - 10);
        }

        // Ratio badge below icon
        const metrics    = ctx.measureText(ratio);
        const textWidth  = metrics.width + 6;
        const textHeight = 13;
        const textX      = center.x - textWidth / 2;
        const textY      = center.y + 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.roundRect(textX, textY, textWidth, textHeight, 3);
        ctx.fill();

        ctx.font         = 'bold 10px monospace';
        ctx.fillStyle    = '#ffffff';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(ratio, center.x, textY + 2);
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

    // ─── Helpers ──────────────────────────────────────────────────────

    private tracePath(corners: Vec2[]) {
        const { ctx } = this;
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
    }

    private dotCount(number: number): number {
        // Probability dots: 2→1, 3→2, 4→3, 5→4, 6→5, 8→5, 9→4, 10→3, 11→2, 12→1
        return 6 - Math.abs(7 - number);
    }
}