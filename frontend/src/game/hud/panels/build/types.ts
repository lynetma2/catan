import {ButtonType} from "@/game/hud/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";

export interface Button {
    type:       ButtonType;
    bounds:     Rect;
    isHovered:  boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isHidden:   boolean;
}

export interface BuildPanelState {
    bounds: Rect;
    buttons: Button[];
    playerColor: string;
    isMyTurn: boolean;
}