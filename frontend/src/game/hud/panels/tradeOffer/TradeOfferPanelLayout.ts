// hud/panels/overview/PlayerOverviewLayout.ts
import { type Resolution }        from '@/game/core/ResolutionManager';
import { hudLayout, type PanelConfig } from '@/game/hud/HudLayout';
import { Anchor }                 from '@/game/hud/types';
import { type Rect }              from '@/game/utils/Rect';
import type {PlayerOverviewEntry, PlayerRowLayout} from "@/game/hud/panels/overview/types.ts";

// ─── Config ───────────────────────────────────────────────────────────

const ROW_HEIGHT  = 34;
const ROW_SPACING = 4;
const PANEL_WIDTH = 160;
const PADDING     = 8;
const HEADER_HEIGHT = 0; // no header title — panel speaks for itself visually

// ─── Panel bounds — driven by player count ────────────────────────────

function buildPanelConfig(playerCount: number): PanelConfig {
    const height = PADDING
        + playerCount * ROW_HEIGHT
        + (playerCount - 1) * ROW_SPACING
        + PADDING;

    return {
        anchorX: Anchor.Right,
        anchorY: Anchor.Top,
        offsetX: -20,
        offsetY: 20,
        width:   PANEL_WIDTH,
        height,
    };
}

export function resolveOverviewPanelBounds(
    playerCount: number,
    r:           Resolution
): Rect {
    return hudLayout.resolveFixed(buildPanelConfig(playerCount), r);
}

export function resolvePlayerRows(
    players: PlayerOverviewEntry[],
    r:       Resolution,
): PlayerRowLayout[] {
    if (players.length === 0) return [];

    const panelBounds = resolveOverviewPanelBounds(players.length, r);

    return players.map((player, i) => ({
        playerId: player.playerId,
        bounds: {
            x:      panelBounds.x + PADDING,
            y:      panelBounds.y + PADDING + i * (ROW_HEIGHT + ROW_SPACING),
            width:  panelBounds.width  - PADDING * 2,
            height: ROW_HEIGHT,
        }
    }));
}