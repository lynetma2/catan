// rendering/world/PieceRenderer.ts
import type {PieceTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {PlacedPiece, PlacementState} from "@/game/core/types.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {ButtonType} from "@/game/hud/types.ts";
import {BUTTON_STYLES} from "@/game/rendering/theme/ButtonTheme.ts";

export type PlayerColorLookup = (playerId: string) => string;

// Which build-button icon represents each piece kind.
// Raw SVG text is fetched from the SAME URL the build panel uses,
// so there is exactly one source of truth for the artwork.
const PIECE_BUTTON_TYPES = {
    settlement: ButtonType.putSettlement,
    city: ButtonType.putCity,
} as const;

type PieceKind = keyof typeof PIECE_BUTTON_TYPES;

export class PieceRenderer {
    private readonly rawSvgCache = new Map<PieceKind, string | null>();
    private readonly rawSvgLoading = new Set<PieceKind>();
    private readonly coloredCache = new Map<string, HTMLImageElement>();

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
            if (piece.pieceType === 'settlement') this.drawPiece(v, piece, 'settlement', this.theme.settlement);
            if (piece.pieceType === 'city') this.drawPiece(v, piece, 'city', this.theme.city);
        });
    }

    // ─── Road ─────────────────────────────────────────────────────────
    private drawRoad(e: Edge, piece: PlacedPiece) {
        const {ctx, theme} = this;
        const [v1, v2] = edge.vertices(e);

        const p1 = this.vertexToWorld(v1);
        const p2 = this.vertexToWorld(v2);

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        ctx.save();
        ctx.translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.roundRect(-len / 2, -theme.road.width / 2, len, theme.road.width, 2);
        ctx.fillStyle   = this.playerColor(piece.playerId);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    // ─── Settlement & City — SVG with embedded vector outline ────────
    private drawPiece(
        v: Vertex,
        piece: PlacedPiece,
        kind: PieceKind,
        size: { width: number; height: number },
    ) {
        const color = this.playerColor(piece.playerId);
        const img = this.getColoredIcon(kind, color);
        // null while the raw SVG/text is fetching, or incomplete while decoding —
        // the piece simply appears a frame or two later.
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const pos = this.vertexToWorld(v);
        const {ctx} = this;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1.5;
        ctx.drawImage(
            img,
            pos.x - size.width / 2,
            pos.y - size.height / 2,
            size.width,
            size.height,
        );
        ctx.restore();
    }

    // ─── Icon pipeline ────────────────────────────────────────────────
    /** Loads the SVG source text once per kind, from the build panel's own URL. */
    private getRawSvg(kind: PieceKind): string | null {
        if (this.rawSvgCache.has(kind)) return this.rawSvgCache.get(kind)!;

        if (!this.rawSvgLoading.has(kind)) {
            this.rawSvgLoading.add(kind);
            const src = BUTTON_STYLES[PIECE_BUTTON_TYPES[kind]].imageSrc;
            fetch(src)
                .then(r => r.text())
                .then(text => this.rawSvgCache.set(kind, text))
                .catch(() => this.rawSvgCache.set(kind, null));
        }
        return null; // still loading
    }

    /** Injects the player color into `currentColor`; the embedded black outline stays black. */
    private getColoredIcon(kind: PieceKind, color: string): HTMLImageElement | null {
        const raw = this.getRawSvg(kind);
        if (!raw) return null;

        const key = `${kind}_${color}`;
        let img = this.coloredCache.get(key);
        if (!img) {
            img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(
                raw
                    // Outline layer: invisible in the build panel (var fallback),
                    // solid black on the board.
                    .replace(/var\(--piece-outline,\s*transparent\)/g, '#000000')
                    // Body layer: player color.
                    .replace(/currentColor/g, color),
            );
            this.coloredCache.set(key, img);
        }
        return img;
    }

    // ─── Helpers ─────────────────────────────────────────────────────
    private vertexToWorld(v: Vertex): Vec2 {
        const screenPositions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: screenPositions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: screenPositions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }
}