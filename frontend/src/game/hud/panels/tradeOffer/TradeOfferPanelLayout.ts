// hud/panels/tradeOffer/TradeOfferPanelLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager';
import {hudLayout, type PanelConfig} from '@/game/hud/HudLayout';
import {Anchor} from '@/game/hud/types';
import {type Rect} from '@/game/utils/Rect';
import {type Resource} from "@/game/core/types.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";
import type {
    ButtonLayout,
    PlayerResponseInput,
    PlayerResponseState,
    TradeOfferPanelCardsState,
} from "@/game/hud/panels/tradeOffer/types.ts";

// ─── Config ───────────────────────────────────────────────────────────
const PADDING = 12;              // sides + top
const BOTTOM_PADDING = 16;       // extra air under the button row
const TITLE_HEIGHT = 20;
const SECTION_LABEL_HEIGHT = 14; // reserved space above each card row
const CARD_HEIGHT = 45;
const SECTION_GAP = 12;
const RESPONSES_ROW_HEIGHT = 40; // chips get their own row
const BOTTOM_ROW_GAP = 14;       // gap between chips and buttons
const BUTTONS_ROW_HEIGHT = 34;   // buttons get their own row

const TRADE_OFFER_PANEL: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Top,
    offsetX: 0,
    offsetY: 0,
    width: 280,
    height: PADDING
        + TITLE_HEIGHT
        + (SECTION_LABEL_HEIGHT + CARD_HEIGHT) * 2
        + SECTION_GAP
        + RESPONSES_ROW_HEIGHT
        + BOTTOM_ROW_GAP
        + BUTTONS_ROW_HEIGHT
        + BOTTOM_PADDING,
};

const CARD = {
    width: 30,
    height: 45,
    overlap: 0,
};

const BUTTON_GAP = 8;
const TRADE_OFFER_GAP = 12;
const CHIP_SIZE = 34;
const CHIP_GAP = 8;
const DOT_RADIUS = 4.5;

const FALLBACK_PLAYER_COLOR = "#8a7a58";

// ─── Color helpers (player color → readable chip colors) ─────────────
function hexToRgb(hex: string): [number, number, number] {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = Number.parseInt(h, 16);
    if (h.length !== 6 || Number.isNaN(n)) {
        const f = Number.parseInt(FALLBACK_PLAYER_COLOR.slice(1), 16);
        return [(f >> 16) & 255, (f >> 8) & 255, f & 255];
    }
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Darken – chip fill */
function shade(hex: string, factor: number): string {
    const [r, g, b] = hexToRgb(hex);
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

/** Lighten – letter color, stays readable on the dark fill */
function tint(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex);
    const t = (c: number) => Math.round(c + (255 - c) * amount);
    return `rgb(${t(r)}, ${t(g)}, ${t(b)})`;
}

// ─── Row Y positions (single source of truth) ─────────────────────────
function resolveRowYs(panel_bounds: Rect, s: (v: number) => number) {
    const startY = panel_bounds.y + s(PADDING) + s(TITLE_HEIGHT);
    const offeredY = startY + s(SECTION_LABEL_HEIGHT);
    const wantedY = offeredY + s(CARD_HEIGHT) + s(SECTION_GAP) + s(SECTION_LABEL_HEIGHT);
    const responsesY = wantedY + s(CARD_HEIGHT) + s(SECTION_GAP);
    const buttonsY = responsesY + s(RESPONSES_ROW_HEIGHT) + s(BOTTOM_ROW_GAP);
    return {offeredY, wantedY, responsesY, buttonsY};
}

// ─── Panel bounds ─────────────────────────────────────────────────────
export function resolveTradeOfferPanelBounds(r: Resolution, index: number): Rect {
    const rect = hudLayout.resolve(TRADE_OFFER_PANEL, r);
    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;
    return {
        ...rect,
        // stack panels properly when multiple trades are active
        y: rect.y + s(TRADE_OFFER_GAP + TRADE_OFFER_PANEL.height) * index,
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
    const rows = resolveRowYs(panel_bounds, s);

    const offered: Rect = {
        x: panel_bounds.x + pad,
        y: rows.offeredY,
        height: s(CARD_HEIGHT),
        width: panel_bounds.width - pad * 2,
    };
    const wanted: Rect = {
        x: panel_bounds.x + pad,
        y: rows.wantedY,
        height: s(CARD_HEIGHT),
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

// ─── Player responses (chips row, player colors from SharedState) ─────
export function resolvePlayerResponses(
    panel_bounds: Rect,
    playerResponses: PlayerResponseInput[],
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
    const rows = resolveRowYs(panel_bounds, s);

    const bounds: Rect = {
        x: panel_bounds.x + pad,
        y: rows.responsesY,
        width: panel_bounds.width - pad * 2,
        height: s(RESPONSES_ROW_HEIGHT),
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
                initial: (pr.name || pr.playerId).charAt(0).toUpperCase(),
                color: pr.color,
                background: shade(pr.color, 0.3),
                textColor: tint(pr.color, 0.55),
            },
        };
    });

    return {bounds, playerResponseStates};
}

// ─── Buttons (own row → big buttons) ──────────────────────────────────
export function resolveResponseButtons(panel_bounds: Rect, r: Resolution): ButtonLayout {
    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;
    const pad = s(PADDING);
    const rows = resolveRowYs(panel_bounds, s);

    const innerWidth = panel_bounds.width - pad * 2;
    const buttonW = (innerWidth - s(BUTTON_GAP)) / 2;
    const buttonH = s(BUTTONS_ROW_HEIGHT);

    return {
        acceptBounds: {
            x: panel_bounds.x + pad,
            y: rows.buttonsY,
            width: buttonW,
            height: buttonH,
        },
        rejectBounds: {
            x: panel_bounds.x + pad + buttonW + s(BUTTON_GAP),
            y: rows.buttonsY,
            width: buttonW,
            height: buttonH,
        },
    };
}

export function resolveOutgoingButtons(panel_bounds: Rect, r: Resolution): { cancel: Rect } {
    const scale = hudLayout.scaleFor(r);
    const s = (v: number) => v * scale;
    const pad = s(PADDING);
    const rows = resolveRowYs(panel_bounds, s);

    const innerWidth = panel_bounds.width - pad * 2;
    const buttonW = (innerWidth - s(BUTTON_GAP)) / 2;

    return {
        cancel: {
            x: panel_bounds.x + panel_bounds.width - pad - buttonW,
            y: rows.buttonsY,
            width: buttonW,
            height: s(BUTTONS_ROW_HEIGHT),
        }
    };
}