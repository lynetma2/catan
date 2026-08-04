// rendering/hud/overview/PlayerOverviewTheme.ts
import type {PanelTheme} from "@/game/rendering/theme/theme.ts";

export interface PlayerRowTheme {
    background:       string;
    backgroundActive: string;   // current turn highlight
    backgroundLocal: string;   // local player highlight
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
    youBadgeBackground: string;
    youBadgeColor: string;
    largestArmyColor: string;
    longestRoadColor: string;
}

export interface TooltipTheme {
    background: string;
    border: string;
    text: string;
    font: string;
    shadow: string;
    borderRadius: number;
}

export interface PlayerOverviewTheme {
    panel: PanelTheme;
    row: PlayerRowTheme;
    tooltip: TooltipTheme; // <-- now top-level
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
        background: 'rgba(255, 255, 255, 0.04)',
        backgroundActive: 'rgba(255, 220, 100, 0.10)',
        backgroundLocal: 'rgba(120,170,255,0.10)',
        borderRadius: 6,
        colorPipSize: 10,
        nameFont: 'bold 11px monospace',
        nameColor: 'rgba(255, 255, 255, 0.85)',
        statFont: '10px monospace',
        statColor: 'rgba(255, 255, 255, 0.7)',
        statMutedColor: 'rgba(255, 255, 255, 0.25)',
        badgeFont: 'bold 9px monospace',
        vpColor: '#FFD700',
        iconSize: 10,
        youBadgeBackground: 'rgba(100, 200, 255, 0.20)',
        youBadgeColor: '#88DDFF',
        largestArmyColor: '#FFD700',
        longestRoadColor: '#50C8FF',
    },
    tooltip: {
        // Lighter "elevated" surface so it clearly floats above the dark panel
        background: 'rgba(36, 42, 56, 0.98)',
        border: 'rgba(150, 180, 230, 0.55)',
        text: 'rgba(255, 255, 255, 0.98)',
        font: 'bold 11px monospace',
        shadow: 'rgba(0, 0, 0, 0.45)',
        borderRadius: 5,
    },
};