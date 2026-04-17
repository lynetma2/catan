// rendering/hud/theme.ts

export interface ButtonTheme {
    // Defaults applied to every button unless overridden
    defaults: {
        strokeColor:     string;
        strokeWidth:     number;
        hoverStroke:     string;
        selectedStroke:  string;
        disabledOpacity: number;
        borderRadius:    number;
    };
    // State-driven overlays
    states: {
        hovered:  { fillOverlay: string; strokeColor: string; };
        selected: { fillOverlay: string; strokeColor: string; };
        disabled: { fillOverlay: string; };
        waiting:  { fillOverlay: string; };
    };
}

export const DEFAULT_THEME: ButtonTheme = {
    defaults: {
        strokeColor:     '#000000',
        strokeWidth:     1.5,
        hoverStroke:     '#ffffff',
        selectedStroke:  '#ffffff',
        disabledOpacity: 0.4,
        borderRadius:    8,
    },
    states: {
        hovered:  { fillOverlay: 'rgba(255,255,255,0.12)', strokeColor: '#ffffff' },
        selected: { fillOverlay: 'rgba(255,255,255,0.18)', strokeColor: '#ffffff' },
        disabled: { fillOverlay: 'rgba(0,0,0,0.45)'                              },
        waiting:  { fillOverlay: 'rgba(0,0,0,0.25)'                              },
    }
};

// rendering/hud/HudTheme.ts

export interface ToastTheme {
    width:        number;
    height:       number;
    bottomOffset: number;
    borderRadius: number;
    font:         string;
    fadeMs:       number;   // how many ms before end to start fading
    colors: Record<'error' | 'success' | 'info', {
        background: string;
        text:       string;
        border:     string;
    }>;
}

export interface PanelTheme {
    background:   string;
    borderColor:  string;
    borderWidth:  number;
    borderRadius: number;
    titleFont:    string;
    titleColor:   string;
    titlePadding: number;
}

export interface HudTheme {
    panel: PanelTheme;
    toast: ToastTheme;
}

export const DEFAULT_HUD_THEME: HudTheme = {
    panel: {
        background:   'rgba(10, 12, 20, 0.82)',
        borderColor:  'rgba(255, 255, 255, 0.08)',
        borderWidth:  1,
        borderRadius: 10,
        titleFont:    'bold 11px monospace',
        titleColor:   'rgba(255, 255, 255, 0.35)',
        titlePadding: 12,
    },
    toast: {
        width:        280,
        height:       44,
        bottomOffset: 80,
        borderRadius: 8,
        font:         'bold 13px monospace',
        fadeMs:       400,
        colors: {
            error:   { background: 'rgba(180, 50,  50,  $a)', text: '#ffffff', border: 'rgba(220, 80,  80,  $a)' },
            success: { background: 'rgba(40,  140, 70,  $a)', text: '#ffffff', border: 'rgba(60,  180, 90,  $a)' },
            info:    { background: 'rgba(40,  90,  170, $a)', text: '#ffffff', border: 'rgba(60,  120, 210, $a)' },
        },
    },
};