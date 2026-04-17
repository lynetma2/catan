// rendering/hud/overview/PlayerOverviewRenderer.ts

import {DEFAULT_OVERVIEW_THEME, type PlayerOverviewTheme} from "@/game/rendering/hud/overview/PlayerOverviewTheme.ts";
import {PlayerRowRenderer} from "@/game/rendering/hud/overview/RowRenderer.ts";
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";

export class PlayerOverviewRenderer {
    private readonly rowRenderer: PlayerRowRenderer;

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: PlayerOverviewTheme = DEFAULT_OVERVIEW_THEME,
    ) {
        this.rowRenderer = new PlayerRowRenderer(ctx, theme.row);
    }

    render(state: PlayerOverviewState) {
        if (state.players.length === 0) return;

        drawPanelChrome(
            this.ctx,
            state.bounds,
            '',        // no title — panel is self-explanatory
            this.theme.panel
        );

        // Match each player to its layout row by playerId
        state.players.forEach(player => {
            const row = state.rows.find(r => r.playerId === player.playerId);
            if (row) this.rowRenderer.render(player, row);
        });
    }
}