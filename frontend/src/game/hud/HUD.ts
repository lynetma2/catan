// hud/HUD.ts
import {type EventBus} from '@/game/core/EventBus';
import {type FrameQueue} from '@/game/core/FrameQueue';
import {type SharedState} from '@/game/core/SharedState';
import {type ResolutionManager} from '@/game/core/ResolutionManager';
import {BuildPanel} from './panels/build/BuildPanel.ts';
import type {InputLayer} from "@/game/core/Input/types.ts";
import {type HudState, type Toast} from "@/game/hud/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import {PlayerOverviewPanel} from "@/game/hud/panels/overview/OverviewPanel.ts";
import {DicePanel} from "@/game/hud/panels/dice/DicePanel.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {ResourcePanelManager} from "@/game/hud/panels/resource/ResourcePanelManager.ts";
import {TradeOfferManager} from "@/game/hud/panels/tradeOffer/TradeOfferManager.ts";
import {RobberStealPanel} from "@/game/hud/panels/robber/RobberStealPanel.ts";
import type {Camera} from "@/game/core/Camera.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";

export class HUD implements InputLayer {
    readonly priority = 10;
    private toast:      Toast | null          = null;
    private readonly buildPanel:    BuildPanel;
    private readonly resourcePanel: ResourcePanelManager;
    private readonly overviewPanel: PlayerOverviewPanel;
    private readonly dicePanel: DicePanel;
    private readonly tradeOfferPanel: TradeOfferManager;
    private readonly robberStealPanel: RobberStealPanel;

    constructor(
        private readonly bus:        EventBus,
        private readonly shared:     SharedState,
        frameQueue: FrameQueue,
        resolution: ResolutionManager,
        camera: Camera,
    ) {
        this.buildPanel    = new BuildPanel(frameQueue, shared, resolution, bus);
        this.resourcePanel = new ResourcePanelManager(shared, resolution, bus, frameQueue);
        this.overviewPanel = new PlayerOverviewPanel(bus, shared, resolution);
        this.dicePanel = new DicePanel(bus, frameQueue, shared, resolution);
        this.tradeOfferPanel = new TradeOfferManager(bus, shared, frameQueue, resolution);
        this.robberStealPanel = new RobberStealPanel(bus, frameQueue, shared, camera);

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameServerEvents.error.success, (payload: GameEventMap[typeof GameServerEvents.error.success]) => {
            const message = payload.message || payload.errorCode || 'An unknown error occurred';
            this.showToast(message, 'error');
        });
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        // Non-positional — forward to all, never consume
        if (event.type === InputType.KeyDown   ||
            event.type === InputType.KeyUp     ||
            event.type === InputType.MouseLeave) {
            this.buildPanel.handleInput(event);
            this.resourcePanel.handleInput(event);
            this.dicePanel.handleInput(event);
            this.tradeOfferPanel.handleInput(event);
            this.overviewPanel.handleInput(event);
            return false;
        }

        // MouseMove — forward to all panels for hover tracking
        // but only consume if mouse is actually over a panel
        if (event.type === InputType.MouseMove) {
            this.buildPanel.handleInput(event);
            this.resourcePanel.handleInput(event);
            this.dicePanel.handleInput(event);
            this.tradeOfferPanel.handleInput(event);
            this.robberStealPanel.handleInput(event);
            this.overviewPanel.handleInput(event);

            // Consume if over any panel — prevents world hover underneath
            return this.isOverAnyPanel(event.screenPos);
        }

        // Click events — only forward if inside panel bounds
        if (this.robberStealPanel.isOverAnyTarget(event.screenPos)) {
            if (this.robberStealPanel.handleInput(event)) return true;
        }
        if (containsPoint(this.buildPanel.getState().bounds, event.screenPos)) {
            if (this.buildPanel.handleInput(event)) return true;
        }
        if (containsPoint(this.resourcePanel.getState().bounds, event.screenPos)) {
            if (this.resourcePanel.handleInput(event)) return true;
        }
        if (containsPoint(this.dicePanel.getState().layout.panel, event.screenPos)) {
            if (this.dicePanel.handleInput(event)) return true;
        }
        if (this.tradeOfferPanel.isOverAnyPanel(event.screenPos)) {
            if (this.tradeOfferPanel.handleInput(event)) return true;
        }

        return false;
    }

    private isOverAnyPanel(screenPos: Vec2): boolean {
        return containsPoint(this.buildPanel.getState().bounds,    screenPos)
            || containsPoint(this.resourcePanel.getState().bounds, screenPos)
            || containsPoint(this.dicePanel.getState().layout.panel, screenPos)
            || this.tradeOfferPanel.isOverAnyPanel(screenPos)
            || this.robberStealPanel.isOverAnyTarget(screenPos)
            || containsPoint(this.overviewPanel.getState().bounds, screenPos);
    }

    // ─── Update ───────────────────────────────────────────────────────

    update(deltaTimeMs: number) {
        this.tickToast(deltaTimeMs);
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): HudState {
        const buildPanel = this.buildPanel.getState();

        return {
            toast:     this.toast,
            panels: {
                build:    buildPanel,
                resource: this.resourcePanel.getState(),
                overview: this.overviewPanel.getState(),
                dice:     this.dicePanel.getState(),
                tradeOffers: this.tradeOfferPanel.getState(),
                robberSteal: this.robberStealPanel.getState()
            }
        };
    }

    // ─── Private ──────────────────────────────────────────────────────

    private tickToast(deltaTimeMs: number) {
        if (!this.toast) return;
        this.toast.remainingMs -= deltaTimeMs;
        if (this.toast.remainingMs <= 0) this.toast = null;
    }

    private showToast(message: string, kind: Toast['kind']) {
        this.toast = { message, kind, remainingMs: 2500 };
    }
}