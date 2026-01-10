//Main game loop file.
import type {ClientState, GameState, HUDEntities, LayoutSettings} from "@/game/model/types.ts";
import {RenderService} from "@/game/service/renderService.ts";
import {InputService} from "@/game/service/inputService.ts";
import {AnimationService} from "@/game/service/animationService.ts";
import {PingAnimation} from "@/game/animations/pingAnimation.ts";
import {TEST_GAMESTATE, TEST_HUD} from "@/game/model/testGame.ts";
import {WorldLayoutService} from "@/game/service/layout/WorldLayoutService.ts";
import type {GameContext, GameStateHandler} from "@/game/state/GameStateHandler.ts";
import {DefaultState} from "@/game/state/DefaultState.ts"; // Hypothetical import
import {ButtonType} from "@/game/model/enums.ts";
import {BuildRoadState} from "@/game/state/BuildRoadState.ts";
import {BuildSettlementState} from "@/game/state/BuildSettlementState.ts";

export class GameLoop implements GameContext {
    MAX_FPS = 144;
    FRAME_INTERVAL_MS = 1000 / this.MAX_FPS;

    private game: GameState;
    private hudEntities: HUDEntities;
    private clientState: ClientState;
    private eventQueue;
    private physics;
    private inputSet;
    private profiler = null; //Dunno how to do this, but it is smart to have later on.
    private previousTimeMs = 0;
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private animationFrameId: number | null = null;
    private readonly layoutSettings: LayoutSettings;

    // The State Pattern: Holds the current behavior
    private currentState: GameStateHandler;

    //Services used in the game.
    private readonly renderService: RenderService;
    private readonly inputService: InputService;
    private readonly animationService: AnimationService;

    //Update this when changing the multiplayer implementation.
    constructor(canvas: HTMLCanvasElement) {
        this.game = TEST_GAMESTATE;
        this.hudEntities = TEST_HUD;

        // Initialize ClientState. For Hotseat, we start as "Player 1".
        // Later, this will come from your auth system.
        this.clientState = {localPlayerId: "Player 1"};

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d')!;
        this.eventQueue = null;
        this.renderService = new RenderService(this.canvas);
        this.inputService = new InputService(this.canvas);
        this.animationService = new AnimationService(this.canvas);

        // Ensure canvas size is correct before calculating layout
        this.updateCanvasSize();
        
        // Create layout settings using the factory
        this.layoutSettings = WorldLayoutService.getInitialLayout(this.canvas.width, this.canvas.height);

        window.addEventListener('resize', this.handleResize);

        // Initialize default state
        this.setGameState(new DefaultState());

        this.initializeInputHandlers();

        this.physics = null;
        this.inputSet = null;
    }

    public setGameState(newState: GameStateHandler) {
        if (this.currentState) {
            this.currentState.onExit(this.game);
        }
        this.currentState = newState;
        // Pass layoutSettings so the new state can immediately snap to the mouse position
        this.currentState.onEnter(this.game, this.layoutSettings, this);
    }

    public handleButtonAction(type: ButtonType) {
        // Centralized Transition Logic
        switch (type) {
            case ButtonType.putRoad:
                this.setGameState(new BuildRoadState());
                break;
            case ButtonType.putSettlement:
                this.setGameState(new BuildSettlementState());
                break;
            case ButtonType.endTurn:
                // PlayerService.nextTurn(...)
                break;
        }
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
        window.removeEventListener('resize', this.handleResize);
    }

    update(): void {
        this.animationFrameId = requestAnimationFrame((currentTimeMs) => {
            const deltaTimeMs = currentTimeMs - this.previousTimeMs;

            if (deltaTimeMs >= this.FRAME_INTERVAL_MS) {
                this.logicUpdate(); //Put logic updates here!
                this.currentState.update(this.game, this.layoutSettings);
                this.animationService.update(deltaTimeMs);
                this.previousTimeMs = currentTimeMs - (deltaTimeMs % this.FRAME_INTERVAL_MS);
            }

            this.renderService.draw(this.layoutSettings, this.game, this.currentState);

            // Draw animations on top of the board
            this.animationService.draw(this.layoutSettings);
            this.update();
        });
    }

    private updateCanvasSize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    private readonly handleResize = () => {
        this.updateCanvasSize();

        this.layoutSettings.viewport = {
            width: this.canvas.width,
            height: this.canvas.height
        };

        if (this.currentState) {
            this.currentState.onResize(this.layoutSettings);
        }
    }

    logicUpdate(): void {


        //Update physics.
    }

    initializeInputHandlers(): void {
        this.inputService.onMouseClick = (x, y) => {
            // Delegate to the State Object
            this.currentState.onClick(x, y, this.game, this.layoutSettings);

            // Demo: Play a ping animation where the user clicked
            this.animationService.play(new PingAnimation({x, y}));
        };

        this.inputService.onMouseMove = (x, y) => {
            // Delegate to the State Object
            this.currentState.onMouseMove(x, y, this.game, this.layoutSettings);
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