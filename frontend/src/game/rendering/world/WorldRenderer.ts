import {PieceRenderer} from "@/game/rendering/world/PieceRenderer.ts";
import {TileRenderer} from "@/game/rendering/world/TileRenderer.ts";
import {HoverRenderer} from "@/game/rendering/world/HoverRenderer.ts";
import type {Camera} from "@/game/core/Camera.ts";
import {DEFAULT_WORLD_THEME, type WorldTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {WorldState} from "@/game/world/types.ts";

export class WorldRenderer {
    private readonly tileRenderer:  TileRenderer;
    private readonly pieceRenderer: PieceRenderer;
    private readonly hoverRenderer: HoverRenderer;

    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly camera: Camera,
        theme:  WorldTheme = DEFAULT_WORLD_THEME,
    ) {
        this.tileRenderer  = new TileRenderer(ctx, theme.tile, camera);
        this.pieceRenderer = new PieceRenderer(ctx, theme.piece, camera);
        this.hoverRenderer = new HoverRenderer(ctx, theme.hover, camera);
    }

    render(state: WorldState) {
        this.ctx.save();

        // Apply camera transform — all world drawing is in world space
        this.camera.applyTransform(this.ctx);

        // ── Layer 1: Tiles ─────────────────────────────────────────────
        // Sea tiles first — they're always behind land
        state.tiles.tiles
            .filter(t => t.kind === 'sea')
            .forEach(t => this.tileRenderer.render(t));

        state.tiles.tiles
            .filter(t => t.kind !== 'sea')
            .forEach(t => this.tileRenderer.render(t));

        // ── Layer 2: Hover on tiles ────────────────────────────────────
        // Hex hover drawn after tiles but before pieces
        if (state.hover.target?.kind === 'hex') {
            this.hoverRenderer.render(state.hover);
        }

        // ── Layer 3: Pieces ───────────────────────────────────────────
        this.pieceRenderer.render(state.placements);

        // ── Layer 4: Hover on vertices and edges ──────────────────────
        // Drawn on top of pieces so placement indicators are always visible
/*        if (state.hover.target?.kind !== 'hex') {
            this.hoverRenderer.render(state.hover);
        }*/

        this.ctx.restore();
    }
}