// dev/DebugTools.ts
import { type SharedState }   from '@/game/core/SharedState';
import { type Camera }        from '@/game/core/Camera';
import { type ResolutionManager } from '@/game/core/ResolutionManager';
import { type World }         from '@/game/world/World';
import { type HUD }           from '@/game/hud/HUD';
import { type FrameQueue }    from '@/game/core/FrameQueue';
import { GameEventType,
    GameEventSource }    from '@/game/events/GameEventTypes';
import { TEST_SCENARIOS }     from './testData';
import {DEBUG_EVENT_TEMPLATES} from "@/game/tools/DebugEvents.ts";

export class DebugTools {
    constructor(
        private readonly shared:     SharedState,
        private readonly camera:     Camera,
        private readonly resolution: ResolutionManager,
        private readonly world:      World,
        private readonly hud:        HUD,
        private readonly frameQueue: FrameQueue,
    ) {
        this.register();
        this.printHelp();
    }

    // ─── Registration ─────────────────────────────────────────────────

    private register() {
        const w = window as any;

        w.debugState      = () => this.debugState();
        w.debugShared     = () => this.debugShared();
        w.debugBoard      = () => this.debugBoard();
        w.debugPlayers    = () => this.debugPlayers();
        w.debugCamera     = () => this.debugCamera();
        w.debugHud        = () => this.debugHud();
        w.loadScenario    = (name: string) => this.loadScenario(name);
        w.emitEvent       = (name: string, overrides?: Record<string, unknown>) => this.emitEvent(name, overrides);
        w.listEvents      = () => this.listEvents();
    }

    private printHelp() {
        console.info(
            '%c[DEV] Debug tools available:',
            'color: #50a0e0; font-weight: bold'
        );
        console.info(
            '%c  debugState()   debugShared()   debugBoard()\n' +
            '  debugPlayers() debugCamera()   debugHud()\n' +
            '  loadScenario(name)\n' +
            '  emitEvent(name, overrides?) — listEvents() to see all',
            'color: #aaaaaa'
        );
    }

    private emitEvent(name: string, overrides?: Record<string, unknown>) {
        const template = (DEBUG_EVENT_TEMPLATES as any)[name];
        if (!template) {
            console.warn(
                `[DEV] Unknown event "${name}". Run listEvents() to see available events.`
            );
            return;
        }

        const payload = { ...template.payload(), ...overrides };

        console.info(
            `%c[DEV] Emitting: ${name}`,
            'color: #50c050; font-weight: bold',
            payload
        );

        this.frameQueue.push({
            type:    template.type,
            payload: payload as any,
            source:  GameEventSource.Network,  // pretend it came from server
        });
    }

    private listEvents() {
        console.group('%c[DEV] Available debug events', 'color: #50a0e0; font-weight: bold');
        Object.entries(DEBUG_EVENT_TEMPLATES).forEach(([name, template]) => {
            console.log(
                `%c${name.padEnd(20)}%c${template.description}`,
                'color: #e0c050; font-weight: bold',
                'color: #aaaaaa'
            );
        });
        console.groupEnd();
    }

    // ─── Commands ─────────────────────────────────────────────────────

    private debugState() {
        console.group('%c[DEBUG] Full Game State', 'color: #50a0e0; font-weight: bold');
        this.debugShared();
        this.debugBoard();
        this.debugPlayers();
        this.debugCamera();
        this.debugHud();
        console.groupEnd();
    }

    private debugShared() {
        console.group('%c[DEBUG] SharedState', 'color: #50c050; font-weight: bold');
        console.log('localPlayerId:     ', this.shared.localPlayerId);
        console.log('currentPlayerId:   ', this.shared.currentPlayerId);
        console.log('currentPhase:      ', this.shared.currentPhase);
        console.log('buildMode:         ', this.shared.buildMode);
        console.log('isLocalPlayersTurn:', this.shared.isLocalPlayersTurn);
        console.log('isBuildingPhase:   ', this.shared.isBuildingPhase);
        console.log('localPlayer:       ', this.shared.localPlayer);
        console.groupEnd();
    }

    private debugBoard() {
        const { tiles, placements } = this.world.getState();

        console.group('%c[DEBUG] Board', 'color: #e0a030; font-weight: bold');

        console.group(`Tiles (${tiles.tiles.length} total)`);
        console.log('land:   ', tiles.tiles.filter(t => t.kind === 'land'));
        console.log('desert: ', tiles.tiles.filter(t => t.kind === 'desert'));
        console.log('sea:    ', tiles.tiles.filter(t => t.kind === 'sea'));
        console.groupEnd();

        console.group(`Placements`);
        console.log('settlements/cities:', placements.vertices);
        console.log('roads:             ', placements.edges);
        console.groupEnd();

        console.groupEnd();
    }

    private debugPlayers() {
        console.group('%c[DEBUG] Players', 'color: #c050c0; font-weight: bold');
        this.shared.players.forEach((player, id) => {
            const isLocal   = id === this.shared.localPlayerId;
            const isCurrent = id === this.shared.currentPlayerId;
            const label     = `${id}${isLocal ? ' (local)' : ''}${isCurrent ? ' (current turn)' : ''}`;
            console.group(label);
            console.log(player);
            console.groupEnd();
        });
        console.groupEnd();
    }

    private debugCamera() {
        console.group('%c[DEBUG] Camera', 'color: #e05050; font-weight: bold');
        console.log('zoom:      ', this.camera.getZoom());
        console.log('pan:       ', this.camera.getPan());
        console.log('resolution:', this.resolution.get());
        console.groupEnd();
    }

    private debugHud() {
        console.group('%c[DEBUG] HUD', 'color: #50c0c0; font-weight: bold');
        console.log('hover target:', this.world.getState().hover.target);
        console.log('hud state:   ', this.hud.getState());
        console.groupEnd();
    }

    private loadScenario(name: string) {
        const factory = TEST_SCENARIOS[name];
        if (!factory) {
            console.warn(
                `[DEV] Unknown scenario "${name}". Available: ${Object.keys(TEST_SCENARIOS).join(', ')}`
            );
            return;
        }
        this.frameQueue.push({
            type:    GameEventType.GAME_STATE_LOADED,
            payload: factory(),
            source:  GameEventSource.Network,
        });
        console.info(`%c[DEV] Loaded scenario: ${name}`, 'color: #50c050');
    }
}