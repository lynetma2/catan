// core/Camera.ts
import { type Vec2 }               from '@/game/utils/Vec2';
import { type Hex }                from '@/game/utils/HexGeometry/Hex';
import { type Layout, layout }     from '@/game/utils/HexGeometry/Layout';
import { type Orientation }        from '@/game/utils/HexGeometry/Orientation';
import { type ResolutionManager, type Resolution } from '@/game/core/ResolutionManager';

export class Camera {
    private pan:    Vec2;
    private zoom:   number;
    private layout: Layout;  // not readonly — recalculated on resize

    private readonly orientation: Orientation;
    private readonly hexSize:     number;

    constructor(
        orientation:        Orientation,
        hexSize:            number,
        resolution:         ResolutionManager,
    ) {
        this.orientation = orientation;
        this.hexSize     = hexSize;
        this.pan         = { x: 0, y: 0 };
        this.zoom        = 1;
        this.layout      = this.createLayout(resolution.get());

        // Re-center when canvas resizes
        resolution.onChange(r => {
            this.layout = this.createLayout(r);
        });
    }

    // ─── Coordinate translation ───────────────────────────────────────

    public toWorld(screenPos: Vec2): Vec2 {
        return {
            x: (screenPos.x - this.pan.x) / this.zoom,
            y: (screenPos.y - this.pan.y) / this.zoom,
        };
    }

    public toScreen(worldPos: Vec2): Vec2 {
        return {
            x: worldPos.x * this.zoom + this.pan.x,
            y: worldPos.y * this.zoom + this.pan.y,
        };
    }

    public screenToHex(screenPos: Vec2): Hex {
        return layout.pixelToHexRounded(this.layout, this.toWorld(screenPos));
    }

    public hexToScreen(h: Hex): Vec2 {
        return this.toScreen(layout.hexToPixel(this.layout, h));
    }

    public hexCornersScreen(h: Hex): Vec2[] {
        return layout.polygonCorners(this.layout, h)
            .map(p => this.toScreen(p));
    }

    // ─── Canvas transform ─────────────────────────────────────────────

    public applyTransform(ctx: CanvasRenderingContext2D): void {
        ctx.translate(this.pan.x, this.pan.y);
        ctx.scale(this.zoom, this.zoom);
    }

    // ─── Mutation ─────────────────────────────────────────────────────

    public panBy(delta: Vec2): void {
        this.pan.x += delta.x;
        this.pan.y += delta.y;
    }

    public zoomAt(screenPos: Vec2, factor: number): void {
        this.pan.x = screenPos.x - (screenPos.x - this.pan.x) * factor;
        this.pan.y = screenPos.y - (screenPos.y - this.pan.y) * factor;
        this.zoom *= factor;
    }

    // ─── Getters ──────────────────────────────────────────────────────

    public getZoom(): number { return this.zoom; }
    public getPan():  Vec2   { return { ...this.pan }; }

    // ─── Private ──────────────────────────────────────────────────────

    private createLayout(r: Resolution): Layout {
        return layout.create(
            this.orientation,
            { x: this.hexSize, y: this.hexSize },
            { x: r.cssWidth / 2, y: r.cssHeight / 2 }  // board centered on CSS canvas
        );
    }
}