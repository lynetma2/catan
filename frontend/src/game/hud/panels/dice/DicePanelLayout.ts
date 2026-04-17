// hud/panels/dice/DicePanelLayout.ts
import { type Resolution } from '@/game/core/ResolutionManager';
import { type Rect }       from '@/game/utils/Rect';
import { BUTTON_SIZE, BUTTON_PADDING, EDGE_MARGIN } from '@/game/hud/HudLayout';

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
): DicePanelLayout {
    // Calculate the top of the build panel based on constants
    // The build panel is anchored to the bottom with EDGE_MARGIN offset.
    // Its height is BUTTON_SIZE + 2 * BUTTON_PADDING (derived from derivePanelBounds logic)
    // y = r.cssHeight - (BUTTON_SIZE + BUTTON_PADDING * 2) - EDGE_MARGIN
    
    // However, derivePanelBounds adds padding around the buttons.
    // The buttons are at y = r.cssHeight - BUTTON_SIZE - EDGE_MARGIN (roughly)
    // Let's calculate the build panel's top Y coordinate explicitly using the constants.
    
    const buildPanelHeight = BUTTON_SIZE + BUTTON_PADDING * 2;
    const buildPanelTopY = r.cssHeight - buildPanelHeight - EDGE_MARGIN + BUTTON_PADDING; 
    // Note: The logic in HudLayout for buttons is:
    // y = r.cssHeight - height + offset
    // y = r.cssHeight - BUTTON_SIZE - EDGE_MARGIN
    // The panel bounds start at minY - BUTTON_PADDING
    // So panelTop = (r.cssHeight - BUTTON_SIZE - EDGE_MARGIN) - BUTTON_PADDING
    
    const effectiveBuildPanelTop = r.cssHeight - BUTTON_SIZE - EDGE_MARGIN - BUTTON_PADDING;

    const panel: Rect = {
        x:      r.cssWidth - PANEL_WIDTH - EDGE_MARGIN, // Align with right edge margin
        y:      effectiveBuildPanelTop - PANEL_HEIGHT - 8, // 8px gap above build panel
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