// rendering/world/WorldTheme.ts

export interface TileTheme {
    strokeColor:  string;
    strokeWidth:  number;
    borderRadius: number;   // 0 = sharp hex corners, higher = rounder

    // Per tile type fill colors
    colors: {
        forest:    string;
        hills:     string;
        pasture:   string;
        fields:    string;
        mountains: string;
        desert:    string;
        sea:       string;
    };

    // Number token
    token: {
        background:     string;
        textColor:      string;
        textColorRed:   string;   // 6 and 8 are red in standard Catan
        font:           string;
        dotColor:       string;
        dotColorRed:    string;
        radius:         number;
    };

    // Robber
    robber: {
        fillColor:   string;
        strokeColor: string;
        radius:      number;
    };

    // Port
    port?: {
        dockColor: string;
        dockStrokeColor: string;
        dockWidth: number;
    }
}

export interface PieceTheme {
    strokeColor: string;
    strokeWidth: number;

    settlement: {
        width:  number;
        height: number;
    };

    city: {
        width:  number;
        height: number;
    };

    road: {
        width:  number;
        length: number;
    };
}

export interface HoverTheme {
    vertex: {
        fillColor:   string;
        strokeColor: string;
        validFillColor: string;
        radius:      number;
    };
    edge: {
        fillColor: string;
        validFillColor: string;
        width:     number;
    };
    hex: {
        fillColor: string;
    };
    robber: {
        radius: number;
        hoverRadius: number;
        validFill: string;
        hoverFill: string;
        hoverStroke: string;
        strokeWidth?: number;
    }
}

export interface WorldTheme {
    tile:  TileTheme;
    piece: PieceTheme;
    hover: HoverTheme;
}

export const DEFAULT_WORLD_THEME: WorldTheme = {
    tile: {
        strokeColor:  'rgba(0, 0, 0, 0.3)',
        strokeWidth:  2,
        borderRadius: 0,

        colors: {
            forest:    '#2d6a2d',
            hills:     '#c0522a',
            pasture:   '#7ec850',
            fields:    '#d4a017',
            mountains: '#8a8a8a',
            desert:    '#d9c27a',
            sea:       '#1a6fa8',
        },

        token: {
            background:   'rgba(245, 230, 190, 0.95)',
            textColor:    '#2a1a0a',
            textColorRed: '#c0301a',
            font:         'bold 14px serif',
            dotColor:     '#2a1a0a',
            dotColorRed:  '#c0301a',
            radius:       18,
        },

        robber: {
            fillColor:   '#111111',
            strokeColor: '#444444',
            radius:      12,
        },

        port: {
            dockColor:       '#8B6914',
            dockStrokeColor: '#5C4510',
            dockWidth:       6,
        },
    },

    piece: {
        strokeColor: 'rgba(0, 0, 0, 0.6)',
        strokeWidth: 1.5,

        settlement: {
            width:  18,
            height: 20,
        },

        city: {
            width:  26,
            height: 22,
        },

        road: {
            width:  6,
            length: 30,
        },
    },

    hover: {
        vertex: {
            fillColor:   'rgba(255, 255, 255, 0.35)',
            strokeColor: 'rgba(255, 255, 255, 0.8)',
            validFillColor: 'rgba(255, 255, 255, 0.15)',
            radius:      10,
        },
        edge: {
            fillColor: 'rgba(255, 255, 255, 0.35)',
            validFillColor: 'rgba(255, 255, 255, 0.15)',
            width:     8,
        },
        hex: {
            fillColor: 'rgba(255, 255, 255, 0.08)',
        },
        robber: {
            radius: 10,
            hoverRadius: 14,
            validFill: 'rgba(255, 215, 0, 0.4)',
            hoverFill: 'rgba(255, 170, 0, 0.8)',
            hoverStroke: '#FFAA00',
            strokeWidth: 2,
        }
    },
};

// Alternative theme — parchment / board game look
export const PARCHMENT_WORLD_THEME: WorldTheme = {
    tile: {
        strokeColor:  '#5a3e1b',
        strokeWidth:  3,
        borderRadius: 4,

        colors: {
            forest:    '#3a6b35',
            hills:     '#b04a22',
            pasture:   '#6db53f',
            fields:    '#c49415',
            mountains: '#7a7a7a',
            desert:    '#c9b46a',
            sea:       '#2a7fbf',
        },

        token: {
            background:   'rgba(240, 220, 170, 0.98)',
            textColor:    '#2a1a0a',
            textColorRed: '#aa2010',
            font:         'bold 15px serif',
            dotColor:     '#2a1a0a',
            dotColorRed:  '#aa2010',
            radius:       20,
        },

        robber: {
            fillColor:   '#1a1a1a',
            strokeColor: '#555555',
            radius:      14,
        },
    },

    piece: {
        strokeColor: '#3a2510',
        strokeWidth: 2,

        settlement: {
            width:  20,
            height: 22,
        },

        city: {
            width:  28,
            height: 24,
        },

        road: {
            width:  7,
            length: 32,
        },
    },

    hover: {
        vertex: {
            fillColor:   'rgba(255, 240, 180, 0.4)',
            strokeColor: 'rgba(255, 220, 100, 0.9)',
            validFillColor: 'rgba(255, 240, 180, 0.15)',
            radius:      12,
        },
        edge: {
            fillColor: 'rgba(255, 240, 180, 0.4)',
            validFillColor: 'rgba(255, 240, 180, 0.15)',
            width:     9,
        },
        hex: {
            fillColor: 'rgba(255, 240, 180, 0.1)',
        },
        robber: {
            radius: 10,
            hoverRadius: 14,
            validFill: 'rgba(218, 165, 32, 0.4)',
            hoverFill: 'rgba(184, 115, 51, 0.8)',
            hoverStroke: '#8B4513',
            strokeWidth: 2,
        }
    },
};