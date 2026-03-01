import type {Rect} from "@/game/utils/Rect.ts";
import type {DicePanelLayout} from "@/game/hud/panels/dice/DicePanelLayout.ts";

export interface DieState {
    value: number | null;
}

export interface DicePanelState {
    die1:       DieState;
    die2:       DieState;
    canRoll:    boolean;
    layout:     DicePanelLayout;
}