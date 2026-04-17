import {
    type ResourcePanelManagerState,
    type ResourcePanelMode,
    ResourcePanelModeKind,
    type ResourcePanelModeState,
    TradePanelKind
} from "@/game/hud/panels/resource/types.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {BrowseMode} from "@/game/hud/panels/resource/modes/BrowseMode.ts";
import {type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {GameEventType} from "@/game/events/GameEventTypes.ts";
import {TradeMode} from "@/game/hud/panels/resource/modes/TradeMode.ts";
import {DiscardMode} from "@/game/hud/panels/resource/modes/DiscardMode.ts";
import {type Rect, unionRects} from "@/game/utils/Rect.ts";

export class ResourcePanelManager {
    private mode: ResourcePanelMode<ResourcePanelModeState>;

    constructor(
        public readonly shared: SharedState,
        public readonly resolution: ResolutionManager,
        public readonly bus: EventBus,
        private readonly frameQueue: FrameQueue,
    ) {
        this.mode = new BrowseMode(frameQueue, resolution, shared);
        this.mode.onEnter();
        this.subscribeToEvents();
    }

    // ─── Events ───────────────────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.GAME_STATE_LOADED, () => {
            this.transitionTo(new BrowseMode(this.frameQueue, this.resolution, this.shared));
        });

        this.bus.on(GameEventType.TRADE_STARTED, (e) => {
            this.transitionTo(new TradeMode(this.frameQueue, this.resolution, this.shared), e.payload.initialSelection);
        });

        this.bus.on(GameEventType.DISCARD_REQUIRED, (e) => {
            this.transitionTo(new DiscardMode(this.frameQueue, this.resolution, this.shared), e.payload.amount);
        });

        this.bus.on(GameEventType.TRADE_CONFIRM_BANK_SENT_TO_SERVER, () => this.transitionTo(new BrowseMode(this.frameQueue, this.resolution, this.shared)));
        this.bus.on(GameEventType.TRADE_CONFIRM_GLOBAL_SENT_TO_SERVER, () => this.transitionTo(new BrowseMode(this.frameQueue, this.resolution, this.shared)));
        this.bus.on(GameEventType.DISCARD_CONFIRMED, () => this.transitionTo(new BrowseMode(this.frameQueue, this.resolution, this.shared)));
        this.bus.on(GameEventType.TRADE_CANCELLED, () => this.transitionTo(new BrowseMode(this.frameQueue, this.resolution, this.shared)));
    }

    private transitionTo<TState extends ResourcePanelModeState>(
        nextMode: ResourcePanelMode<TState, void>
    ): void;
    private transitionTo<TState extends ResourcePanelModeState, TArg>(
        nextMode: ResourcePanelMode<TState, TArg>,
        arg: TArg,
    ): void;
    private transitionTo(nextMode: ResourcePanelMode<any, any>, arg?: any): void {
        this.mode.onExit();
        this.mode = nextMode;
        this.mode.onEnter(arg);
    }

    // ─── Input ────────────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        return this.mode.handleInput(event);
    }


    // ─── State ────────────────────────────────────────────────────────────────

    getState(): ResourcePanelManagerState {
        return {
            modeState: this.mode.getState(),
            bounds: this.getBounds()
        }
    }

    private getBounds(): Rect {
        const state = this.mode.getState();

        switch (state.kind) {
            case ResourcePanelModeKind.Browse:
                return state.hand.bounds;

            case ResourcePanelModeKind.Discard:
                return unionRects(state.hand.bounds, state.buttons.confirm, state.buttons.cancel);

            case ResourcePanelModeKind.Trade:
                return unionRects(
                    state[TradePanelKind.Hand].bounds,
                    state[TradePanelKind.Offered].bounds,
                    state[TradePanelKind.Wanted].bounds,
                    state[TradePanelKind.Selector].bounds,
                    state.buttons.cancel,
                    state.buttons.confirmGlobal,
                    state.buttons.confirmBank,
                );
        }
    }
}