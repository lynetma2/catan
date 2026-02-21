// hud/panels/ResourcePanel.ts

import type {SharedState} from "@/game/core/SharedState.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {hudLayout, type PanelConfig} from "@/game/hud/HudLayout.ts";
import type {Rect} from "@/game/utils/Rect.ts";
import type {Resolution} from "@/game/core/ResolutionManager.ts";
import {Anchor} from "@/game/hud/types.ts";

export interface ResourcePanelState {
    bounds: Rect;
    visible: boolean;
}

const PANEL_CONFIG: PanelConfig = {
    anchorX: Anchor.Left,
    anchorY: Anchor.Bottom,
    offsetX: 20,
    offsetY: 20,
    width:   200,
    height:  180,
};

export class ResourcePanel {
    constructor(private readonly shared: SharedState,
                private readonly resolution: Resolution) {}

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display-only for now
    }

    getState(): Readonly<ResourcePanelState> {
        return {
            bounds:   hudLayout.resolve(PANEL_CONFIG, this.resolution),
            visible: true
        };
    }
}