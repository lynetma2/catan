
export interface HudEventPayloads {
    TOAST_REQUESTED:     { message: string; kind: 'error' | 'info' | 'success' };
    RESOURCE_CHANGED:    { playerId: string; resources: Record<string, number> };
    PANEL_OPENED:        { panel: 'trade' | 'build' | 'dev-cards' };
    PANEL_CLOSED:        { panel: 'trade' | 'build' | 'dev-cards' };
}

export type HudEventType = keyof HudEventPayloads;