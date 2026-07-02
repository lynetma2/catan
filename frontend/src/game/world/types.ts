// world/types.ts
import type {HexGridState, PlacementState} from "@/game/core/types.ts";
import type {BuildHoverState} from "@/game/world/systems/hover/BuildHoverSystem.ts";
import type {RobberHoverState} from "@/game/world/systems/hover/RobberHoverSystem.ts";

export interface WorldState {
    buildHover: BuildHoverState;
    robberHover: RobberHoverState;
    placements: PlacementState;
    tiles:      HexGridState;
}