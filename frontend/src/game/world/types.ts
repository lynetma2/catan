// world/types.ts
import { type HoverState }      from './systems/HoverSystem';
import { type PlacementState }  from './board/PlacementMap';
import { type TileState }       from './board/HexGrid';

export interface WorldState {
    hover:      HoverState;
    placements: PlacementState;
    tiles:      TileState;
}