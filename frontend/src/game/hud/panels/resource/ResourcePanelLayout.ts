// hud/panels/resource/ResourcePanelLayout.ts
import { type Resolution }             from '@/game/core/ResolutionManager';
import { type ResourceCard }           from './types';
import { type Resource, ResourceType } from '@/game/core/types';
import { hudLayout, type PanelConfig } from '@/game/hud/HudLayout';
import { Anchor }                      from '@/game/hud/types';
import { type Rect }                   from '@/game/utils/Rect';

// ─── Panel config ─────────────────────────────────────────────────────────────

const PANEL_CONFIG: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Bottom,
    offsetX: 0,
    offsetY: -20,
    width:   500,
    height:  110,
};

// ─── Card config ──────────────────────────────────────────────────────────────

const CARD_CONFIG = {
    width:       50,
    height:      75,
    overlap:     20,
    hoverLift:   20,
    fanDistance: 35,
} as const;

// ─── Button config ────────────────────────────────────────────────────────────

const BUTTON_CONFIG = {
    width:  120,
    height: 36,
    gap:    8,
} as const;

// ─── Exports ──────────────────────────────────────────────────────────────────

export interface TradeLayout {
    offer:    Rect;
    wanted:   Rect;
    selector: Rect;
    cancelButton:        Rect;
    confirmGlobalButton: Rect;
    confirmBankButton:   Rect;
}

export function resolveResourcePanelBounds(r: Resolution): Rect {
    return hudLayout.resolve(PANEL_CONFIG, r);
}

export function resolveTradeLayout(r: Resolution): TradeLayout {
    const handBounds = resolveResourcePanelBounds(r);
    const gap = 12;

    const offerBounds: Rect = {
        ...handBounds,
        y: handBounds.y - handBounds.height - gap,
    };

    const wantedBounds: Rect = {
        ...offerBounds,
        y: offerBounds.y - offerBounds.height - gap,
    };

    const selectorBounds: Rect = {
        ...wantedBounds,
        y: wantedBounds.y - wantedBounds.height - gap,
    };

    // Buttons sit to the right of the selector row, stacked vertically
    const buttonX  = selectorBounds.x + selectorBounds.width + gap;
    const buttonY  = selectorBounds.y;

    const cancelButton: Rect = {
        x:      buttonX,
        y:      buttonY,
        width:  BUTTON_CONFIG.width,
        height: BUTTON_CONFIG.height,
    };

    const confirmGlobalButton: Rect = {
        x:      buttonX,
        y:      buttonY + BUTTON_CONFIG.height + BUTTON_CONFIG.gap,
        width:  BUTTON_CONFIG.width,
        height: BUTTON_CONFIG.height,
    };

    const confirmBankButton: Rect = {
        x:      buttonX,
        y:      buttonY + (BUTTON_CONFIG.height + BUTTON_CONFIG.gap) * 2,
        width:  BUTTON_CONFIG.width,
        height: BUTTON_CONFIG.height,
    };

    return {
        offer:               offerBounds,
        wanted:              wantedBounds,
        selector:            selectorBounds,
        cancelButton,
        confirmGlobalButton,
        confirmBankButton,
    };
}

export function resolveResourceCards(
    resources: Resource[],
    hoveredId: string | null,
    r:         Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];
    const panelBounds = resolveResourcePanelBounds(r);
    return resolveCardsInRect(resources, panelBounds, hoveredId);
}

export function resolveOfferCards(
    resources: Resource[],
    hoveredId: string | null,
    r:         Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];
    const layout = resolveTradeLayout(r);
    return resolveCardsInRect(resources, layout.offer, hoveredId);
}

export function resolveWantedCards(
    resources: Resource[],
    hoveredId: string | null,
    r:         Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];
    const layout = resolveTradeLayout(r);
    return resolveCardsInRect(resources, layout.wanted, hoveredId);
}

export function resolveSelectorCards(
    r:         Resolution,
    hoveredId: string | null,
): ResourceCard[] {
    const layout    = resolveTradeLayout(r);
    const types     = [
        ResourceType.Brick,
        ResourceType.Lumber,
        ResourceType.Ore,
        ResourceType.Grain,
        ResourceType.Wool,
    ];
    const resources: Resource[] = types.map(t => ({
        resourceType: t,
        uid:          `selector-${t}`,
    }));
    return resolveCardsInRect(resources, layout.selector, hoveredId);
}

// ─── Private — cards in rect ──────────────────────────────────────────────────

function resolveCardsInRect(
    resources: Resource[],
    bounds:    Rect,
    hoveredId: string | null,
): ResourceCard[] {
    const count      = resources.length;
    const spacing    = resolveSpacing(count, bounds.width);
    const totalWidth = CARD_CONFIG.width + (count - 1) * spacing;

    const startX = bounds.x + bounds.width / 2 - totalWidth / 2;
    const baseY  = bounds.y + bounds.height - CARD_CONFIG.height;

    const hoveredIndex = hoveredId !== null
        ? resources.findIndex(res => res.uid === hoveredId)
        : -1;

    return resources.map((resource, i) =>
        resolveCard(resource, i, startX, baseY, spacing, hoveredIndex, count)
    );
}

// ─── Private — card ───────────────────────────────────────────────────────────

function resolveCard(
    resource:     Resource,
    index:        number,
    startX:       number,
    baseY:        number,
    spacing:      number,
    hoveredIndex: number,
    total:        number,
): ResourceCard {
    const offset = resolveCardOffset(index, hoveredIndex, total);

    return {
        resourceType: resource.resourceType,
        uid:          resource.uid,
        isHovered:    index === hoveredIndex,
        isSelected:   false,
        isDisabled:   false,
        bounds: {
            x:      startX + index * spacing + offset.x,
            y:      baseY  + offset.y,
            width:  CARD_CONFIG.width,
            height: CARD_CONFIG.height,
        },
    };
}

// ─── Private — spacing ────────────────────────────────────────────────────────

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD_CONFIG.width - CARD_CONFIG.overlap;
    const naturalWidth   = CARD_CONFIG.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - CARD_CONFIG.width) / Math.max(count - 1, 1);
}

// ─── Private — offsets ────────────────────────────────────────────────────────

function resolveCardOffset(
    index:        number,
    hoveredIndex: number,
    total:        number,
): { x: number; y: number } {
    if (hoveredIndex === -1) return { x: 0, y: 0 };

    if (index === hoveredIndex) {
        return { x: 0, y: -CARD_CONFIG.hoverLift };
    }

    const direction = index < hoveredIndex ? -1 : 1;
    const distance  = Math.abs(index - hoveredIndex);
    const fanAmount = Math.min(
        CARD_CONFIG.fanDistance,
        distance * (CARD_CONFIG.fanDistance / Math.max(total * 0.4, 1))
    );

    return { x: direction * fanAmount, y: 0 };
}