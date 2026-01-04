

//Main game loop file.
import type {Board, GameState} from "@/game/model/types.ts";
import {RenderService} from "@/game/service/renderService.ts";
import type {BoardService} from "@/game/service/boardService.ts";

export class GameLoop {
    const MAX_FPS = 144;
    const FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    private game: GameState;
    private eventQueue;
    private physics;
    private inputSet;
    private profiler = null; //Dunno how to do this, but it is smart to have later on.
    private previousTimeMs = 0;
    private canvas: HTMLCanvasElement;

    //Services used in the game.
    private renderService: RenderService;

    //Update this when changing the multiplayer implementation.
    constructor() {
        this.game = null;
        this.canvas = null;
        this.eventQueue = null;
        this.renderService = new RenderService(this.canvas);
        this.physics = null;
        this.inputSet = null;
    }

    start(): void {
        //Initialize input event listener.
        //Initialize the rest.
        //Start the loop.
    }

    stop(): void {
        //Dunno bout this. xdd.
    }

    update(): void {
        requestAnimationFrame((currentTimeMs) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                this.logicUpdate();
                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            this.renderService.draw(); //Make this use the render.
            this.update();
        });
    }

    logicUpdate(): void {


        //Update physics.
    }

}