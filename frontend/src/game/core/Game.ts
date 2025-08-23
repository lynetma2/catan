import {Board} from "../entity/Board.ts";
import {Player} from "../entity/Player.ts";
import {GameEvent} from "../GameEvent.ts";
import type {Layout} from "@/game/hexagon/Layout.ts";
import type {IMessage} from "@stomp/stompjs";
import {drawBankCards, drawDices} from "@/game/entity/VisualUtilities.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {GameEvents, Middleware} from "@/game/core/types.ts";
import type {Button} from "@/game/core/Buttons/ButtonType.ts";
import {PutRoadButton} from "@/game/core/Buttons/PutRoadButton.ts";
import {PutHouseButton} from "@/game/core/Buttons/PutHouseButton.ts";
import {PutCityButton} from "@/game/core/Buttons/PutCityButton.ts";
import {DrawDevelopmentCardButton} from "@/game/core/Buttons/DrawDevelopmentCardButton.ts";
import {EndTurnButton} from "@/game/core/Buttons/EndTurnButton.ts";
import {InteractionManager} from "@/game/input/InteractionManager.ts";
import {GameController} from "@/game/core/GameController.ts";

export enum InputState {
    HousePlacingMode = "HousePlacingMode",
    RoadPlacingMode = "RoadPlacingMode",
    CityPlacingMode = "CityPlacingMode",
    RollDicesMode = "RollDicesMode",
    DefaultMode = "DefaultMode",
    NotMyTurnMode = "NotMyTurnMode",
}

export class Game {
    public board: Board;
    public players: Player[];
    public dices: number[];
    public events: GameEvent[];
    public resources: number[];
    public developmentCards: number;
    public localPlayer: string;
    public currentPlayer: string;
    public canvas: HTMLCanvasElement;
    public layout: Layout;
    public inputState: InputState;
    private eventBus: EventBus<GameEvents>;
    private buttons: Button[];
    private interactionManager: InteractionManager;

    constructor(board: Board, players: Player[], events: GameEvent[], dices: number[], resources: number[], canvas: HTMLCanvasElement, layout: Layout, localPlayer: string) {
        this.board = board;
        this.players = players;
        this.events = events;
        this.resources = resources;
        this.dices = dices;
        this.canvas = canvas;
        this.layout = layout;
        this.localPlayer = localPlayer;
        this.currentPlayer = "test";
        this.developmentCards = 25;

        //Internal state management
        this.inputState = InputState.DefaultMode;
        this.eventBus = new EventBus<GameEvents>();
        this.interactionManager = new InteractionManager(canvas);

        //For know test buttons are used.
        this.buttons = this.initializeButtons();

        //Make the eventbus work
        this.setupEventListeners();

        this.setupLoggingMiddleware();

        this.eventBus.publish('NotificationEvent', {title: "test Notification Event", stopPropagation: false, uid: "123456", timestamp: 0})
    }

    public static fromJSON(message: IMessage, layout: Layout, canvas: HTMLCanvasElement, localPlayer: string): Game {
        const json = JSON.parse(message.body);

        //Parsing the board:
        const board = Board.fromJSON(json.board);
        const dices = json.dices;

        const players = Object.entries(json.players).map(([key, value]) => {
            console.log("key", key);
            console.log("value", value);
            return Player.fromJSON(value);
        });
        const events = json.events;
        const resources = json.resources;

        return new Game(board, players, events, dices, resources, canvas, layout, localPlayer, new EventBus<GameEvents>());
    }

    public draw() {
        //TODO clear
        this.clearCanvas(this.canvas);

        //Draw board
        this.board.draw(this.canvas, this.layout);
        if (this.inputState == InputState.HousePlacingMode) {
            //TODO fix these
            this.board.drawLegalHouses(true, "player1", this.canvas, this.layout);
        } else if (this.inputState == InputState.RoadPlacingMode) {
            //TODO fix this
            this.board.drawLegalRoads(false, "Dennis", this.canvas, this.layout, this.board.buildings.get("q1r1s-2dEAST"));
        }

        //Draw buttons.
        this.buttons.forEach(button => {
            button.draw();
        })

        //Draw Players stats
        let currentY = 800;
        this.players.forEach((player) => {
            player.drawPlayerStats(this.canvas, currentY);
            currentY = currentY - 100;
            if (player.name == this.localPlayer) {
                //Draw current player inventory
                player.draw(this.canvas);
            }
        });

        //Draw the bank
        drawBankCards(this.canvas, this.resources, this.developmentCards, 800, currentY);

        //Draw the dices
        drawDices(this.canvas, this.dices, 670, 830);
    }

    private createButton(
        ButtonClass: new (bounds: any, canvas: any, color: string, id: string, manager: InteractionManager, ...args: any[]) => Button,
        bounds: any,
        id: string,
        ...extraArgs: any[]
    ): Button {
        return new ButtonClass(bounds, this.canvas, "green", id, this.interactionManager, ...extraArgs);
    }

    private initializeButtons(): Button[] {
        const margin = 5;
        const startX = 500;
        const startY = 900;
        const buttonSize = { width: 80, height: 80 };

        const buttonTypes: [any, any[]?][] = [
            [PutRoadButton],
            [PutHouseButton],
            [PutCityButton],
            [DrawDevelopmentCardButton],
            [EndTurnButton, [false]], // extra arg
        ];

        return buttonTypes.map(([ButtonClass, extraArgs = []], i) => {
            const bounds = {
                x: startX + i * (buttonSize.width + margin),
                y: startY,
                ...buttonSize,
            };
            return this.createButton(ButtonClass, bounds, i.toString(), this.eventBus, ...extraArgs);
        });
    }

    private clearCanvas(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't get ctx to clear the canvas");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    private setupEventListeners(): void {
        this.eventBus.on('PressedButtonEvent',(event) => GameController.handlePressedButtonEvent(event, this))
    }

    private setupLoggingMiddleware() {
        this.eventBus.use(this.loggingMiddleware);
    }

    private loggingMiddleware: Middleware<GameEvents, keyof GameEvents> = (eventName, payload, next) => {
        // payload's type is a union of all possible event payloads, so you can only access
        // properties that exist on ALL of them (e.g., 'uid').
        console.log(`[Middleware] Event '${String(eventName)}' (ID: ${payload.uid}) triggered.`);
        next(eventName, payload);
    };

    //TODO insert event handlers.
    //TODO make the state able to consider incremental state upgrades.

    //Events
    //Construction based
    //Put Settlement
    //Put city
    //Put Road
    //Move Robber

    //Card based
    //
}