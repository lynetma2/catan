import {Board} from "./Board.ts";
import {Player} from "./Player.ts";
import {GameEvent} from "../GameEvent.ts";
import type {Layout} from "@/game/hexagon/Layout.ts";
import type {IMessage} from "@stomp/stompjs";
import {ActionButton} from "@/game/entity/ActionButtons.ts";
import {drawBankCards, drawDices} from "@/game/entity/VisualUtilities.ts";
import {Terrain} from "@/game/entity/Terrain.ts";

export class Game {
    public board: Board;
    public players: Player[];
    public dices: number[];
    public events: GameEvent[];
    public resources: number[];
    public developmentCards: number;
    public localPlayer: string;
    public currentPlayer: string;
    private actionButttons: ActionButton[];
    private canvas: HTMLCanvasElement;
    private layout: Layout;
    private housePlacingMode: boolean;
    private roadPlacingMode: boolean;
    private cityPlacingMode: boolean;

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
        this.housePlacingMode = false;
        this.roadPlacingMode = false;
        this.cityPlacingMode = false;

        //For know test buttons are used.
        this.actionButttons = ActionButton.testButtons(canvas);
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

        return new Game(board, players, events, dices, resources, canvas, layout, localPlayer);
    }

    public draw() {
        //TODO clear
        this.clearCanvas(this.canvas);

        //Draw board
        this.board.draw(this.canvas, this.layout);
        if (this.housePlacingMode) {
            //TODO fix these
            this.board.drawLegalHouses(true, "player1", this.canvas, this.layout);
        } else if (this.roadPlacingMode) {
            //TODO fix this
            this.board.drawLegalRoads(false, "Dennis", this.canvas, this.layout, this.board.buildings.get("q1r1s-2dEAST"));
        }

        //Draw buttons.
        this.actionButttons.forEach(button => {
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

    public addEventListeners() {
        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            const mousePos = this.getMousePos(this.canvas, event);
            //Adding the action button hover and click events.
            this.actionButttons.forEach(action => {
                action.addHoverAnimation(mousePos);

            });
        });

        this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
            const mousePos = this.getMousePos(this.canvas, event);
            console.log("mouseUp event", mousePos);

            this.actionButttons.forEach(action => {
                action.clickHandler(mousePos, (kind) => {
                    console.log("action button clicked!: ", kind);
                    //TODO implement this.
                    switch (kind) {
                        case GameEvent.PUTSETTLEMENT:
                            //Draw the options.
                            this.housePlacingMode = !this.housePlacingMode;
                            this.draw();
                            break;
                        case GameEvent.PUTROAD:
                            this.roadPlacingMode = !this.roadPlacingMode;
                            this.draw();
                            break;
                        case GameEvent.PUTCITY:
                            this.cityPlacingMode = !this.cityPlacingMode;
                            this.draw();
                            break;
                        default:
                            this.housePlacingMode = false;
                            this.roadPlacingMode = false;
                            this.cityPlacingMode = false;
                            this.draw()
                            break;
                    }
                });
            });
        })
    }

    private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    private clearCanvas(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't get ctx to clear the canvas");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

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