import {InputManager} from "@/game/core/Input/InputManager.ts";
import {FrameQueue} from "@/game/core/FrameQueue.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {HUD} from "@/game/hud/HUD.ts";
import type {HudRenderer} from "@/game/rendering/hud/HUDRenderer.ts";
import type {SharedState} from "@/game/core/SharedState.ts";

export class Game {
    //private world: World;
    private hud: HUD;
    private sharedState: SharedState;
    private animationFrameId: number | null = null;
    private previousTimeMs: number = 0;

    private readonly hudRenderer: HudRenderer;

    // These are now readonly and guaranteed to exist after construction
    private readonly inputManager: InputManager;
    private readonly bus: EventBus;
    private readonly frameQueue: FrameQueue;

    private readonly MAX_FPS = 144;
    private readonly FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.bus = new EventBus();
        this.frameQueue = new FrameQueue();

        // Systems get the queue to push events, and the bus to subscribe
        //this.world = new World(this.bus, this.frameQueue);
        this.hud = new HUD(this.bus, this.frameQueue, this.sharedState);

        //Renders
        this.hudRenderer = new HudRenderer(this.canvas, this.sharedState);

        this.inputManager = new InputManager(canvas);
        this.inputManager.register(this.hud);   // priority 10
        // this.inputManager.register(this.world); // priority 0
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
    }

    // Arrow function automatically binds 'this', preventing context loss
    private readonly loop = (currentTimeMs: number) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                // 1. Flush queued events from LAST frame — mutate state before drawing
                this.frameQueue.flush(this.bus);

                // 2. Update systems
                // this.world.update();
                this.hud.update();

                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            this.hudRenderer.render(this.hud.getState());

            // Draw animations on top of the board
            //this.animationService.draw(this.layoutSettings);
            
            this.animationFrameId = requestAnimationFrame(this.loop);
    }
}