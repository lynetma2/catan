// hud/panels/overview/PlayerOverviewLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {hudLayout, type PanelConfig} from '@/game/hud/HudLayout';
import {Anchor} from '@/game/hud/types';
import {type Rect} from '@/game/utils/Rect';
import type {PlayerOverviewEntry, PlayerRowLayout} from "@/game/hud/panels/overview/types.ts";
import type {Resource} from "@/game/core/types.ts";

// ─── Config ───────────────────────────────────────────────────────────

const TRADE_OFFER_PANEL: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Top,
    offsetX: 0,
    offsetY: 0,
    width: 250,
    height: 150,
}

const TRADE_OFFER_GAP = 12;

export function resolveTradeOfferPanelBounds(r: Resolution, index: number): Rect {
    const rect = hudLayout.resolve(TRADE_OFFER_PANEL, r);

    // Update position based on the index.
    return {
        ...rect,
        y: rect.y - TRADE_OFFER_GAP * index,
    };
}

// ─── Private — cards in rect ──────────────────────────────────────────────────

function resolveTradeCards(
    wantedResources: Resource[],
    offeredResources: Resource[],
    r: Resolution,
) {

}

function resolveTradeCard() {}

function resolvePlayerResponses() {}

function resolveResponseButtons() {}