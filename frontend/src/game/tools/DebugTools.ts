// dev/DebugTools.ts
import {type SharedState} from '@/game/core/SharedState';
import {type Camera} from '@/game/core/Camera';
import {type ResolutionManager} from '@/game/core/ResolutionManager';
import {type World} from '@/game/world/World';
import {type HUD} from '@/game/hud/HUD';
import {type FrameQueue} from '@/game/core/FrameQueue';
import {TEST_SCENARIOS} from './testData';
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameActionEvents} from "@/events/game/GameActionEvents.ts";
import {GameUiEvents} from "@/events/game/GameUiEvents.ts";
import type {BuildTarget, PieceType, Resource} from "@/game/core/types.ts";

// ─── New‑system debug event templates ──────────────────────────────
interface DebugEventTemplate {
    type: keyof GameEventMap;
    description: string;
    payload: () => unknown;
}

// Feel free to extend this catalogue.
// All keys are now taken from the new event constants.
const DEBUG_EVENT_TEMPLATES: Record<string, DebugEventTemplate> = {
    // State
    "state.full.success": {
        type: GameServerEvents.state.full.success,
        description: "Full state snapshot (load scenario)",
        payload: () => {
            // This one is rarely emitted standalone; `loadScenario` does a full snapshot.
            // Provide a dummy snapshot for safety.
            return {
                lobbyId: "debug",
                snapshot: {
                    players: [],
                    // ... other minimal fields
                },
                localPlayerId: "player1",
            };
        },
    },

    // Dice
    "dice.roll.success": {
        type: GameServerEvents.dice.roll.success,
        description: "Two dice rolled (e.g. [3,4] total 7)",
        payload: () => ({
            values: [3, 4] as [number, number],
            total: 7,
        }),
    },

    // Resources
    "resource.grant.success": {
        type: GameServerEvents.resource.grant.success,
        description: "Grant resources to a player",
        payload: () => ({
            playerId: "player1",
            resources: ["wood", "brick"] as Resource[],
        }),
    },
    "resource.spent.success": {
        type: GameServerEvents.resource.spent.success,
        description: "Resources spent by a player",
        payload: () => ({
            playerId: "player1",
            resources: ["wood"] as Resource[],
        }),
    },
    "resource.discardRequired.success": {
        type: GameServerEvents.resource.discardRequired.success,
        description: "Discard required for a player",
        payload: () => ({
            playerId: "player1",
            amount: 3,
        }),
    },

    // Build
    "build.place.success": {
        type: GameServerEvents.build.settlement.success,
        description: "Piece placed on board",
        payload: () => ({
            pieceType: "settlement" as PieceType,
            target: {x: 0, y: 0} as BuildTarget,
            playerId: "player1",
        }),
    },
    "build.place.rejected": {
        type: GameServerEvents.build.settlement.rejected,
        description: "Build placement rejected",
        payload: () => ({
            pieceType: "city" as PieceType,
            reason: "INVALID_POSITION" as any,
        }),
    },

    // Turn
    "turn.start.success": {
        type: GameServerEvents.turn.start.success,
        description: "A player’s turn starts",
        payload: () => ({
            playerId: "player1",
        }),
    },
    "turn.end.success": {
        type: GameServerEvents.turn.end.success,
        description: "A player’s turn ends",
        payload: () => ({
            playerId: "player1",
        }),
    },

    // Overview / special cards
    "overview.largestArmy.success": {
        type: GameServerEvents.state.overview.largestArmy.success,
        description: "Largest army changed",
        payload: () => ({
            playerId: "player1",
            value: 3,
        }),
    },
    "overview.longestRoad.success": {
        type: GameServerEvents.state.overview.longestRoad.success,
        description: "Longest road changed",
        payload: () => ({
            playerId: "player1",
            value: 5,
        }),
    },
    "overview.victoryPoint.success": {
        type: GameServerEvents.state.overview.victoryPoint.success,
        description: "Victory point update",
        payload: () => ({
            playerId: "player1",
            value: 10,
        }),
    },

    // UI events
    "build.enter": {
        type: GameUiEvents.build.enter,
        description: "Enter build mode",
        payload: () => ({
            pieceType: "road" as PieceType,
        }),
    },
    "build.exit": {
        type: GameUiEvents.build.exit,
        description: "Exit build mode",
        payload: () => undefined,
    },

    // Action events (client‑side only)
    "action.diceRoll": {
        type: GameActionEvents.diceRoll,
        description: "Request a dice roll",
        payload: () => undefined,
    },
    "action.endTurn": {
        type: GameActionEvents.turn.end,
        description: "End the current turn",
        payload: () => undefined,
    },
    // Add more as needed...
};

// --------------------------------------------------------------------

export class DebugTools {
    constructor(
        private readonly shared:     SharedState,
        private readonly camera:     Camera,
        private readonly resolution: ResolutionManager,
        private readonly world:      World,
        private readonly hud:        HUD,
        private readonly frameQueue: FrameQueue<GameEventMap>,
    ) {
        this.register();
        this.printHelp();
    }

    // ─── Registration ─────────────────────────────────────────────────
    private register() {
        const w = window as any;

        w.debugState = () => this.debugState();
        w.debugShared = () => this.debugShared();
        w.debugBoard = () => this.debugBoard();
        w.debugPlayers = () => this.debugPlayers();
        w.debugCamera = () => this.debugCamera();
        w.debugHud = () => this.debugHud();
        w.loadScenario = (name: string) => this.loadScenario(name);
        w.emitEvent = (name: string, overrides?: Record<string, unknown>) => this.emitEvent(name, overrides);
        w.listEvents = () => this.listEvents();
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
        const template = DEBUG_EVENT_TEMPLATES[name];
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

        // Now fully typed: the queue accepts only GameEventMap events.
        this.frameQueue.push({
            type: template.type,
            payload: payload as any,   // safe because payload matches the event’s expected shape
        });
    }

    private listEvents() {
        console.group('%c[DEV] Available debug events', 'color: #50a0e0; font-weight: bold');
        Object.entries(DEBUG_EVENT_TEMPLATES).forEach(([name, template]) => {
            console.log(
                `%c${name.padEnd(30)}%c${template.description}`,
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
        this.debugWorld();
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
        console.log('hud state:   ', this.hud.getState());
        console.groupEnd();
    }

    private debugWorld() {
        console.group('%c[DEBUG] Hover', 'color: #50c0c0; font-weight: bold');
        console.log('world: ', this.world.getState());
        console.log('buildHover: ', this.world.getState().buildHover);
        console.log('robberHover: ', this.world.getState().robberHover);
    }

    private loadScenario(name: string) {
        const factory = TEST_SCENARIOS[name];
        if (!factory) {
            console.warn(
                `[DEV] Unknown scenario "${name}". Available: ${Object.keys(TEST_SCENARIOS).join(', ')}`
            );
            return;
        }

        // Uses the new server event with correct payload shape.
        this.frameQueue.push({
            type: GameServerEvents.state.full.success,
            payload: {
                lobbyId: "debug",
                snapshot: factory(),
                localPlayerId: this.shared.localPlayerId!,
            },
        });

        console.info(`%c[DEV] Loaded scenario: ${name}`, 'color: #50c050');
    }
}