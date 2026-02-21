// hud/HudLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {Anchor, ButtonType} from "@/game/hud/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";
import type {Button} from "@/game/hud/panels/BuildPanel.ts";

export interface PanelConfig {
    anchorX: Anchor.Left | Anchor.Right | Anchor.Center;
    anchorY: Anchor.Top  | Anchor.Bottom | Anchor.Center;
    offsetX: number;
    offsetY: number;
    width:   number;
    height:  number;
}

export interface ButtonConfig {
    anchorX: Anchor.Left | Anchor.Right | Anchor.Center;
    anchorY: Anchor.Top  | Anchor.Bottom | Anchor.Center;
    offsetX:  number;
    offsetY:  number;
    width:    number;
    height:   number;
}

export const hudLayout = {
    resolve: (config: PanelConfig, r: Resolution): Rect => {
        const scale  = hudLayout.scaleFor(r);
        const width  = config.width  * scale;
        const height = config.height * scale;

        const x = hudLayout.resolveX(config.anchorX, config.offsetX, width,  r);
        const y = hudLayout.resolveY(config.anchorY, config.offsetY, height, r);

        return { x, y, width, height };
    },

    scaleFor: (r: Resolution): number => {
        // Scales panels gently with screen width — clamped between 0.75 and 1.5
        return Math.min(1.5, Math.max(0.75, r.cssWidth / 1280));
    },

    resolveX: (anchor: PanelConfig['anchorX'], offset: number, width: number, r: Resolution): number => {
        switch (anchor) {
            case Anchor.Left:   return offset;                          // offset = margin from left
            case Anchor.Right:  return r.cssWidth  - width + offset;   // offset is negative, e.g. -20
            case Anchor.Center: return r.cssWidth  / 2 - width / 2 + offset;
        }
    },
    resolveY: (anchor: PanelConfig['anchorY'], offset: number, height: number, r: Resolution): number => {
        switch (anchor) {
            case Anchor.Top:    return offset;
            case Anchor.Bottom: return r.cssHeight - height + offset;   // offset is negative, e.g. -20
            case Anchor.Center: return r.cssHeight / 2 - height / 2 + offset;
        }
    },
};

const BUTTON_SIZE    = 100;
const BUTTON_PADDING = 10;

// Base distance from the right/bottom edge.
// Set to BUTTON_PADDING * 2 to match your original -20 offset.
const EDGE_MARGIN = BUTTON_PADDING * 2;

/**
 * Calculates the X offset for a button in a right-anchored row.
 * @param index The position of the button starting from the right (0-indexed)
 */
const getOffsetX = (index: number) => -(EDGE_MARGIN + index * (BUTTON_SIZE + BUTTON_PADDING));

export const BUTTON_CONFIGS: Record<ButtonType, ButtonConfig> = {
    [ButtonType.endTurn]: {
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(0), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
    [ButtonType.waiting]: { // Shares the same position as endTurn
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(0), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
    [ButtonType.putRoad]: {
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(1), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
    [ButtonType.putSettlement]: {
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(2), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
    [ButtonType.putCity]: {
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(3), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
    [ButtonType.drawDevelopmentCard]: {
        anchorX: Anchor.Right, anchorY: Anchor.Bottom,
        offsetX: getOffsetX(4), offsetY: -EDGE_MARGIN,
        width: BUTTON_SIZE,     height: BUTTON_SIZE,
    },
};

// Derives the panel bounds by finding the bounding box of all visible buttons
export function derivePanelBounds(buttons: Button[]): Rect {
    if (buttons.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    const minX = Math.min(...buttons.map(b => b.bounds.x));
    const minY = Math.min(...buttons.map(b => b.bounds.y));
    const maxX = Math.max(...buttons.map(b => b.bounds.x + b.bounds.width));
    const maxY = Math.max(...buttons.map(b => b.bounds.y + b.bounds.height));

    return {
        x:      minX - BUTTON_PADDING,
        y:      minY - BUTTON_PADDING,
        width:  maxX - minX + BUTTON_PADDING * 2,
        height: maxY - minY + BUTTON_PADDING * 2,
    };
}