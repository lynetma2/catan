// hud/panels/ResourcePanel.ts

import type {SharedState} from "@/game/core/SharedState.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type Resolution, ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {ResourcePanelMode, ResourcePanelState} from "@/game/hud/panels/resource/types.ts";
import type {Resource} from "@/game/core/types.ts";
import {resolveResourceCards, resolveResourcePanelBounds} from "@/game/hud/panels/resource/ResourcePanelLayout.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {BrowseMode} from "@/game/hud/panels/resource/modes/BrowseMode.ts";
import {GameEventType} from "@/game/events/GameEventTypes.ts";
import {DiscardMode} from "@/game/hud/panels/resource/modes/DiscardMode.ts";
import {TradeMode} from "@/game/hud/panels/resource/modes/TradeMode.ts";

export class ResourcePanel {
    private mode: ResourcePanelMode<any>;
    private hoveredCardId: string | null = null; // Shared hover state

    constructor(
        public readonly shared: SharedState,
        public readonly resolution: ResolutionManager,
        private readonly bus: EventBus,
        private readonly frameQueue: FrameQueue
    ) {
        this.mode = new BrowseMode(this);
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.bus.on(GameEventType.DISCARD_REQUIRED, () => {
            this.setMode(new DiscardMode(this, this.frameQueue));
        });

        this.bus.on(GameEventType.CARDS_DISCARDED, (e) => {
            if (e.payload.playerId === this.shared.localPlayerId) {
                this.setMode(new BrowseMode(this));
            }
        });

        this.bus.on(GameEventType.TRADE_STARTED, () => {
            this.setMode(new TradeMode(this));
        });

        this.bus.on(GameEventType.TRADE_ENDED, () => {
            this.setMode(new BrowseMode(this));
        });
    }

    private setMode(mode: ResourcePanelMode<any>) {
        this.mode.onExit();
        this.mode = mode;
        this.mode.onEnter();
    }

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            this.hoveredCardId = this.cardAtPos(event.screenPos);
        }
        return this.mode.handleInput(event);
    }

    getState(): ResourcePanelState {
        const r     = this.resolution.get();
        const modeState = this.mode.getState();

        const cards = resolveResourceCards(
            this.getResources(),
            this.hoveredCardId,
            r
        ).map(card => ({
            ...card,
            isSelected: modeState.selectedIds.has(card.uid)
        }));

        return {
            bounds: resolveResourcePanelBounds(r),
            resourceCards: cards,
            mode: modeState
        };
    }

    getBounds(r: Resolution) {
        return resolveResourcePanelBounds(r);
    }

    public getResources(): Resource[] {
        return this.shared.localPlayer?.resources ?? [];
    }

    public cardAtPos(pos: Vec2): string | null {
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