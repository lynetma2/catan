// hud/HUD.ts
import { type EventBus }             from '@/game/core/EventBus';
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type ResolutionManager,
    type Resolution }           from '@/game/core/ResolutionManager';
import { type InputLayer }           from '@/game/core/Input/InputManager';
import { type NormalizedInputEvent } from '@/game/types/InputEvent';
import { type HudState,
    type HudBounds,
    type Toast }                from '@/game/types/HudState';
import { type EventPayloads }        from '@/game/events/GameEventTypes';
import { BuildPanel }                from './panels/BuildPanel';
import { ResourcePanel }             from './panels/ResourcePanel';
import { containsPoint }             from '@/game/types/Rect';
import { hudLayout }                 from './HudLayout';

export class HUD implements InputLayer {
    readonly priority = 10;

    private buildMode:  HudState['buildMode'] = null;
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
        this.buildPanel    = new BuildPanel(frameQueue);
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
            buildMode: this.buildMode,
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
            build:    hudLayout.resolve({ anchorX: 'left',  anchorY: 'top',    offsetX: 20, offsetY: 20,  width: 200, height: 260 }, r),
            resource: hudLayout.resolve({ anchorX: 'left',  anchorY: 'bottom', offsetX: 20, offsetY: 20,  width: 200, height: 180 }, r),
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