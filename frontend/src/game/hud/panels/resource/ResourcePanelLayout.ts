// hud/panels/resource/ResourcePanelLayout.ts
import { type Resolution }             from '@/game/core/ResolutionManager';
import { type ResourceCard }           from './types';
import { type Resource }               from '@/game/core/types';
import { hudLayout, type PanelConfig } from '@/game/hud/HudLayout';
import { Anchor }                      from '@/game/hud/types';
import { type Rect }                   from '@/game/utils/Rect';

// ─── Panel config ─────────────────────────────────────────────────────

const PANEL_CONFIG: PanelConfig = {
    anchorX: Anchor.Center,
    anchorY: Anchor.Bottom,
    offsetX: 0,
    offsetY: -20,
    width:   500,
    height:  110,
};

// ─── Card config ──────────────────────────────────────────────────────

const CARD_CONFIG = {
    width:       50,
    height:      75,
    overlap:     20,
    hoverLift:   20,
    fanDistance: 35,
} as const;

// ─── Exports ──────────────────────────────────────────────────────────

export function resolveResourcePanelBounds(r: Resolution): Rect {
    return hudLayout.resolve(PANEL_CONFIG, r);
}

export function resolveResourceCards(
    resources:  Resource[],
    hoveredId:  string | null,
    r:          Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];

    const panelBounds  = resolveResourcePanelBounds(r);
    const count        = resources.length;
    const spacing      = resolveSpacing(count, panelBounds.width);
    const totalWidth   = CARD_CONFIG.width + (count - 1) * spacing;

    const startX = panelBounds.x + panelBounds.width / 2 - totalWidth / 2;
    const baseY  = panelBounds.y + panelBounds.height - CARD_CONFIG.height;

    const hoveredIndex = hoveredId !== null
        ? resources.findIndex(res => res.uid === hoveredId)
        : -1;

    return resources.map((resource, i) =>
        resolveCard(resource, i, startX, baseY, spacing, hoveredIndex, count)
    );
}

// ─── Private — card ───────────────────────────────────────────────────

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
        bounds: {
            x:      startX + index * spacing + offset.x,
            y:      baseY  + offset.y,
            width:  CARD_CONFIG.width,
            height: CARD_CONFIG.height,
        },
    };
}

// ─── Private — spacing ────────────────────────────────────────────────

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD_CONFIG.width - CARD_CONFIG.overlap;
    const naturalWidth   = CARD_CONFIG.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    return (panelWidth - CARD_CONFIG.width) / Math.max(count - 1, 1);
}

// ─── Private — offsets ────────────────────────────────────────────────

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