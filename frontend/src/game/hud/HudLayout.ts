// hud/HudLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {Anchor} from "@/game/hud/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";

export interface PanelConfig {
    anchorX: Anchor.Left | Anchor.Right | Anchor.Center;
    anchorY: Anchor.Top  | Anchor.Bottom | Anchor.Center;
    offsetX: number;
    offsetY: number;
    width:   number;
    height:  number;
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
            case Anchor.Left:   return offset;
            case Anchor.Right:  return r.cssWidth  - width  - offset;
            case Anchor.Center: return r.cssWidth  / 2      - width  / 2 + offset;
        }
    },

    resolveY: (anchor: PanelConfig['anchorY'], offset: number, height: number, r: Resolution): number => {
        switch (anchor) {
            case Anchor.Top:    return offset;
            case Anchor.Bottom: return r.cssHeight - height - offset;
            case Anchor.Center: return r.cssHeight / 2      - height / 2 + offset;
        }
    },
};