// world/types.ts
import type {HoverState} from "@/game/world/systems/hover/HoverSystem.ts";
import type {HexGridState, PlacementState} from "@/game/core/types.ts";

export interface WorldState {
    hover:      HoverState;
    placements: PlacementState;
    tiles:      HexGridState;
}