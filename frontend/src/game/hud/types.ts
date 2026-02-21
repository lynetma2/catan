// types/HudState.ts
import { type PieceType }       from './Player';
import { type BuildPanelState } from '../hud/panels/BuildPanel';
import { type Rect }            from './Rect';

export interface HudState {
    buildMode: PieceType | null;
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