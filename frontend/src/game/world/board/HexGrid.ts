// world/board/HexGrid.ts
import {hex, type Hex} from '@/game/utils/HexGeometry/Hex';
import {vertex, type Vertex} from '@/game/utils/HexGeometry/Vertex';
import {edge, type Edge} from '@/game/utils/HexGeometry/Edge';
import {
    type HexGridState,
    type LandTile,
    type LandTileType,
    type Tile,
    TileKind,
    type TileSnapshot,
    TileType
} from "@/game/core/types.ts";

export class HexGrid {
    private tiles: Map<string, Tile> = new Map();

    // ─── Setup ────────────────────────────────────────────────────────

    // Called once from GAME_STATE_LOADED
    loadTiles(snapshots: TileSnapshot[]) {
        this.tiles.clear();
        snapshots.forEach(snapshot => {
            const tile = tileFromSnapshot(snapshot);
            this.tiles.set(this.hexKey(tile.hex), tile);
        });
    }

    // ─── Queries used by HoverSystem ─────────────────────────────────

    isValidVertex(v: Vertex): boolean {
        // A vertex is valid if all its hexes exist on the board
        return v.hexes.every(h => this.tiles.has(this.hexKey(h)));
    }

    isValidEdge(e: Edge): boolean {
        return e.hexes.every(h => this.tiles.has(this.hexKey(h)));
    }

    isValidHex(h: Hex): boolean {
        return this.tiles.has(this.hexKey(h));
    }

    isNotRobbedHex(hex: Hex): boolean {
        // 1. Invalid hex → cannot be a valid destination
        if (!this.isValidHex(hex)) return false;

        const tile = this.getTile(hex);
        if (!tile) return false;

        // 2. Robber cannot be on sea tiles
        if (tile.kind === TileKind.Sea) return false;

        // 3. For land/desert, return whether the robber is absent
        return !tile.hasRobber;
    }

    getNeighboursOf(h: Hex): Hex[] {
        // Returns the 6 neighbours — used by HoverSystem for candidate search
        return hex.neighbors(h).filter(h => this.tiles.has(this.hexKey(h)));
    }

    getAllVertices(): Vertex[] {
        const seen = new Set<string>();
        const result: Vertex[] = [];

        this.tiles.forEach(tile => {
            vertex.ofHex(tile.hex).forEach(v => {
                const key = vertex.toKey(v);
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(v);
                }
            });
        });

        return result;
    }

    getAllEdges(): Edge[] {
        const seen = new Set<string>();
        const result: Edge[] = [];

        this.tiles.forEach(tile => {
            edge.ofHex(tile.hex).forEach(e => {
                const key = edge.toKey(e);
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(e);
                }
            });
        });

        return result;
    }

    getAllTiles(): Tile[] {
        return Array.from(this.tiles.values());
    }

    // ─── Queries used by ResourceSystem ──────────────────────────────

    getTilesWithNumber(number: number): LandTile[] {
        return Array.from(this.tiles.values())
            .filter((t): t is LandTile => t.kind === 'land' && t.number === number && !t.hasRobber);
    }
    // ─── Queries used by BuildSystem ─────────────────────────────────

    getTile(hex: Hex): Tile | null {
        return this.tiles.get(this.hexKey(hex)) ?? null;
    }

    moveRobber(hex: Hex) {
        this.tiles.forEach(t => { t.hasRobber = false; });
        const tile = this.tiles.get(this.hexKey(hex));
        if (tile) tile.hasRobber = true;
    }

    // ─── State for renderer ───────────────────────────────────────────

    getState(): HexGridState {
        return { tiles: Array.from(this.tiles.values()) };
    }

    // ─── Private ──────────────────────────────────────────────────────

    private hexKey(hex: Hex): string {
        return `${hex.q},${hex.r},${hex.s}`;
    }
}

export function tileFromSnapshot(snapshot: TileSnapshot): Tile {
    const base = {
        hex:       snapshot.hex,
        hasRobber: snapshot.hasRobber,
    };

    switch (snapshot.kind) {
        case TileKind.Land:
            return {
                ...base,
                kind:   TileKind.Land,
                type:   snapshot.type as LandTileType,
                number: snapshot.number!,
            };

        case TileKind.Desert:
            return {
                ...base,
                kind: TileKind.Desert,
                type: TileType.Desert,
            };

        case TileKind.Sea:
            return {
                ...base,
                kind:     TileKind.Sea,
                type:     TileType.Sea,
                isPort:   snapshot.isPort,
                portType: snapshot.portType,
                portFacing: snapshot.portFacing,
            };
    }
}