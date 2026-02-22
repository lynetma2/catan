// hud/panels/resource/ResourcePanelLayout.ts
import { type Resolution }        from '@/game/core/ResolutionManager';
import { type ResourceCard }      from './types';
import { type Resource }          from '@/game/core/types';
import { hudLayout, type PanelConfig } from '@/game/hud/HudLayout';
import { Anchor }                 from '@/game/hud/types';

// ─── Panel config — single source of truth for size and position ──────

const PANEL_CONFIG: PanelConfig = {
    anchorX: Anchor.Center,
    anchorY: Anchor.Bottom,
    offsetX: 0,
    offsetY: -130,
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
};

// ─── Exports ──────────────────────────────────────────────────────────

export function resolveResourcePanelBounds(r: Resolution) {
    return hudLayout.resolve(PANEL_CONFIG, r);
}

export function resolveResourceCards(
    resources:  Resource[],
    hoveredId:  string | null,
    r:          Resolution,
): ResourceCard[] {
    if (resources.length === 0) return [];

    const panelBounds = resolveResourcePanelBounds(r);
    const count       = resources.length;
    const spacing     = resolveSpacing(count, panelBounds.width);
    const totalWidth  = CARD_CONFIG.width + (count - 1) * spacing;

    // Center cards within panel
    const startX = panelBounds.x + panelBounds.width  / 2 - totalWidth / 2;

    // Align to bottom of panel — hover lift moves cards upward within panel
    const baseY  = panelBounds.y + panelBounds.height - CARD_CONFIG.height;

    const hoveredIndex = hoveredId !== null
        ? resources.findIndex(res => res.uid === hoveredId)
        : -1;

    return resources.map((resource, i): ResourceCard => {
        const offset = resolveCardOffset(i, hoveredIndex, count);
        return {
            resourceType: resource.resourceType,
            uid:          resource.uid,
            isHovered:    resource.uid === hoveredId,
            isSelected:   false,
            bounds: {
                x:      startX + i * spacing + offset.x,
                y:      baseY  + offset.y,
                width:  CARD_CONFIG.width,
                height: CARD_CONFIG.height,
            }
        };
    });
}

// ─── Private helpers ──────────────────────────────────────────────────

function resolveSpacing(count: number, panelWidth: number): number {
    const naturalSpacing = CARD_CONFIG.width - CARD_CONFIG.overlap;
    const naturalWidth   = CARD_CONFIG.width + (count - 1) * naturalSpacing;

    if (naturalWidth <= panelWidth) return naturalSpacing;

    // Compress spacing so all cards fit within panel width
    return (panelWidth - CARD_CONFIG.width) / Math.max(count - 1, 1);
}

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