import {InputManager} from "@/game/core/Input/InputManager.ts";
import {FrameQueue} from "@/game/core/FrameQueue.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import {HUD} from "@/game/hud/HUD.ts";
import {HudRenderer} from "@/game/rendering/hud/HUDRenderer.ts";
import {SharedState} from "@/game/core/SharedState.ts";
import {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {Camera} from "@/game/core/Camera.ts";
import {layout} from "@/game/utils/HexGeometry/Layout.ts";
import {DEFAULT_HUD_THEME} from "@/game/rendering/theme/theme.ts";
import {createTestGameState, TEST_SCENARIOS} from "@/game/tools/testData.ts";
import {GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import {World} from "@/game/world/World.ts";
import {WorldRenderer} from "@/game/rendering/world/WorldRenderer.ts";
import type {GameSnapshot} from "@/game/core/types.ts";
import {GamePhaseManager} from "@/game/core/GamePhaseManager.ts";
import {SharedStateManager} from "@/game/core/SharedStateManager.ts";
import {DebugTools} from "@/game/tools/DebugTools.ts";

const DEV_MODE = import.meta.env.DEV;

export class Game {
    private readonly bus: EventBus
    private readonly frameQueue: FrameQueue;
    private sharedState: SharedState;
    private readonly gamePhase: GamePhaseManager;
    private readonly sharedManager: SharedStateManager;

    private readonly resolution: ResolutionManager;
    private readonly camera: Camera;

    private readonly hud: HUD;
    private readonly hudRenderer: HudRenderer;
    private readonly inputManager: InputManager;

    private readonly world: World;
    private readonly worldRenderer: WorldRenderer;

    private animationFrameId: number | null = null;
    private previousTimeMs: number = 0;

    private readonly MAX_FPS = 144;
    private readonly FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    constructor(private readonly canvas: HTMLCanvasElement) {
        // ── 1. Infrastructure ──────────────────────────────────────────
        this.bus         = new EventBus();
        this.frameQueue  = new FrameQueue();
        this.sharedState = new SharedState();
        this.resolution  = new ResolutionManager(canvas);
        this.gamePhase = new GamePhaseManager(this.bus, this.sharedState);
        this.sharedManager = new SharedStateManager(this.bus, this.sharedState);

        this.sharedState.setLocalPlayerId('p1');

        // ── 2. Camera ──────────────────────────────────────────────────
        this.camera = new Camera(
            layout.pointy,
            48,               // hex radius in CSS pixels
            this.resolution,
        );

        // ── 3. Systems ─────────────────────────────────────────────────
        this.hud = new HUD(this.bus, this.sharedState, this.frameQueue, this.resolution);
        this.world = new World(this.bus, this.frameQueue, this.sharedState, this.camera);

        // ── 4. Renderers ───────────────────────────────────────────────
        const ctx = canvas.getContext('2d')!;
        this.hudRenderer = new HudRenderer(ctx, this.resolution, DEFAULT_HUD_THEME);
        this.worldRenderer = new WorldRenderer(ctx, this.camera, this.sharedState);

        // ── 5. Input ───────────────────────────────────────────────────
        this.inputManager = new InputManager(canvas);
        this.inputManager.register(this.hud);  // priority 10
        this.inputManager.register(this.world); // priority 0

        if (DEV_MODE) {
            this.loadTestData();
            new DebugTools(
                this.sharedState,
                this.camera,
                this.resolution,
                this.world,
                this.hud,
                this.frameQueue,
            );
        }
    }

    public start() {
        if (this.animationFrameId === null) {
            this.loop(0);
        }
    }

    public destroy() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.resolution.destroy();
        this.inputManager.destroy();
    }

    // Arrow function automatically binds 'this', preventing context loss
    private readonly loop = (currentTimeMs: number) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                // 1. Flush queued events from LAST frame — mutate state before drawing
                this.frameQueue.flush(this.bus);

                // 2. Update systems
                this.world.update(deltaTimeMs);
                this.hud.update(deltaTimeMs);

                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            const ctx = this.canvas.getContext("2d")!;
            const r = this.resolution.get();

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, r.pixelWidth, r.pixelHeight);

            // Reapply dpr scale as base transform
            ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0);

            this.worldRenderer.render(this.world.getState());
            this.hudRenderer.render(this.hud.getState());

            // Draw animations on top of the board
            //this.animationService.draw(this.layoutSettings);
            
            this.animationFrameId = requestAnimationFrame(this.loop);
    }

    private loadTestData() {
        const load = (snapshot: GameSnapshot) => {
            this.frameQueue.push({
                type:    GameEventType.GAME_STATE_LOADED,
                payload: snapshot,
                source:  GameEventSource.Network,
            });
        };

        load(createTestGameState());

        // Use arrow function that always reads current game instance
        // Survives React StrictMode remounts because it's reassigned each time
        (window as any).loadScenario = (name: keyof typeof TEST_SCENARIOS) => {
            const factory = TEST_SCENARIOS[name];
            if (!factory) {
                console.warn(
                    `Unknown scenario "${name}". Available: ${Object.keys(TEST_SCENARIOS).join(', ')}`
                );
                return;
            }
            load(factory());
            console.info(`%c[DEV] Loaded scenario: ${name}`, 'color: #50c050');
        };

        console.info(
            '%c[DEV] Scenarios: ' + Object.keys(TEST_SCENARIOS).join(', '),
            'color: #50a0e0; font-weight: bold'
        );
    }
}