// hud/panels/robberSteal/types.ts
import type {Rect} from "@/game/utils/Rect.ts";

export interface StealTarget {
    playerId: string;
    playerName: string;
    playerColor: string;
    bounds: Rect;
    isHovered: boolean;
}

export interface RobberStealPanelState {
    /** null when not in RobberSteal phase, or robber has no valid candidates — panel renders nothing */
    targets: StealTarget[] | null;
    /** Anchor point in screen space, derived from Camera.hexToScreen(robberHex). Null when targets is null. */
    anchor: { x: number; y: number } | null;
}