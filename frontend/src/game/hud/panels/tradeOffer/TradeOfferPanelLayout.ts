// hud/panels/overview/PlayerOverviewLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {hudLayout, type PanelConfig} from '@/game/hud/HudLayout';
import {Anchor} from '@/game/hud/types';
import {type Rect} from '@/game/utils/Rect';
import type {Resource} from "@/game/core/types.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";
import type {
    ButtonLayout,
    PlayerResponseState,
    TradeOfferPanelCardsState,
    TradeOfferResponseKind
} from "@/game/hud/panels/tradeOffer/types.ts";

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

const BUTTON_GAP = 6;
const BUTTON_HEIGHT = 28;
const BUTTON_WIDTH = 44;

const TRADE_OFFER_GAP = 12;

// const RESPONSE_COLOR: Record<TradeOfferResponseKind, string> = {
//     [TradeOfferResponseKind.Accept]:   "#1D9E75",
//     [TradeOfferResponseKind.Decline]:  "#E24B4A",
//     [TradeOfferResponseKind.NoAnswer]: "#5F5E5A",
// };

const CHIP_SIZE = 30;
const CHIP_GAP = 6;
const DOT_RADIUS = 4;

export function resolveTradeOfferPanelBounds(r: Resolution, index: number): Rect {
    const rect = hudLayout.resolve(TRADE_OFFER_PANEL, r);

    // Update position based on the index.
    return {
        ...rect,
        y: rect.y - TRADE_OFFER_GAP * index,
    };
}

// ─── Private — cards in rect ──────────────────────────────────────────────────

export function resolveTradeCards(
    panel_bounds: Rect,
    wantedResources: Resource[],
    offeredResources: Resource[],
    hoveredId: string | null,
    r: Resolution,
): TradeOfferPanelCardsState {

    const offered: Rect = {
        x: panel_bounds.x - 10,
        y: panel_bounds.y - 5,
        height: 45,
        width: panel_bounds.width - 20,
    }

    const wanted: Rect = {
        x: panel_bounds.x - 10,
        y: panel_bounds.y - 55,
        height: 45,
        width: panel_bounds.width - 20,
    }

    return {
        wantedResources: {bounds: wanted, cards: resolveTradeCardsInRect(wantedResources, wanted, hoveredId)},
        offeredResources: {bounds: offered, cards: resolveTradeCardsInRect(offeredResources, offered, hoveredId)},
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

export function resolvePlayerResponses(
    panel_bounds: Rect,
    playerResponses: { playerId: string; response: TradeOfferResponseKind }[]
    //TODO add something for hover effects.
): {bounds: Rect, playerResponseStates: PlayerResponseState[]} {
    const bounds: Rect = {
        x: panel_bounds.x - 10,
        y: panel_bounds.y - 105,
        width: panel_bounds.width - 100,
        height: 45,
    };

    const centerY = bounds.y + bounds.height / 2;
    const chipY = centerY - CHIP_SIZE / 2;

    const playerResponseStates: PlayerResponseState[] = playerResponses.map((pr, i) => {
        const chipX = bounds.x + i * (CHIP_SIZE + CHIP_GAP);
        const cx = chipX + CHIP_SIZE / 2;
        const cy = chipY + CHIP_SIZE / 2;

        const chip =  {
            cx,
            cy,
            radius: CHIP_SIZE / 2,
            dotCx: chipX + CHIP_SIZE - DOT_RADIUS,
            dotCy: chipY + CHIP_SIZE - DOT_RADIUS,
            dotRadius: DOT_RADIUS,
            initial: pr.playerId.charAt(0).toUpperCase(),
        };

        return {
            playerId: pr.playerId,
            response: pr.response,
            chip,
        }
    });

    return {bounds, playerResponseStates};
}

export function resolveResponseButtons(panel_bounds: Rect): ButtonLayout {
    const bounds: Rect = {
        x: panel_bounds.x + panel_bounds.width - 100 + 10,
        y: panel_bounds.y - 105,
        width: 100 - 10,  // the reserved 100px strip minus a small left margin
        height: 45,
    };

    const centerY = bounds.y + bounds.height / 2;
    const totalWidth = BUTTON_WIDTH * 2 + BUTTON_GAP;
    const startX = bounds.x + (bounds.width - totalWidth) / 2;
    const buttonY = centerY - BUTTON_HEIGHT / 2;

    return {
        acceptBounds: {
            x: startX,
            y: buttonY,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
        },
        rejectBounds: {
            x: startX + BUTTON_WIDTH + BUTTON_GAP,
            y: buttonY,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
        },
    };
}

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD.width - CARD.overlap;
    const naturalWidth = CARD.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - CARD.width) / Math.max(count - 1, 1);
}