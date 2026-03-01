import type {PieceTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {PlacedPiece, PlacementState} from "@/game/core/types.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";

export type PlayerColorLookup = (playerId: string) => string;

export class PieceRenderer {
    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly theme:  PieceTheme,
        private readonly camera: Camera,
        private readonly playerColor: PlayerColorLookup,
    ) {}

    render(placements: PlacementState) {
        // Roads first — under settlements/cities
        placements.edges.forEach(({ edge: e, piece }) => {
            this.drawRoad(e, piece);
        });

        placements.vertices.forEach(({ vertex: v, piece }) => {
            if (piece.pieceType === 'settlement') this.drawSettlement(v, piece);
            if (piece.pieceType === 'city')       this.drawCity(v, piece);
        });
    }

    // ─── Road ─────────────────────────────────────────────────────────

    private drawRoad(e: Edge, piece: PlacedPiece) {
        const { ctx, theme, camera } = this;
        const [v1, v2] = edge.vertices(e);

        const p1 = this.vertexToWorld(v1);
        const p2 = this.vertexToWorld(v2);

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        ctx.save();
        ctx.translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        ctx.rotate(angle);

        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        ctx.beginPath();
        ctx.roundRect(
            -len / 2,
            -theme.road.width / 2,
            len,
            theme.road.width,
            2
        );
        ctx.fillStyle   = this.playerColor(piece.playerId);   // player color from SharedState lookup
        ctx.fill();
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth   = theme.strokeWidth;
        ctx.stroke();

        ctx.restore();
    }

    // ─── Settlement ───────────────────────────────────────────────────

    private drawSettlement(v: Vertex, piece: PlacedPiece) {
        const { ctx, theme } = this;
        const pos            = this.vertexToWorld(v);
        const { width, height } = theme.settlement;

        const x = pos.x - width  / 2;
        const y = pos.y - height / 2;

        // House body
        ctx.beginPath();
        ctx.rect(x, y + height * 0.35, width, height * 0.65);
        ctx.fillStyle   = this.playerColor(piece.playerId);
        ctx.fill();
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth   = theme.strokeWidth;
        ctx.stroke();

        // Roof triangle
        ctx.beginPath();
        ctx.moveTo(x - 2,          y + height * 0.38);
        ctx.lineTo(pos.x,          y);
        ctx.lineTo(x + width + 2,  y + height * 0.38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // ─── City ─────────────────────────────────────────────────────────

    private drawCity(v: Vertex, piece: PlacedPiece) {
        const { ctx, theme } = this;
        const pos            = this.vertexToWorld(v);
        const { width, height } = theme.city;

        const x = pos.x - width  / 2;
        const y = pos.y - height / 2;

        // Main building
        ctx.beginPath();
        ctx.rect(x, y + height * 0.3, width, height * 0.7);
        ctx.fillStyle   = this.playerColor(piece.playerId);
        ctx.fill();
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth   = theme.strokeWidth;
        ctx.stroke();

        // Tower (left side, taller)
        const towerW = width * 0.35;
        ctx.beginPath();
        ctx.rect(x, y, towerW, height * 0.7);
        ctx.fill();
        ctx.stroke();

        // Tower battlements
        ctx.beginPath();
        ctx.rect(x,              y - 4, towerW * 0.3, 4);
        ctx.rect(x + towerW * 0.5, y - 4, towerW * 0.3, 4);
        ctx.fill();
        ctx.stroke();
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private vertexToWorld(v: Vertex): Vec2 {
        // Average the screen positions of the vertex's 3 hex centers
        const screenPositions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: screenPositions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: screenPositions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }
}