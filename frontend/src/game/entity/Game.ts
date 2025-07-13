import type {Board} from "./Board.ts";
import type {Player} from "./Player.ts";
import type {GameEvent} from "../GameEvent.ts";

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

    public static fromResponse(response: Response): Game {
        const body = response.json();
        console.log("body");
        console.log(body);
        return;
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