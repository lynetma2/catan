// hud/panels/resource/ResourcePanelLayout.ts
import { type Resolution }             from '@/game/core/ResolutionManager';
import { hudLayout, type PanelConfig } from '@/game/hud/HudLayout';
import { Anchor }                      from '@/game/hud/types';
import { type Rect }                   from '@/game/utils/Rect';
import {TradeButtonType, TradePanelKind} from "@/game/hud/panels/resource2/types.ts";

// ─── Config ───────────────────────────────────────────────────────────────────

const HAND_PANEL: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Bottom,
    offsetX: 0,
    offsetY: -20,
    width:   500,
    height:  110,
};

const BUTTON = {
    width:  120,
    height: 36,
    gap:    8,
} as const;

const ROW_GAP = 12;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TradeLayout {
    [TradePanelKind.Hand]:     Rect;
    [TradePanelKind.Offered]:    Rect;
    [TradePanelKind.Wanted]:   Rect;
    [TradePanelKind.Selector]: Rect;

    [TradeButtonType.Cancel]:        Rect;
    [TradeButtonType.ConfirmGlobal]:  Rect;
    [TradeButtonType.ConfirmBank]:    Rect;
}

// ─── Hand panel ───────────────────────────────────────────────────────────────

/**
 * The single hand-panel rect. Used by all modes (hand, discard, browse, trade).
 */
export function resolveHandPanelBounds(r: Resolution): Rect {
    return hudLayout.resolve(HAND_PANEL, r);
}

// ─── Trade layout ─────────────────────────────────────────────────────────────

/**
 * Full trade layout. The `hand` rect is identical to `resolveHandPanelBounds`
 * and is included here for convenience so callers need only one import.
 */
export function resolveTradeLayout(r: Resolution): TradeLayout {
    const hand = resolveHandPanelBounds(r);

    const offered: Rect = {
        ...hand,
        y: hand.y - hand.height - ROW_GAP,
    };

    const wanted: Rect = {
        ...offered,
        y: offered.y - offered.height - ROW_GAP,
    };

    const selector: Rect = {
        ...wanted,
        y: wanted.y - wanted.height - ROW_GAP,
    };

    // Buttons sit to the right of the selector row, stacked vertically
    const buttonX = selector.x + selector.width + ROW_GAP;
    const buttonY = selector.y;

    const cancelButton: Rect = {
        x:      buttonX,
        y:      buttonY,
        width:  BUTTON.width,
        height: BUTTON.height,
    };

    const confirmGlobalButton: Rect = {
        x:      buttonX,
        y:      buttonY + BUTTON.height + BUTTON.gap,
        width:  BUTTON.width,
        height: BUTTON.height,
    };

    const confirmBankButton: Rect = {
        x:      buttonX,
        y:      buttonY + (BUTTON.height + BUTTON.gap) * 2,
        width:  BUTTON.width,
        height: BUTTON.height,
    };

    return {
        [TradePanelKind.Hand]:     hand,
        [TradePanelKind.Offered]:  offered,
        [TradePanelKind.Wanted]:   wanted,
        [TradePanelKind.Selector]: selector,

        [TradeButtonType.Cancel]:        cancelButton,
        [TradeButtonType.ConfirmGlobal]: confirmGlobalButton,
        [TradeButtonType.ConfirmBank]:   confirmBankButton,
    };
}