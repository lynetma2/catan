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
const PADDING = 12;

const TRADE_OFFER_PANEL: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Top,
    offsetX: 0,
    offsetY: 0,
    width: 250,
    height: PADDING * 2 + 100 + 45,
};

const CARD = {
    width: 30,
    height: 45,
    overlap: 0
};

const BUTTON_GAP = 6;
const BUTTON_HEIGHT = 28;
const BUTTON_WIDTH = 44;
const TRADE_OFFER_GAP = 12;

const CHIP_SIZE = 30;
const CHIP_GAP = 6;
const DOT_RADIUS = 4;

// ─── Panel bounds ─────────────────────────────────────────────────────
export function resolveTradeOfferPanelBounds(r: Resolution, index: number): Rect {
    const rect = hudLayout.resolve(TRADE_OFFER_PANEL, r);
    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;

    return {
        ...rect,
        y: rect.y + s(TRADE_OFFER_GAP) * index,
    };
}

// ─── Trade cards ──────────────────────────────────────────────────────
export function resolveTradeCards(
    panel_bounds: Rect,
    wantedResources: Resource[],
    offeredResources: Resource[],
    hoveredId: string | null,
    r: Resolution,
): TradeOfferPanelCardsState {

    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;

    const pad = s(PADDING);
    const rowH = s(45);
    const rowGap = s(50);

    const offered: Rect = {
        x: panel_bounds.x + pad,
        y: panel_bounds.y + pad,
        height: rowH,
        width: panel_bounds.width - pad * 2,
    };

    const wanted: Rect = {
        x: panel_bounds.x + pad,
        y: panel_bounds.y + pad + rowGap,
        height: rowH,
        width: panel_bounds.width - pad * 2,
    };

    return {
        wantedResources: {
            bounds: wanted,
            cards: resolveTradeCardsInRect(wantedResources, wanted, hoveredId, scale)
        },
        offeredResources: {
            bounds: offered,
            cards: resolveTradeCardsInRect(offeredResources, offered, hoveredId, scale)
        },
    };
}

// ─── Cards in rect ────────────────────────────────────────────────────
function resolveTradeCardsInRect(
    resources: Resource[],
    bounds: Rect,
    hoveredId: string | null,
    scale: number,
): ResourceCard[] {

    const s = (v: number) => v * scale;

    const card = {
        w: s(CARD.width),
        h: s(CARD.height),
        overlap: s(CARD.overlap),
    };

    const count = resources.length;

    const spacing = resolveSpacing(count, bounds.width, card);
    const totalWidth = card.w + (count - 1) * spacing;

    const startX = bounds.x + bounds.width / 2 - totalWidth / 2;
    const baseY = bounds.y + bounds.height - card.h;

    const hoveredIndex =
        hoveredId === null
            ? -1
            : resources.findIndex(res => res.uid === hoveredId);

    return resources.map((resource, i) =>
        resolveTradeCard(resource, i, startX, baseY, spacing, hoveredIndex, card, scale)
    );
}

// ─── Single card ──────────────────────────────────────────────────────
function resolveTradeCard(
    resource: Resource,
    index: number,
    startX: number,
    baseY: number,
    spacing: number,
    hoveredIndex: number,
    card: { w: number; h: number },
    scale: number,
): ResourceCard {

    const s = (v: number) => v * scale;

    const offset = {x: s(4), y: 0};

    return {
        resourceType: resource.resourceType,
        uid: resource.uid,
        isHovered: index === hoveredIndex,
        isSelected: false,
        isDisabled: false,
        bounds: {
            x: startX + index * spacing + offset.x,
            y: baseY + offset.y,
            width: card.w,
            height: card.h,
        },
    };
}

// ─── Spacing ──────────────────────────────────────────────────────────
function resolveSpacing(
    count: number,
    panelWidth: number,
    card: { w: number; overlap: number },
): number {

    const naturalSpacing = card.w - card.overlap;
    const naturalWidth = card.w + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - card.w) / Math.max(count - 1, 1);
}

// ─── Player responses ─────────────────────────────────────────────────
export function resolvePlayerResponses(
    panel_bounds: Rect,
    playerResponses: { playerId: string; response: TradeOfferResponseKind }[],
    r: Resolution,
): { bounds: Rect; playerResponseStates: PlayerResponseState[] } {

    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;

    const chip = {
        size: s(CHIP_SIZE),
        gap: s(CHIP_GAP),
        dot: s(DOT_RADIUS),
    };

    const pad = s(PADDING);

    const bounds: Rect = {
        x: panel_bounds.x + pad,
        y: panel_bounds.y + pad + s(100),
        width: panel_bounds.width - pad * 2 - s(100),
        height: s(45),
    };

    const centerY = bounds.y + bounds.height / 2;
    const chipY = centerY - chip.size / 2;

    const playerResponseStates: PlayerResponseState[] = playerResponses.map((pr, i) => {
        const chipX = bounds.x + i * (chip.size + chip.gap);

        const cx = chipX + chip.size / 2;
        const cy = chipY + chip.size / 2;

        return {
            playerId: pr.playerId,
            response: pr.response,
            chip: {
                cx,
                cy,
                radius: chip.size / 2,
                dotCx: chipX + chip.size - chip.dot,
                dotCy: chipY + chip.size - chip.dot,
                dotRadius: chip.dot,
                initial: pr.playerId.charAt(0).toUpperCase(),
            },
        };
    });

    return {bounds, playerResponseStates};
}

// ─── Buttons ──────────────────────────────────────────────────────────
export function resolveResponseButtons(panel_bounds: Rect, r: Resolution): ButtonLayout {

    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;

    const button = {
        w: s(BUTTON_WIDTH),
        h: s(BUTTON_HEIGHT),
        gap: s(BUTTON_GAP),
    };

    const pad = s(PADDING);

    const bounds: Rect = {
        x: panel_bounds.x + panel_bounds.width - s(100),
        y: panel_bounds.y + pad + s(100),
        width: s(100) - pad,
        height: s(45),
    };

    const centerY = bounds.y + bounds.height / 2;

    const totalWidth = button.w * 2 + button.gap;
    const startX = bounds.x + (bounds.width - totalWidth) / 2;

    const buttonY = centerY - button.h / 2;

    return {
        acceptBounds: {
            x: startX,
            y: buttonY,
            width: button.w,
            height: button.h,
        },
        rejectBounds: {
            x: startX + button.w + button.gap,
            y: buttonY,
            width: button.w,
            height: button.h,
        },
    };
}