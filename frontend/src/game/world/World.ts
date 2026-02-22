// world/World.ts
import { type EventBus }             from '@/game/core/EventBus';
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type Camera }               from '@/game/core/Camera';
import { type InputLayer }           from '@/game/core/Input/InputManager';
import { type NormalizedInputEvent } from '@/game/core/Input/InputEvent';
import { type WorldState }           from './types';
import { Board }                     from './board/Board';
import { BuildSystem }               from './systems/BuildSystem';
import { ResourceSystem }            from './systems/ResourceSystem';
import { HoverSystem }               from './systems/HoverSystem';
import { GamePhaseManager }          from '@/game/core/GamePhaseManager';
import { GameEventType,
    GameEventSource }           from '@/game/events/GameEventTypes';

export class World implements InputLayer {
    readonly priority = 0;

    private readonly board:         Board;
    private readonly buildSystem:   BuildSystem;
    private readonly resourceSystem: ResourceSystem;
    private readonly hoverSystem:   HoverSystem;
    private readonly gamePhase:     GamePhaseManager;

    private isPanning:     boolean = false;
    private lastPanPos:    { x: number; y: number } | null = null;

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly camera:     Camera,
    ) {
        this.board         = new Board();
        this.gamePhase     = new GamePhaseManager(bus, shared);
        this.buildSystem   = new BuildSystem(bus, frameQueue, shared, this.board, this.gamePhase);
        this.resourceSystem = new ResourceSystem(bus, frameQueue, shared, this.board);
        this.hoverSystem   = new HoverSystem(this.board, camera);

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.GameStateLoaded, e => this.onGameStateLoaded(e.payload));
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GameStateLoaded]) {
        this.board.loadFromSnapshot(payload.placements);
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        // Keyboard
        if (event.type === 'keydown') {
            return this.handleKeyDown(event.key);
        }

        // Pan — middle or right mouse button
        if (event.type === 'mousedown' && this.isPanButton(event.button)) {
            this.isPanning  = true;
            this.lastPanPos = event.screenPos;
            return true;
        }

        if (event.type === 'mouseup') {
            this.isPanning  = false;
            this.lastPanPos = null;
            return false;
        }

        if (event.type === 'mousemove') {
            if (this.isPanning && this.lastPanPos) {
                this.camera.panBy({
                    x: event.screenPos.x - this.lastPanPos.x,
                    y: event.screenPos.y - this.lastPanPos.y,
                });
                this.lastPanPos = event.screenPos;
                return true;
            }

            // Update hover — always runs even when not panning
            this.hoverSystem.update(event.screenPos, this.resolveHoverMode());
            return false;
        }

        if (event.type === 'wheel') {
            this.camera.zoomAt(event.screenPos, event.delta > 0 ? 0.9 : 1.1);
            return true;
        }

        if (event.type === 'click') {
            return this.handleClick(event.screenPos);
        }

        return false;
    }

    private handleClick(screenPos: { x: number; y: number }): boolean {
        const target = this.hoverSystem.getTarget();
        if (!target) return false;

        const buildMode = this.shared.buildMode;

        if (buildMode === 'settlement' && target.kind === 'vertex') {
            this.frameQueue.push({
                type:    GameEventType.BuildPlacementRequested,
                payload: { pieceType: 'settlement', target },
                source:  GameEventSource.Input,
            });
            return true;
        }

        if (buildMode === 'city' && target.kind === 'vertex') {
            this.frameQueue.push({
                type:    GameEventType.BuildPlacementRequested,
                payload: { pieceType: 'city', target },
                source:  GameEventSource.Input,
            });
            return true;
        }

        if (buildMode === 'road' && target.kind === 'edge') {
            this.frameQueue.push({
                type:    GameEventType.BuildPlacementRequested,
                payload: { pieceType: 'road', target },
                source:  GameEventSource.Input,
            });
            return true;
        }

        return false;
    }

    private handleKeyDown(key: string): boolean {
        if (key === 'escape' && this.shared.buildMode) {
            this.frameQueue.push({
                type:    GameEventType.BuildModeExited,
                payload: {},
                source:  GameEventSource.Input,
            });
            return true;
        }
        return false;
    }

    // ─── Update ───────────────────────────────────────────────────────

    update(deltaTimeMs: number) {
        // Systems update themselves via event subscriptions
        // World.update is reserved for time-based concerns if needed
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): WorldState {
        return {
            hover:      this.hoverSystem.getState(),
            placements: this.board.placementMap.getState(),
            tiles:      this.board.hexGrid.getState(),
        };
    }

    // ─── Private helpers ──────────────────────────────────────────────

    private resolveHoverMode() {
        switch (this.shared.buildMode) {
            case 'road':       return 'edge';
            case 'settlement':
            case 'city':       return 'vertex';
            default:           return 'inspect';
        }
    }

    private isPanButton(button: string): boolean {
        return button === 'middle' || button === 'right';
    }
}