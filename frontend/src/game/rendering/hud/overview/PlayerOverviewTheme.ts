// rendering/hud/overview/PlayerOverviewTheme.ts

import type {PanelTheme} from "@/game/rendering/theme/theme.ts";

export interface PlayerRowTheme {
    background:       string;
    backgroundActive: string;   // current turn highlight
    backgroundLocal: string;   // Local player highlight
    borderRadius:     number;
    colorPipSize:     number;
    nameFont:         string;
    nameColor:        string;
    statFont:         string;
    statColor:        string;
    statMutedColor:   string;   // for zero values
    badgeFont:        string;
    vpColor:          string;
    iconSize:         number;
}

export interface PlayerOverviewTheme {
    panel: PanelTheme;
    row:   PlayerRowTheme;
}

export const DEFAULT_OVERVIEW_THEME: PlayerOverviewTheme = {
    panel: {
        background:   'rgba(10, 14, 20, 0.88)',
        borderColor:  'rgba(255, 255, 255, 0.07)',
        borderWidth:  1,
        borderRadius: 10,
        titleFont:    'bold 11px monospace',
        titleColor:   'rgba(255,255,255,0.3)',
        titlePadding: 12,
    },
    row: {
        background:       'rgba(255, 255, 255, 0.04)',
        backgroundActive: 'rgba(255, 220, 100, 0.10)',
        backgroundLocal: 'rgba(120,170,255,0.10)',
        borderRadius:     6,
        colorPipSize:     10,
        nameFont:         'bold 11px monospace',
        nameColor:        'rgba(255, 255, 255, 0.85)',
        statFont:         '10px monospace',
        statColor:        'rgba(255, 255, 255, 0.7)',
        statMutedColor:   'rgba(255, 255, 255, 0.25)',
        badgeFont:        'bold 9px monospace',
        vpColor:          '#FFD700',
        iconSize:         10,
    }
};