// types/HudState.ts
import { PieceType }       from './Player';
import { BuildPanelState } from '../hud/panels/BuildPanel';

export interface HudState {
    buildMode: PieceType | null;
    toast:     Toast | null;
    panels: {
        resource: ResourcePanelState;
        build:    BuildPanelState;    // ← the panel owns its own shape
    };
}

export interface ResourcePanelState {
    visible: boolean;
}

interface Toast {
    message:     string;
    kind:        'error' | 'info' | 'success';
    remainingMs: number;
}