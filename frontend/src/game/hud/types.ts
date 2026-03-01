// types/HudState.ts
import { type BuildPanelState } from './panels/build/BuildPanel.ts';
import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourcePanelState} from "@/game/hud/panels/resource/types.ts";
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import type {DicePanelState} from "@/game/hud/panels/dice/types.ts";

export interface HudState {
    toast:     Toast | null;
    panels: {
        resource: ResourcePanelState;
        build:    BuildPanelState;
        overview: PlayerOverviewState;
        dice: DicePanelState;
    };
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