// types/HudState.ts
import { type BuildPanelState } from '../hud/panels/BuildPanel';
import type {Rect} from "@/game/utils/Rect.ts";

export interface HudState {
    toast:     Toast | null;
    bounds:    HudBounds;
    panels: {
        resource: ResourcePanelState;
        build:    BuildPanelState;
    };
}

export interface HudBounds {
    build:    Rect;
    resource: Rect;
}

export interface ResourcePanelState {
    visible: boolean;
}

export interface Toast {
    message:     string;
    kind:        'error' | 'info' | 'success';
    remainingMs: number;
}

export enum ButtonType {
    drawDevelopmentCard = "DrawDevelopmentCard",
    putSettlement = "PutSettlement",
    putCity = "PutCity",
    putRoad = "PutRoad",
    endTurn = "EndTurn",
    waiting = "Waiting",
}

export enum Anchor {
    Top,
    Bottom,
    Left,
    Right,
    Center
}