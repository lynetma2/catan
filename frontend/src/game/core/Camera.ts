// core/Camera.ts
import { type Vec2 }                    from '@/game/utils/Vec2';
import { type Hex }                     from '@/game/utils/HexGeometry/Hex';
import { type Layout, layout }          from '@/game/utils/HexGeometry/Layout';
import { type Orientation }             from '@/game/utils/HexGeometry/Orientation';

export class Camera {
    private pan:  Vec2;
    private zoom: number;
    private readonly layout: Layout;

    constructor(
        orientation:  Orientation,
        hexSize:      number,
        canvasWidth:  number,
        canvasHeight: number
    ) {
        this.pan  = { x: 0, y: 0 };
        this.zoom = 1;
        this.layout = layout.create(
            orientation,
            { x: hexSize, y: hexSize },
            { x: canvasWidth / 2, y: canvasHeight / 2 }
        );
    }

    // ─── Coordinate translation ───────────────────────────────────────

    /**
     * Screen pixel → world pixel.
     * Undoes pan and zoom so world-space operations can be performed.
     */
    public toWorld(screenPos: Vec2): Vec2 {
        return {
            x: (screenPos.x - this.pan.x) / this.zoom,
            y: (screenPos.y - this.pan.y) / this.zoom,
        };
    }

    /**
     * World pixel → screen pixel.
     * Applies zoom then pan, matching what applyTransform does to the canvas.
     */
    public toScreen(worldPos: Vec2): Vec2 {
        return {
            x: worldPos.x * this.zoom + this.pan.x,
            y: worldPos.y * this.zoom + this.pan.y,
        };
    }

    /**
     * Screen pixel → Hex.
     * Runs the full pipeline: screen → world → fractional hex → rounded hex.
     */
    public screenToHex(screenPos: Vec2): Hex {
        const worldPos = this.toWorld(screenPos);
        return layout.pixelToHexRounded(this.layout, worldPos);
    }

    /**
     * Hex center → screen pixel.
     */
    public hexToScreen(h: Hex): Vec2 {
        const worldPos = layout.hexToPixel(this.layout, h);
        return this.toScreen(worldPos);
    }

    /**
     * Returns the 6 corners of a hex already in screen space.
     * Use when drawing individual hexes without applyTransform.
     */
    public hexCornersScreen(h: Hex): Vec2[] {
        return layout.polygonCorners(this.layout, h)
            .map(p => this.toScreen(p));
    }

    // ─── Canvas transform ─────────────────────────────────────────────

    /**
     * Applies pan and zoom as a canvas transform.
     * After calling this, all ctx drawing can use world-space coordinates.
     * Always wrap in ctx.save / ctx.restore.
     */
    public applyTransform(ctx: CanvasRenderingContext2D): void {
        ctx.translate(this.pan.x, this.pan.y);
        ctx.scale(this.zoom, this.zoom);
    }

    // ─── Mutation ─────────────────────────────────────────────────────

    /**
     * Moves the camera by a screen-space delta.
     * Typically called from World.handleInput on mousemove while panning.
     */
    public panBy(delta: Vec2): void {
        this.pan.x += delta.x;
        this.pan.y += delta.y;
    }

    /**
     * Zooms toward a screen-space point by a factor.
     * Keeps the point under the cursor stable during zoom.
     */
    public zoomAt(screenPos: Vec2, factor: number): void {
        this.pan.x = screenPos.x - (screenPos.x - this.pan.x) * factor;
        this.pan.y = screenPos.y - (screenPos.y - this.pan.y) * factor;
        this.zoom *= factor;
    }

    // ─── Getters ──────────────────────────────────────────────────────

    public getZoom(): number { return this.zoom; }
    public getPan():  Vec2   { return { ...this.pan }; }
}