

//Main game loop file.
import type {GameState} from "@/game/model/types.ts";
import {RenderService} from "@/game/service/renderService.ts";
import {TEST_GAMESTATE} from "@/game/model/testGame.ts";
import {defaultLayoutSettings} from "@/game/model/defaultLayoutSettings.ts";

export class GameLoop {
    MAX_FPS = 144;
    FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    private game: GameState;
    private eventQueue;
    private physics;
    private inputSet;
    private profiler = null; //Dunno how to do this, but it is smart to have later on.
    private previousTimeMs = 0;
    private canvas: HTMLCanvasElement;
    private animationFrameId: number | null = null;

    //Services used in the game.
    private renderService: RenderService;

    //Update this when changing the multiplayer implementation.
    constructor(canvas: HTMLCanvasElement) {
        this.game = TEST_GAMESTATE;
        this.canvas = canvas;
        this.eventQueue = null;
        this.renderService = new RenderService(this.canvas);
        this.physics = null;
        this.inputSet = null;
    }

    start(): void {
        //Initialize input event listener.
        //Initialize the rest.
        //Start the loop.
        this.update();
    }

    stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    update(): void {
        this.animationFrameId = requestAnimationFrame((currentTimeMs) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                //Handle incoming network events (Make sure everything is up to date from the mulitplayer server
                //Handle input.
                //Handle physics.
                this.logicUpdate(); //Put logic updates here!
                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            this.renderService.draw(defaultLayoutSettings, this.game); //Make this use the render.
            this.update();
        });
    }

    logicUpdate(): void {


        //Update physics.
    }

}