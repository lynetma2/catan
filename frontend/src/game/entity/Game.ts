import {Board} from "./Board.ts";
import {Player} from "./Player.ts";
import type {GameEvent} from "../GameEvent.ts";
import type {Layout} from "@/game/hexagon/Layout.ts";
import type {IMessage} from "@stomp/stompjs";

export class Game {
    public board: Board;
    public players: Player[];
    public dices: number[];
    public events: GameEvent[];
    public resources: number[];

    constructor(board: Board, players: Player[], events: GameEvent[], dices: number[], resources: number[]) {
        this.board = board;
        this.players = players;
        this.events = events;
        this.resources = resources;
        this.dices = dices;
    }

    public static fromJSON(message: IMessage, layout: Layout, canvas: HTMLCanvasElement): Game {
        const json = JSON.parse(message.body);

        //Parsing the board:
        const board = Board.fromJSON(json.board, layout, canvas);
        const dices = json.dices;
        const players = json.players.map((player) => {
            return Player.fromJSON(player);
        });
        const events = json.events;
        const resources = json.resources;

        return new Game(board, players, events, dices, resources);
    }

    public initializeGameSocket() {

    }

    public stateHandler() {

    }

    public destroyGameSocket() {

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