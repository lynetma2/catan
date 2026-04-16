// rendering/hud/HudRenderer.ts


import {BuildPanelRenderer} from "@/game/rendering/hud/build/BuildPanelRenderer.ts";
import {ResourcePanelRenderer} from "@/game/rendering/hud/resource/ResourcePanelRenderer.ts";
import {ToastRenderer} from "@/game/rendering/hud/ToastRenderer.ts";
import {type Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {DEFAULT_HUD_THEME, type HudTheme} from "@/game/rendering/theme/theme.ts";
import type {HudState} from "@/game/hud/types.ts";
import {PlayerOverviewRenderer} from "@/game/rendering/hud/overview/PlayerOverviewRenderer.ts";
import {DicePanelRenderer} from "@/game/rendering/hud/dice/DicePanelRenderer.ts";
import {
    defaultTradeOfferRendererTheme,
    TradeOfferRenderer
} from "@/game/rendering/hud/tradeOffer/TradeOfferRenderer.ts";

export class HudRenderer {
    private readonly buildPanelRenderer:    BuildPanelRenderer;
    private readonly resourcePanelRenderer: ResourcePanelRenderer;
    private readonly overviewPanelRenderer: PlayerOverviewRenderer;
    private readonly dicePanelRenderer: DicePanelRenderer;
    private readonly toastRenderer:         ToastRenderer;
    private readonly tradeOfferRenderer: TradeOfferRenderer;
    private resolution: Resolution;

    constructor(
        ctx:    CanvasRenderingContext2D,
        resolutionManager:       ResolutionManager,
        theme:  HudTheme = DEFAULT_HUD_THEME,
    ) {
        this.resolution             = resolutionManager.get();
        this.buildPanelRenderer     = new BuildPanelRenderer(ctx);
        this.resourcePanelRenderer = new ResourcePanelRenderer(ctx);
        this.overviewPanelRenderer  = new PlayerOverviewRenderer(ctx);
        this.dicePanelRenderer      = new DicePanelRenderer(ctx);
        this.toastRenderer          = new ToastRenderer(ctx, theme.toast);
        this.tradeOfferRenderer = new TradeOfferRenderer(ctx, defaultTradeOfferRendererTheme);

        resolutionManager.onChange(r => { this.resolution = r; });
    }

    render(state: HudState) {
        this.buildPanelRenderer.render(state.panels.build);
        this.resourcePanelRenderer.render(state.panels.resource);
        this.overviewPanelRenderer.render(state.panels.overview);
        this.dicePanelRenderer.render(state.panels.dice);
        this.tradeOfferRenderer.render(state.panels.tradeOffers);
        if (state.toast) this.toastRenderer.render(state.toast, this.resolution);
    }
}