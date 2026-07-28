import {
    type BrowseModeState,
    type ResourcePanelMode,
    ResourcePanelModeKind,
} from "@/game/hud/panels/resource/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {resolveHandCards} from "@/game/hud/panels/resource/Layout/ResourceCardLayout.ts";
import {findHitCard} from "@/game/hud/panels/resource/utils.ts";
import {resolveHandPanelBounds} from "@/game/hud/panels/resource/Layout/ResourcePanelLayout.ts";
import {GameUiEventCreators} from "@/events/game/GameUiEvents.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";


export class BrowseMode implements ResourcePanelMode<BrowseModeState> {
    private readonly frameQueue: FrameQueue<GameEventMap>;
    private readonly resolution: ResolutionManager;
    private readonly sharedState: SharedState;
    private hoveredCardId: string | null = null;

    constructor(frameQueue: FrameQueue<GameEventMap>, resolution: ResolutionManager, sharedState: SharedState) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
        this.sharedState = sharedState;
    }

    onEnter(): void {
    }

    onExit(): void {
        this.hoveredCardId = null;
    }

    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const cards = resolveHandCards(this.sharedState.localPlayerResources ?? [], this.hoveredCardId, r);

        if (event.type === InputType.MouseMove) {
            const hit = findHitCard(cards, event.screenPos);
            this.hoveredCardId = hit?.uid ?? null;
            return hit != null;
        }

        if (event.type === InputType.MouseClick) {
            if (!this.sharedState.canInitiateTrade) return false;

            const hit = findHitCard(cards, event.screenPos);
            if (hit == null) return false;
            this.frameQueue.push(GameUiEventCreators.tradeStart(hit.uid));
            return true;
        }

        return false;
    }

    getState(): BrowseModeState {
        const r = this.resolution.get();
        return {
            kind: ResourcePanelModeKind.Browse,
            hand: {
                bounds: resolveHandPanelBounds(r),
                cards: resolveHandCards(this.sharedState.localPlayerResources ?? [], this.hoveredCardId, r),
            },
            isAtDiscardRisk: this.sharedState.isAtDiscardRisk,
        };
    }
}