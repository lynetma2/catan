import {PieceRenderer, type PlayerColorLookup} from "@/game/rendering/world/PieceRenderer.ts";
import {TileRenderer} from "@/game/rendering/world/TileRenderer.ts";
import type {Camera} from "@/game/core/Camera.ts";
import {DEFAULT_WORLD_THEME, type WorldTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {WorldState} from "@/game/world/types.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {BuildTargetKind, TileKind} from "@/game/core/types.ts";
import {BuildHoverRenderer} from "@/game/rendering/world/hover/BuildHoverRenderer.ts";
import {RobberHoverRenderer} from "@/game/rendering/world/hover/RobberHoverRenderer.ts";

export class WorldRenderer {
    private readonly tileRenderer:  TileRenderer;
    private readonly pieceRenderer: PieceRenderer;
    private readonly buildHoverRenderer: BuildHoverRenderer;
    private readonly robberHoverRenderer: RobberHoverRenderer;

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
        this.buildHoverRenderer = new BuildHoverRenderer(ctx, theme.hover, camera);
        this.robberHoverRenderer = new RobberHoverRenderer(ctx, theme.hover, camera);
    }

    render(state: WorldState) {
        this.ctx.save();
        const dpr = window.devicePixelRatio ?? 1;
        this.camera.applyTransform(this.ctx, dpr);

        // Layer 1 — sea tiles
        state.tiles.tiles
            .filter(t => t.kind === TileKind.Sea)
            .forEach(t => this.tileRenderer.render(t));

        // Layer 2 — land tiles
        state.tiles.tiles
            .filter(t => t.kind !== TileKind.Sea)
            .forEach(t => this.tileRenderer.render(t));

        // Layer 3 — hex hover (behind pieces)
        if (state.buildHover.target?.kind === BuildTargetKind.Hex) {
            this.buildHoverRenderer.render(state.buildHover);
        }
        this.robberHoverRenderer.render(state.robberHover);

        // Layer 4 — pieces
        this.pieceRenderer.render(state.placements);

        // Layer 5 — vertex/edge hover and valid targets (in front of pieces)
        if (state.buildHover.target?.kind !== BuildTargetKind.Hex) {
            this.buildHoverRenderer.render(state.buildHover);
        }

        this.ctx.restore();
    }
}