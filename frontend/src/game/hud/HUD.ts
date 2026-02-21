// hud/HUD.ts
import { type EventBus }             from '@/game/core/EventBus';
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type ResolutionManager,
    type Resolution }           from '@/game/core/ResolutionManager';
import { BuildPanel }                from './panels/BuildPanel';
import { ResourcePanel }             from './panels/ResourcePanel';
import { hudLayout }                 from './HudLayout';
import type {InputLayer} from "@/game/core/Input/types.ts";
import {Anchor, type HudBounds, type HudState, type Toast} from "@/game/hud/types.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";

export class HUD implements InputLayer {
    readonly priority = 10;

    private toast:      Toast | null          = null;
    private bounds:     HudBounds;

    private readonly buildPanel:    BuildPanel;
    private readonly resourcePanel: ResourcePanel;

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.buildPanel    = new BuildPanel(frameQueue, shared);
        this.resourcePanel = new ResourcePanel(shared);

        // Resolve initial bounds
        this.bounds = this.resolveBounds(resolution.get());

        // Re-resolve on resize
        resolution.onChange(r => {
            this.bounds = this.resolveBounds(r);
        });

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        /*
        this.bus.on('BUILD_MODE_ENTERED', e => {
            this.buildMode = e.payload.pieceType;
        });
        this.bus.on('BUILD_MODE_EXITED', () => {
            this.buildMode = null;
            this.buildPanel.clearSelection();
        });
        this.bus.on('BUILD_REJECTED', e => {
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
        this.bus.on('BUILD_PLACED', e => {
            this.showToast(`${e.payload.pieceType} placed!`, 'success');
            this.buildMode = null;
            this.buildPanel.clearSelection();
        });
        this.bus.on('RESOURCES_GRANTED', e => {
            if (e.payload.playerId === this.shared.localPlayerId) {
                this.showToast('Resources received!', 'info');
            }
        });
        this.bus.on('TURN_STARTED', e => {
            const isLocal = e.payload.playerId === this.shared.localPlayerId;
            this.showToast(isLocal ? 'Your turn!' : `Player ${e.payload.playerId}'s turn`, 'info');
        });
        */
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        // Keyboard events have no position — forward directly
        if (event.type === 'keydown' || event.type === 'keyup') {
            return this.buildPanel.handleInput(event);
        }

        // Positional events — only forward if inside a panel's bounds
        if (containsPoint(this.bounds.build, event.screenPos)) {
            if (this.buildPanel.handleInput(event)) return true;
        }
        if (containsPoint(this.bounds.resource, event.screenPos)) {
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
            bounds:    this.bounds,
            panels: {
                build:    this.buildPanel.getState(),
                resource: this.resourcePanel.getState(),
            }
        };
    }

    // ─── Private ──────────────────────────────────────────────────────

    private resolveBounds(r: Resolution): HudBounds {
        return {
            build:    hudLayout.resolve({ anchorX: Anchor.Left,  anchorY: Anchor.Top,    offsetX: 20, offsetY: 20,  width: 200, height: 260 }, r),
            resource: hudLayout.resolve({ anchorX: Anchor.Left,  anchorY: Anchor.Bottom, offsetX: 20, offsetY: 20,  width: 200, height: 180 }, r),
        };
    }

    private tickToast(deltaTimeMs: number) {
        if (!this.toast) return;
        this.toast.remainingMs -= deltaTimeMs;
        if (this.toast.remainingMs <= 0) this.toast = null;
    }

    private showToast(message: string, kind: Toast['kind']) {
        this.toast = { message, kind, remainingMs: 2500 };
    }
}