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
import {ResourcePanel} from "@/game/hud/panels/resource/ResourcePanel.ts";
import {PlayerOverviewPanel} from "@/game/hud/panels/overview/OverviewPanel.ts";
import {GameEventType} from "@/game/events/GameEventTypes.ts";
import {DicePanel} from "@/game/hud/panels/dice/DicePanel.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {ResourcePanelManager} from "@/game/hud/panels/resource2/ResourcePanelManager.ts";

export class HUD implements InputLayer {
    readonly priority = 10;

    private toast:      Toast | null          = null;

    private readonly buildPanel:    BuildPanel;
    private readonly resourcePanel: ResourcePanelManager;
    private readonly overviewPanel: PlayerOverviewPanel;
    private readonly dicePanel: DicePanel;

    constructor(
        private readonly bus:        EventBus,
        private readonly shared:     SharedState,
        frameQueue: FrameQueue,
        resolution: ResolutionManager,
    ) {
        this.buildPanel    = new BuildPanel(frameQueue, shared, resolution, bus);
        this.resourcePanel = new ResourcePanelManager(shared, resolution, bus, frameQueue);
        this.overviewPanel = new PlayerOverviewPanel(bus, shared, resolution);
        this.dicePanel = new DicePanel(bus, frameQueue, shared, resolution);

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.BUILD_REJECTED, e => {
            const messages: Record<string, string> = {
                NO_ADJACENT_ROAD:       'Must be connected to a road',
                INSUFFICIENT_RESOURCES: 'Not enough resources',
                SPOT_OCCUPIED:          'Already occupied',
                DISTANCE_RULE_VIOLATED: 'Too close to another settlement',
                NOT_YOUR_TURN:          'Not your turn',
                WRONG_PHASE:            'Cannot build right now',
            };
            this.showToast(messages[e.payload.reason] ?? 'Cannot build here', 'error');
        });
        this.bus.on(GameEventType.BUILD_PLACED, e => {
            this.showToast(`${e.payload.pieceType} placed!`, 'success');
            this.buildPanel.clearSelection();
        });
        this.bus.on(GameEventType.RESOURCES_GRANTED, e => {
            if (e.payload.playerId === this.shared.localPlayerId) {
                this.showToast('Resources received!', 'info');
            }
        });
        this.bus.on(GameEventType.TURN_STARTED, e => {
            const isLocal = e.payload.playerId === this.shared.localPlayerId;
            this.showToast(isLocal ? 'Your turn!' : `Player ${e.payload.playerId}'s turn`, 'info');
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
            return false;
        }

        // MouseMove — forward to all panels for hover tracking
        // but only consume if mouse is actually over a panel
        if (event.type === InputType.MouseMove) {
            this.buildPanel.handleInput(event);
            this.resourcePanel.handleInput(event);
            this.dicePanel.handleInput(event);

            // Consume if over any panel — prevents world hover underneath
            return this.isOverAnyPanel(event.screenPos);
        }

        // Click events — only forward if inside panel bounds
        if (containsPoint(this.buildPanel.getState().bounds, event.screenPos)) {
            if (this.buildPanel.handleInput(event)) return true;
        }
        if (containsPoint(this.resourcePanel.getState().bounds, event.screenPos)) {
            if (this.resourcePanel.handleInput(event)) return true;
        }
        if (containsPoint(this.dicePanel.getState().layout.panel, event.screenPos)) {
            if (this.dicePanel.handleInput(event)) return true;
        }

        return false;
    }

    private isOverAnyPanel(screenPos: Vec2): boolean {
        return containsPoint(this.buildPanel.getState().bounds,    screenPos)
            || containsPoint(this.resourcePanel.getState().bounds, screenPos)
            || containsPoint(this.dicePanel.getState().layout.panel, screenPos);
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