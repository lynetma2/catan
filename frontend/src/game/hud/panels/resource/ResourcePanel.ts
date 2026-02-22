// hud/panels/ResourcePanel.ts

import type {SharedState} from "@/game/core/SharedState.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {ResourcePanelState} from "@/game/hud/panels/resource/types.ts";
import type {Resource} from "@/game/core/types.ts";
import {resolveResourceCards, resolveResourcePanelBounds} from "@/game/hud/panels/resource/ResourcePanelLayout.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";

export class ResourcePanel {
    private hoveredCardId: string | null = null;
    private selectedCardsIds: string[] | null = null; //Unused will be used when trading gets implemented.

    constructor(
        private readonly shared: SharedState,
        private readonly resolution: ResolutionManager
    ) {}

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type !== 'mousemove') return false;

        this.hoveredCardId = this.cardAtPos(event.screenPos);
        return this.hoveredCardId !== null;
    }

    getState(): ResourcePanelState {
        const r     = this.resolution.get();
        const cards = resolveResourceCards(
            this.getResources(),
            this.hoveredCardId,
            r
        );

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

    private cardAtPos(pos: Vec2): string | null {
        const r         = this.resolution.get();
        const resources = this.getResources();

        // Resolve cards without any hover state — base positions only
        const cards = resolveResourceCards(resources, null, r);

        // Reverse so top-rendered card wins on overlap
        const hit = [...cards].reverse().find(c =>
            containsPoint(c.bounds, pos)
        );

        return hit?.uid ?? null;
    }
}