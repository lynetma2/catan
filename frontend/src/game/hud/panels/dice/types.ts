import type {DicePanelLayout} from "@/game/hud/panels/dice/DicePanelLayout.ts";

export interface DieState {
    value: number | null;
}

export interface DicePanelState {
    die1: DieState;
    die2: DieState;
    canRoll: boolean;       // local player's turn && PreRoll
    isMyTurn: boolean;      // local player's turn (any phase)
    rollIsCurrent: boolean; // displayed dice belong to the current turn
    isHovered: boolean;
    layout: DicePanelLayout;
}