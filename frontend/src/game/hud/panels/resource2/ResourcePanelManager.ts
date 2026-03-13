import type {ResourcePanelMode} from "@/game/hud/panels/resource/types.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {BrowseMode} from "@/game/hud/panels/resource/modes/BrowseMode.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";

export class ResourcePanelManager {
    private mode:              ResourcePanelMode<any>;

    constructor(
        public readonly shared:      SharedState,
        public readonly resolution:  ResolutionManager,
        public readonly bus:         EventBus,
        private readonly frameQueue: FrameQueue,
    ) {
        this.mode = new BrowseMode(this);
        this.subscribeToEvents();
    }

    // ─── Events ───────────────────────────────────────────────────────────────

    private subscribeToEvents() {

    }

    private setMode(mode: ResourcePanelMode<any>) {
        this.mode.onExit();
        this.mode = mode;
        this.mode.onEnter();
    }

    // ─── Input ────────────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {

    }


    // ─── State ────────────────────────────────────────────────────────────────

    getState() {
    }

}