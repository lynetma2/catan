// hud/HUD.ts
import { type EventBus }             from '@/game/core/EventBus';
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type ResolutionManager}           from '@/game/core/ResolutionManager';
import { BuildPanel }                from './panels/build/BuildPanel.ts';
import type {InputLayer} from "@/game/core/Input/types.ts";
import {type HudState, type Toast} from "@/game/hud/types.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import {ResourcePanel} from "@/game/hud/panels/resource/ResourcePanel.ts";
import {PlayerOverviewPanel} from "@/game/hud/panels/overview/OverviewPanel.ts";
import {GameEventType} from "@/game/events/GameEventTypes.ts";

export class HUD implements InputLayer {
    readonly priority = 10;

    private toast:      Toast | null          = null;

    private readonly buildPanel:    BuildPanel;
    private readonly resourcePanel: ResourcePanel;
    private readonly overviewPanel: PlayerOverviewPanel;

    constructor(
        private readonly bus:        EventBus,
        private readonly shared:     SharedState,
        frameQueue: FrameQueue,
        resolution: ResolutionManager,
    ) {
        this.buildPanel    = new BuildPanel(frameQueue, shared, resolution);
        this.resourcePanel = new ResourcePanel(shared, resolution);
        this.overviewPanel = new PlayerOverviewPanel(bus, shared, resolution);

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
        // Keyboard events have no position — forward directly
        if (event.type === 'keydown' || event.type === 'keyup') {
            return this.buildPanel.handleInput(event);
        }

        // Positional events — only forward if inside a panel's bounds
        if (containsPoint(this.buildPanel.getState().bounds, event.screenPos)) {
            if (this.buildPanel.handleInput(event)) return true;
        }
        if (containsPoint(this.resourcePanel.getState().bounds, event.screenPos)) {
            if (this.resourcePanel.handleInput(event)) return true;
        }

        return false;
    }

    // ─── Update ───────────────────────────────────────────────────────

    update(deltaTimeMs: number) {
        this.tickToast(deltaTimeMs);
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): HudState {
        return {
            toast:     this.toast,
            panels: {
                build:    this.buildPanel.getState(),
                resource: this.resourcePanel.getState(),
                overview: this.overviewPanel.getState(),
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