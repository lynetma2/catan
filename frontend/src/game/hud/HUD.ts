// hud/HUD.ts
import { EventBus }       from '../core/EventBus';
import { FrameQueue }     from '../core/FrameQueue';
import { SharedState }    from '../core/SharedState';
import { InputLayer }     from '../core/InputManager';
import { NormalizedInputEvent } from '../types/InputEvent';
import { HudState, PanelState } from '../types/HudState';
import { EventPayloads }  from '../events/GameEventTypes';
import { HudEventType }   from '../events/HudEvents';
import { ResourcePanel }  from './panels/ResourcePanel';
import { BuildPanel }     from './panels/BuildPanel';
import { Vec2 }           from '../types/Vec2';

export class HUD implements InputLayer {
    priority = 10;

    private state: HudState = {
        toast:     null,
        buildMode: null,
        panels: {
            resource: { visible: true },
            build:    { visible: true, selectedPiece: null },
        }
    };

    // Sub-panels — each owns its own local UI state
    private resourcePanel: ResourcePanel;
    private buildPanel:    BuildPanel;

    constructor(
        private bus:        EventBus,
        private frameQueue: FrameQueue,
        private shared:     SharedState
    ) {
        this.resourcePanel = new ResourcePanel(shared);
        this.buildPanel    = new BuildPanel(frameQueue);

        this.subscribeToEvents();
    }

    // ─── Subscriptions ───────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on('BUILD_MODE_ENTERED', e => this.onBuildModeEntered(e.payload));
        this.bus.on('BUILD_MODE_EXITED',  () => this.onBuildModeExited());
        this.bus.on('BUILD_REJECTED',     e => this.onBuildRejected(e.payload));
        this.bus.on('BUILD_PLACED',       e => this.onBuildPlaced(e.payload));
        this.bus.on('RESOURCES_GRANTED',  e => this.onResourcesGranted(e.payload));
        this.bus.on('TURN_STARTED',       e => this.onTurnStarted(e.payload));
    }

    private onBuildModeEntered(payload: EventPayloads['BUILD_MODE_ENTERED']) {
        this.state.buildMode = payload.pieceType;
        this.state.panels.build.selectedPiece = payload.pieceType;
    }

    private onBuildModeExited() {
        this.state.buildMode = null;
        this.state.panels.build.selectedPiece = null;
    }

    private onBuildRejected(payload: EventPayloads['BUILD_REJECTED']) {
        const messages: Record<string, string> = {
            NO_ADJACENT_ROAD:       'Must be connected to a road',
            INSUFFICIENT_RESOURCES: 'Not enough resources',
            SPOT_OCCUPIED:          'Already occupied',
        };
        this.showToast(messages[payload.reason] ?? 'Cannot build here', 'error');
    }

    private onBuildPlaced(payload: EventPayloads['BUILD_PLACED']) {
        this.showToast(`${payload.pieceType} placed!`, 'success');
        this.onBuildModeExited();
    }

    private onResourcesGranted(payload: EventPayloads['RESOURCES_GRANTED']) {
        if (payload.playerId === this.shared.localPlayerId) {
            this.showToast('Resources received!', 'info');
        }
    }

    private onTurnStarted(payload: EventPayloads['TURN_STARTED']) {
        const isLocalPlayer = payload.playerId === this.shared.localPlayerId;
        this.showToast(isLocalPlayer ? 'Your turn!' : `Player ${payload.playerId}'s turn`, 'info');
    }

    // ─── Input ───────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        // Forward to panels in order — first one to consume stops propagation
        if (this.state.panels.build.visible) {
            if (this.buildPanel.handleInput(event)) return true;
        }
        if (this.state.panels.resource.visible) {
            if (this.resourcePanel.handleInput(event)) return true;
        }
        return false;
    }

    // ─── Update ──────────────────────────────────────────────────────

    update() {
        this.state.hoveredPiece = this.buildPanel.getHovered(); // pulled in during update
        this.tickToast();
    }

    private tickToast() {
        if (!this.state.toast) return;
        this.state.toast.remainingMs -= 16; // ~1 frame at 60fps
        if (this.state.toast.remainingMs <= 0) {
            this.state.toast = null;
        }
    }

    // ─── State ───────────────────────────────────────────────────────

    getState(): HudState {
        return {
            buildMode: this.state.buildMode,
            toast:     this.state.toast,
            panels: {
                resource: this.state.panels.resource,
                build:    this.buildPanel.getState(),  // panel speaks for itself
            }
        };
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private push<T extends HudEventType>(type: T, payload: EventPayloads[T]) {
        this.frameQueue.push({ type, payload, source: 'hud' });
    }

    private showToast(message: string, kind: 'error' | 'info' | 'success') {
        this.state.toast = { message, kind, remainingMs: 2500 };
    }
}