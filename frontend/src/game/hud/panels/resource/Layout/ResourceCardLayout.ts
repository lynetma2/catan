// hud/panels/resource/ResourceCardLayout.ts
import {type Resolution} from '@/game/core/ResolutionManager.ts';
import {DevelopmentCardType, type Resource, ResourceType} from '@/game/core/types.ts';
import {type Rect} from '@/game/utils/Rect.ts';
import {resolveHandPanelBounds, resolveTradeLayout,} from './ResourcePanelLayout.ts';
import type {DevelopmentCard, ResourceCard} from "@/game/hud/panels/resource/types.ts";
import {TradePanelKind} from "@/game/hud/panels/resource/types.ts";

// ─── Config ───────────────────────────────────────────────────────────────────

export const CARD = {
    width:       50,
    height:      75,
    overlap:     20,
    hoverLift:   20,
    fanDistance: 35,
} as const;

const GAP_BETWEEN_DEV_AND_RES = 10;

const TRADEABLE_RESOURCE_TYPES: ResourceType[] = [
    ResourceType.Brick,
    ResourceType.Lumber,
    ResourceType.Ore,
    ResourceType.Grain,
    ResourceType.Wool,
];

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * fan       — hovered card lifts, neighbours fan outward. Used for hand rows.
 * highlight — cards stay in place, hovered card is marked via isHovered only.
 *             Used for the top resource panel where cards are a source, not picks.
 */
export type CardLayoutStyle = 'fan' | 'highlight';

interface CardOffset {
    x: number;
    y: number;
}

export interface TradeCards {
    [TradePanelKind.Hand]:     ResourceCard[];
    [TradePanelKind.Offered]:  ResourceCard[];
    [TradePanelKind.Wanted]:   ResourceCard[];
    [TradePanelKind.Selector]: ResourceCard[];
}

// ─── Public — top resource panel ─────────────────────────────────────────────

/**
 * Resolves cards for the top resource panel.
 * Cards are evenly spaced and do not fan — hover is a highlight only.
 */
export function resolveResourcePanelCards(
    resources: Resource[],
    hoveredId: string | null,
    r:         Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];
    return resolveCardsInRect(resources, resolveHandPanelBounds(r), hoveredId, 'highlight');
}

// ─── Public — single hand row (discard, browse, trade hand) ──────────────────

/**
 * Resolves cards for the hand panel only.
 * Use this in DiscardMode, BrowseMode, and any other single-row mode.
 */
export function resolveHandCards(
    hand:      Resource[],
    hoveredId: string | null,
    r:         Resolution,
): ResourceCard[] {
    if (hand.length === 0) return [];
    return resolveCardsInRect(hand, resolveHandPanelBounds(r), hoveredId, 'fan');
}

/**
 * Resolves both development and resource cards for the hand panel in Browse mode.
 * Development cards appear to the left of resource cards, separated by a small gap.
 * Both groups share the same "fan" layout when hovering.
 */
export function resolveBrowseHandCards(
    resources: Resource[],
    devs: { type: DevelopmentCardType; uid: string }[],
    hoveredId: string | null,
    r: Resolution,
): { resCards: ResourceCard[]; devCards: DevelopmentCard[] } {
    const bounds = resolveHandPanelBounds(r);
    const resCount = resources.length;
    const devCount = devs.length;
    const totalCount = resCount + devCount;
    const spacing = resolveSpacing(totalCount, bounds.width);
    const hasBoth = devCount > 0 && resCount > 0;
    const gap = hasBoth ? GAP_BETWEEN_DEV_AND_RES : 0;
    const totalWidth = CARD.width + (totalCount - 1) * spacing + gap;
    const startX = bounds.x + bounds.width / 2 - totalWidth / 2;
    const baseY = bounds.y + bounds.height - CARD.height;

    // find the hovered index in the combined sequence (devs come first)
    const hoveredIndex = (() => {
        if (hoveredId === null) return -1;
        const devIdx = devs.findIndex(d => d.uid === hoveredId);
        if (devIdx !== -1) return devIdx;
        const resIdx = resources.findIndex(r => r.uid === hoveredId);
        if (resIdx !== -1) return devCount + resIdx;
        return -1;
    })();

    // x-coordinate for a sequential card index (0..totalCount-1)
    const getX = (seqIdx: number): number => {
        if (seqIdx < devCount) return startX + seqIdx * spacing;
        return startX + devCount * spacing + gap + (seqIdx - devCount) * spacing;
    };

    // development cards
    const devCards: DevelopmentCard[] = devs.map((dev, i) => {
        const offset = resolveFanOffset(i, hoveredIndex, totalCount);
        return {
            developmentType: dev.type,
            uid: dev.uid,
            isHovered: i === hoveredIndex,
            isSelected: false,
            isDisabled: false,
            bounds: {
                x: getX(i) + offset.x,
                y: baseY + offset.y,
                width: CARD.width,
                height: CARD.height,
            },
        };
    });

    // resource cards
    const resCards: ResourceCard[] = resources.map((res, i) => {
        const seqIdx = devCount + i;
        const offset = resolveFanOffset(seqIdx, hoveredIndex, totalCount);
        return {
            resourceType: res.resourceType,
            uid: res.uid,
            isHovered: seqIdx === hoveredIndex,
            isSelected: false,
            isDisabled: false,
            bounds: {
                x: getX(seqIdx) + offset.x,
                y: baseY + offset.y,
                width: CARD.width,
                height: CARD.height,
            },
        };
    });

    return {resCards, devCards};
}

// ─── Public — full trade layout ───────────────────────────────────────────────

/**
 * Resolves all four card rows for TradeMode in a single call.
 * The `hand` row uses the same bounds as `resolveHandCards`.
 */
export function resolveTradeCards(
    resources: {
        [TradePanelKind.Hand]:    Resource[];
        [TradePanelKind.Offered]: Resource[];
        [TradePanelKind.Wanted]:  Resource[];
    },
    hoveredId: string | null,
    r:         Resolution,
): TradeCards {
    const layout   = resolveTradeLayout(r);
    const selector = resolveSelectorResources();

    return {
        [TradePanelKind.Hand]:     resolveCardsInRect(resources[TradePanelKind.Hand],    layout[TradePanelKind.Hand],     hoveredId, 'fan'),
        [TradePanelKind.Offered]:  resolveCardsInRect(resources[TradePanelKind.Offered], layout[TradePanelKind.Offered],    hoveredId, 'fan'),
        [TradePanelKind.Wanted]:   resolveCardsInRect(resources[TradePanelKind.Wanted],  layout[TradePanelKind.Wanted],   hoveredId, 'fan'),
        [TradePanelKind.Selector]: resolveCardsInRect(selector,          layout[TradePanelKind.Selector], hoveredId, 'highlight'),
    };
}

// ─── Private — selector resources ────────────────────────────────────────────

function resolveSelectorResources(): Resource[] {
    return TRADEABLE_RESOURCE_TYPES.map(t => ({
        resourceType: t,
        uid:          `selector-${t}`,
    }));
}

// ─── Private — cards in rect ──────────────────────────────────────────────────

function resolveCardsInRect(
    resources: Resource[],
    bounds:    Rect,
    hoveredId: string | null,
    style:     CardLayoutStyle,
): ResourceCard[] {
    const count      = resources.length;
    const spacing    = resolveSpacing(count, bounds.width);
    const totalWidth = CARD.width + (count - 1) * spacing;

    const startX = bounds.x + bounds.width / 2 - totalWidth / 2;
    const baseY  = bounds.y + bounds.height - CARD.height;

    const hoveredIndex = hoveredId !== null
        ? resources.findIndex(res => res.uid === hoveredId)
        : -1;

    return resources.map((resource, i) =>
        resolveCard(resource, i, startX, baseY, spacing, hoveredIndex, count, style)
    );
}

// ─── Private — single card ────────────────────────────────────────────────────

function resolveCard(
    resource:     Resource,
    index:        number,
    startX:       number,
    baseY:        number,
    spacing:      number,
    hoveredIndex: number,
    total:        number,
    style:        CardLayoutStyle,
): ResourceCard {
    const offset = style === 'fan'
        ? resolveFanOffset(index, hoveredIndex, total)
        : { x: 0, y: 0 };

    return {
        resourceType: resource.resourceType,
        uid:          resource.uid,
        isHovered:    index === hoveredIndex,
        isSelected:   false,
        isDisabled:   false,
        bounds: {
            x:      startX + index * spacing + offset.x,
            y:      baseY  + offset.y,
            width:  CARD.width,
            height: CARD.height,
        },
    };
}

// ─── Private — spacing ────────────────────────────────────────────────────────

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD.width - CARD.overlap;
    const naturalWidth   = CARD.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - CARD.width) / Math.max(count - 1, 1);
}

// ─── Private — fan offset ─────────────────────────────────────────────────────

function resolveFanOffset(
    index:        number,
    hoveredIndex: number,
    total:        number,
): CardOffset {
    if (hoveredIndex === -1) return { x: 0, y: 0 };

    if (index === hoveredIndex) {
        return { x: 0, y: -CARD.hoverLift };
    }

    const direction = index < hoveredIndex ? -1 : 1;
    const distance  = Math.abs(index - hoveredIndex);
    const fanAmount = Math.min(
        CARD.fanDistance,
        distance * (CARD.fanDistance / Math.max(total * 0.4, 1))
    );

    return { x: direction * fanAmount, y: 0 };
}