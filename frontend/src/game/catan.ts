

//Main game loop file.
import type {ClientState, GameState, LayoutSettings} from "@/game/model/types.ts";
import {RenderService} from "@/game/service/renderService.ts";
import {InputService} from "@/game/service/inputService.ts";
import {AnimationService} from "@/game/service/animationService.ts";
import {PingAnimation} from "@/game/animations/pingAnimation.ts";
import {TEST_GAMESTATE} from "@/game/model/testGame.ts";
import {defaultLayoutSettings} from "@/game/model/defaultLayoutSettings.ts";

export class GameLoop {
    MAX_FPS = 144;
    FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    private game: GameState;
    private clientState: ClientState;
    private eventQueue;
    private physics;
    private inputSet;
    private profiler = null; //Dunno how to do this, but it is smart to have later on.
    private previousTimeMs = 0;
    private readonly canvas: HTMLCanvasElement;
    private animationFrameId: number | null = null;
    private readonly layoutSettings: LayoutSettings;

    //Services used in the game.
    private readonly renderService: RenderService;
    private readonly inputService: InputService;
    private readonly animationService: AnimationService;

    //Update this when changing the multiplayer implementation.
    constructor(canvas: HTMLCanvasElement) {
        this.game = TEST_GAMESTATE;
        
        // Initialize ClientState. For Hotseat, we start as "Player 1".
        // Later, this will come from your auth system.
        this.clientState = { localPlayerId: "Player 1" };

        this.canvas = canvas;
        this.eventQueue = null;
        this.renderService = new RenderService(this.canvas);
        this.inputService = new InputService(this.canvas);
        this.animationService = new AnimationService(this.canvas);
        
        // Create a copy of the settings so we can modify them (pan/zoom) without affecting the default constant
        this.layoutSettings = structuredClone(defaultLayoutSettings);

        this.initializeInputHandlers();

        this.physics = null;
        this.inputSet = null;
    }

    start(): void {
        //Initialize input event listener.
        this.inputService.start();
        //Initialize the rest.
        //Start the loop.
        this.update();
    }

    stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.inputService.stop();
        this.animationService.clear();
    }

    update(): void {
        this.animationFrameId = requestAnimationFrame((currentTimeMs) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                this.logicUpdate(); //Put logic updates here!
                this.animationService.update(deltaTimeMs);
                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            this.renderService.draw(this.layoutSettings, this.game); //Make this use the render.
            // Draw animations on top of the board
            this.animationService.draw(this.layoutSettings);
            this.update();
        });
    }

    logicUpdate(): void {


        //Update physics.
    }

    initializeInputHandlers(): void {
        this.inputService.onMouseClick = (x, y) => {
            InputService.handleMouseClick(this.game, x, y);
            
            // Demo: Play a ping animation where the user clicked
            this.animationService.play(new PingAnimation({x, y}));
        };

        this.inputService.onMouseMove = (x, y) => {
            InputService.handleMouseMovement(this.game, this.layoutSettings, x, y);
        }

        this.inputService.onPan = (dx, dy) => {
            InputService.handleMousePan(this.layoutSettings, dx, dy);
        };

        this.inputService.onZoom = (delta) => {
            InputService.handleMouseZoom(this.layoutSettings, delta);
        };
    }

    //Ping system, should be introduced
    //Look at league for inspiration
    //Remember lost ping options like "bait"


    //Feature request
    //Water outside the board should use textures and 3d effect from "Sea og Thieves"
}