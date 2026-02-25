// world/board/HexGrid.ts
import {hex, type Hex} from '@/game/utils/HexGeometry/Hex';
import { type Vertex } from '@/game/utils/HexGeometry/Vertex';
import { type Edge }   from '@/game/utils/HexGeometry/Edge';
import {
    type HexGridState,
    type Tile,
    type LandTile,
    type TileSnapshot,
    TileKind,
    type LandTileType, TileType
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

    getNeighboursOf(h: Hex): Hex[] {
        // Returns the 6 neighbours — used by HoverSystem for candidate search
        return hex.neighbors(h).filter(h => this.tiles.has(this.hexKey(h)));
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
            };
    }
}