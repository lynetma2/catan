// hud/panels/overview/PlayerOverviewLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {hudLayout, type PanelConfig} from '@/game/hud/HudLayout';
import {Anchor} from '@/game/hud/types';
import {type Rect} from '@/game/utils/Rect';
import type {Resource} from "@/game/core/types.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";

// ─── Config ───────────────────────────────────────────────────────────

const TRADE_OFFER_PANEL: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Top,
    offsetX: 0,
    offsetY: 0,
    width: 250,
    height: 150,
}

const CARD = {
    width: 30,
    height: 45,
    overlap: 0
};

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
    panel_bounds: Rect,
    wantedResources: Resource[],
    offeredResources: Resource[],
    hoveredId: string | null,
    r: Resolution,
) {

    const offered: Rect = {
        x: panel_bounds.x - 20,
        y: panel_bounds.y - 10,
        height: 45,
        width: panel_bounds.width,
    }

    const wanted: Rect = {
        x: panel_bounds.x - 20,
        y: panel_bounds.y - 65,
        height: 45,
        width: panel_bounds.width,
    }

    return {
        wanted: resolveTradeCardsInRect(wantedResources, wanted, hoveredId),
        offered: resolveTradeCardsInRect(offeredResources, offered, hoveredId),
    }
}

function resolveTradeCardsInRect(
    resources: Resource[],
    bounds: Rect,
    hoveredId: string | null,
): ResourceCard[] {
    const count = resources.length;
    const spacing = resolveSpacing(count, bounds.width);
    const totalWidth = CARD.width + (count - 1) * spacing;

    const startX = bounds.x + bounds.width / 2 - totalWidth / 2;
    const baseY = bounds.y + bounds.height - CARD.height;

    const hoveredIndex = hoveredId === null
        ? -1
        : resources.findIndex(res => res.uid === hoveredId);

    return resources.map((resource, i) =>
        resolveTradeCard(resource, i, startX, baseY, spacing, hoveredIndex)
    );
}

function resolveTradeCard(
    resource: Resource,
    index: number,
    startX: number,
    baseY: number,
    spacing: number,
    hoveredIndex: number
): ResourceCard {
    const offset = {x: 4, y: 0};

    return {
        resourceType: resource.resourceType,
        uid: resource.uid,
        isHovered: index === hoveredIndex,
        isSelected: false,
        isDisabled: false,
        bounds: {
            x: startX + index * spacing + offset.x,
            y: baseY + offset.y,
            width: CARD.width,
            height: CARD.height,
        },
    };
}

function resolvePlayerResponses() {}

function resolveResponseButtons() {}

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD.width - CARD.overlap;
    const naturalWidth = CARD.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - CARD.width) / Math.max(count - 1, 1);
}