// world/board/Board.ts
import {HexGrid} from './HexGrid';
import {PlacementMap} from './PlacementMap';
import {type PlacementSnapshot, TileKind} from "@/game/core/types.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";

export class Board {
    readonly hexGrid:      HexGrid;
    readonly placementMap: PlacementMap;

    constructor() {
        this.hexGrid      = new HexGrid();
        this.placementMap = new PlacementMap();
    }

    loadFromSnapshot(placements: PlacementSnapshot) {
        this.placementMap.clear();
        placements.roads.forEach(r =>
            this.placementMap.placeRoad(r.edge, r.playerId)
        );
        placements.settlements.forEach(s =>
            this.placementMap.placeSettlement(s.vertex, s.playerId)
        );
        placements.cities.forEach(c =>
            this.placementMap.placeCity(c.vertex, c.playerId)
        );
    }

    getValidRobberHexes(): Hex[] {
        return this.hexGrid
            .getAllTiles()
            .filter((tile) =>
                tile.kind !== TileKind.Sea &&
                !tile.hasRobber
            )
            .map(tile => tile.hex);
    }
}