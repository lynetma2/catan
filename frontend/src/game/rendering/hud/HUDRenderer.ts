// rendering/hud/HudRenderer.ts


import {BuildPanelRenderer} from "@/game/rendering/hud/build/BuildPanelRenderer.ts";
import {ResourcePanelRenderer} from "@/game/rendering/hud/resource/ResourcePanelRenderer.ts";
import {ToastRenderer} from "@/game/rendering/hud/ToastRenderer.ts";
import {type Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {DEFAULT_HUD_THEME, type HudTheme} from "@/game/rendering/theme/theme.ts";
import type {HudState} from "@/game/hud/types.ts";
import {PlayerOverviewRenderer} from "@/game/rendering/hud/overview/PlayerOverviewRenderer.ts";
import {DicePanelRenderer} from "@/game/rendering/hud/dice/DicePanelRenderer.ts";

export class HudRenderer {
    private readonly buildPanelRenderer:    BuildPanelRenderer;
    private readonly resourcePanelRenderer: ResourcePanelRenderer;
    private readonly overviewPanelRenderer: PlayerOverviewRenderer;
    private readonly dicePanelRenderer: DicePanelRenderer;
    private readonly toastRenderer:         ToastRenderer;
    private resolution: Resolution;

    constructor(
        ctx:    CanvasRenderingContext2D,
        resolutionManager:       ResolutionManager,
        theme:  HudTheme = DEFAULT_HUD_THEME,
    ) {
        this.resolution             = resolutionManager.get();
        this.buildPanelRenderer     = new BuildPanelRenderer(ctx);
        this.resourcePanelRenderer  = new ResourcePanelRenderer(ctx, resolutionManager);
        this.overviewPanelRenderer  = new PlayerOverviewRenderer(ctx);
        this.dicePanelRenderer      = new DicePanelRenderer(ctx);
        this.toastRenderer          = new ToastRenderer(ctx, theme.toast);

        resolutionManager.onChange(r => { this.resolution = r; });
    }

    render(state: HudState) {
        this.buildPanelRenderer.render(state.panels.build);
        this.resourcePanelRenderer.render(state.panels.resource);
        this.overviewPanelRenderer.render(state.panels.overview);
        this.dicePanelRenderer.render(state.panels.dice);
        if (state.toast) this.toastRenderer.render(state.toast, this.resolution);
    }
}