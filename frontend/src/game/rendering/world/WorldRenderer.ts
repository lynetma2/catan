import {PieceRenderer, type PlayerColorLookup} from "@/game/rendering/world/PieceRenderer.ts";
import {TileRenderer} from "@/game/rendering/world/TileRenderer.ts";
import {HoverRenderer} from "@/game/rendering/world/HoverRenderer.ts";
import type {Camera} from "@/game/core/Camera.ts";
import {DEFAULT_WORLD_THEME, type WorldTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {WorldState} from "@/game/world/types.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {BuildTargetKind, TileKind} from "@/game/core/types.ts";

export class WorldRenderer {
    private readonly tileRenderer:  TileRenderer;
    private readonly pieceRenderer: PieceRenderer;
    private readonly hoverRenderer: HoverRenderer;

    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly camera: Camera,
        private sharedState: SharedState,
        theme:  WorldTheme = DEFAULT_WORLD_THEME,
    ) {
        const playerColor: PlayerColorLookup = (playerId) =>
            sharedState.players.get(playerId)?.color ?? '#888888';

        this.tileRenderer  = new TileRenderer(ctx, theme.tile, camera);
        this.pieceRenderer = new PieceRenderer(ctx, theme.piece, camera, playerColor);
        this.hoverRenderer = new HoverRenderer(ctx, theme.hover, camera);
    }

    render(state: WorldState) {
        this.ctx.save();
        this.camera.applyTransform(this.ctx);

        // Layer 1 — sea tiles
        state.tiles.tiles
            .filter(t => t.kind === TileKind.Sea)
            .forEach(t => this.tileRenderer.render(t));

        // Layer 2 — land tiles
        state.tiles.tiles
            .filter(t => t.kind !== TileKind.Sea)
            .forEach(t => this.tileRenderer.render(t));

        // Layer 3 — hex hover (behind pieces)
        if (state.hover.target?.kind === BuildTargetKind.Hex) {
            this.hoverRenderer.render(state.hover);
        }

        // Layer 4 — pieces
        this.pieceRenderer.render(state.placements);

        // Layer 5 — vertex/edge hover and valid targets (in front of pieces)
        if (state.hover.target?.kind !== BuildTargetKind.Hex) {
            this.hoverRenderer.render(state.hover);
        }

        this.ctx.restore();
    }
}