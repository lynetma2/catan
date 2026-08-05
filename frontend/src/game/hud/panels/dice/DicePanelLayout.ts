// hud/panels/dice/DicePanelLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {type Rect} from '@/game/utils/Rect';
import {BUTTON_PADDING, BUTTON_SIZE, EDGE_MARGIN} from '@/game/hud/HudLayout';

// ─── Config ──────────────────────────────────────────────────────────
const DIE_SIZE = 56;
const DIE_GAP = 12;
const SIDE_PAD = 12;
const TOP_PAD = 6;
const BOTTOM_PAD = 10;
const STATUS_HEIGHT = 16;  // top strip for the status text
const STATUS_GAP = 4;

const PANEL_WIDTH = DIE_SIZE * 2 + DIE_GAP + SIDE_PAD * 2;
const PANEL_HEIGHT = TOP_PAD + STATUS_HEIGHT + STATUS_GAP + DIE_SIZE + BOTTOM_PAD;

// ─── Layout ──────────────────────────────────────────────────────────
export interface DicePanelLayout {
    panel: Rect;
    die1: Rect;
    die2: Rect;
    status: Rect; // top strip — status text lives here, above the dice
}

export function resolveDicePanelLayout(r: Resolution): DicePanelLayout {
    const effectiveBuildPanelTop = r.cssHeight - BUTTON_SIZE - EDGE_MARGIN - BUTTON_PADDING;

    const panel: Rect = {
        x: r.cssWidth - PANEL_WIDTH - EDGE_MARGIN,
        y: effectiveBuildPanelTop - PANEL_HEIGHT - 8,
        width:  PANEL_WIDTH,
        height: PANEL_HEIGHT,
    };

    const status: Rect = {
        x: panel.x,
        y: panel.y + TOP_PAD,
        width: PANEL_WIDTH,
        height: STATUS_HEIGHT,
    };

    const diceY = panel.y + TOP_PAD + STATUS_HEIGHT + STATUS_GAP;

    const die1: Rect = {
        x: panel.x + SIDE_PAD,
        y: diceY,
        width:  DIE_SIZE,
        height: DIE_SIZE,
    };
    const die2: Rect = {
        x: panel.x + SIDE_PAD + DIE_SIZE + DIE_GAP,
        y: diceY,
        width:  DIE_SIZE,
        height: DIE_SIZE,
    };

    return {panel, die1, die2, status};
}