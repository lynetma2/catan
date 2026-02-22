// hud/panels/ResourcePanel.ts

import type {SharedState} from "@/game/core/SharedState.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {ResourcePanelState} from "@/game/hud/panels/resource/types.ts";
import type {Resource} from "@/game/core/types.ts";
import {resolveResourceCards, resolveResourcePanelBounds} from "@/game/hud/panels/resource/ResourcePanelLayout.ts";
import {containsPoint} from "@/game/utils/Rect.ts";

export class ResourcePanel {
    private hoveredCardId: string | null = null;
    private selectedCardsIds: string[] | null = null; //Unused will be used when trading gets implemented.

    constructor(
        private readonly shared: SharedState,
        private readonly resolution: ResolutionManager
    ) {}

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type !== 'mousemove') return false;

        const r     = this.resolution.get();
        const cards = resolveResourceCards(
            this.getResources(),
            this.hoveredCardId,
            r
        );

        // Reverse so top-rendered card wins on overlap
        const hit = [...cards].reverse().find(c =>
            containsPoint(c.bounds, event.screenPos)
        );

        this.hoveredCardId = hit?.uid ?? null;
        return this.hoveredCardId !== null;
    }

    getState(): ResourcePanelState {
        const r     = this.resolution.get();
        const cards = resolveResourceCards(
            this.getResources(),
            this.hoveredCardId,
            r
        );

        console.log("Current Resource Panel State: ", {
            bounds: resolveResourcePanelBounds(r),
            resourceCards: cards,
        });

        return {
            bounds: resolveResourcePanelBounds(r),
            resourceCards: cards,
        };
    }

    getBounds(r: Resolution) {
        return resolveResourcePanelBounds(r);
    }

    clearSelection() {
        this.selectedCardsIds = null;
    }

    private getResources(): Resource[] {
        return this.shared.localPlayer?.resources ?? [];
    }
}