// hud/panels/dice/DicePanelLayout.ts
import { type Resolution } from '@/game/core/ResolutionManager';
import { type Rect }       from '@/game/utils/Rect';

// ─── Config ───────────────────────────────────────────────────────────

const DIE_SIZE    = 48;
const DIE_GAP     = 12;
const PANEL_PAD   = 16;
const PANEL_WIDTH = DIE_SIZE * 2 + DIE_GAP + PANEL_PAD * 2;
const PANEL_HEIGHT = DIE_SIZE + PANEL_PAD * 2;

// ─── Layout ───────────────────────────────────────────────────────────

export interface DicePanelLayout {
    panel: Rect;
    die1:  Rect;
    die2:  Rect;
}

export function resolveDicePanelLayout(
    r:                Resolution,
    buildPanelBounds:  Rect,
): DicePanelLayout {
    const panel: Rect = {
        x:      r.cssWidth / 2 - PANEL_WIDTH / 2,
        y:      buildPanelBounds.y - PANEL_HEIGHT - 8,
        width:  PANEL_WIDTH,
        height: PANEL_HEIGHT,
    };

    const die1: Rect = {
        x:      panel.x + PANEL_PAD,
        y:      panel.y + PANEL_PAD,
        width:  DIE_SIZE,
        height: DIE_SIZE,
    };

    const die2: Rect = {
        x:      panel.x + PANEL_PAD + DIE_SIZE + DIE_GAP,
        y:      panel.y + PANEL_PAD,
        width:  DIE_SIZE,
        height: DIE_SIZE,
    };

    return { panel, die1, die2 };
}