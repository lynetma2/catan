import type {
    Board,
    Building,
    GameState,
    LayoutSettings,
    Road,
    Tile,
    Edge,
    Button,
    HUDEntities
} from "@/game/model/types.ts";
import {MoveType} from "@/game/model/enums.ts";
import {TileRender} from "@/game/service/renderers/tileRender.ts";
import {RoadRender} from "@/game/service/renderers/roadRender.ts";
import {BuildingRender} from "@/game/service/renderers/buildingRender.ts";
import {ButtonRender} from "@/game/service/renderers/buttonRender.ts";


export class RenderService {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    private drawBoard(layoutSettings: LayoutSettings, board: Board) {
        this.drawTiles(layoutSettings, board.tiles);
        this.drawRoads(layoutSettings, board.roads);
        this.drawBuildings(layoutSettings, board.buildings);
    }

    private drawTiles(layoutSettings: LayoutSettings, tiles: Map<string, Tile>) {
        tiles.forEach(tile => {
            TileRender.draw(this.context, layoutSettings, tile);
        })
    }

    private drawRoads(layoutSettings: LayoutSettings, roads: Map<string, Road>) {
        roads.forEach(road => {
            RoadRender.draw(this.context, layoutSettings, road);
        })
    }

    private drawBuildings(layoutSettings: LayoutSettings, buildings: Map<string, Building>) {
        buildings.forEach(building => {
            BuildingRender.draw(this.context, layoutSettings, building);
        })
    }

    private drawPotentialMove(layoutSettings: LayoutSettings, game: GameState) {
        const move = game.inputState.potentialMove;
        if (!move) return;

        this.context.save();

        // "Pulse" Animation Effect:
        // Oscillates alpha between 0.3 and 0.7 over time
        const time = performance.now() / 500; 
        const alpha = 0.5 + Math.sin(time) * 0.2;
        this.context.globalAlpha = alpha;

        if (move.moveType === MoveType.Road) {
            // Reuse the existing RoadRender logic
            // We create a temporary "Ghost Road" object
            const ghostRoad: Road = { edge: move.location as Edge, playerName: "Player 1" };
            RoadRender.draw(this.context, layoutSettings, ghostRoad);
        }

        this.context.restore();
    }

    // private drawDices(dices: [number]) {
    //
    // }

    // private drawBankCards(cards: [number]) {
    //
    // }

    // private drawPlayers(players: Map<string, Player>) {
    //
    // }

    private drawButtons(buttons: Button[]) {
        buttons.forEach(button => {
            ButtonRender.draw(this.context, button);
        });
    }

    draw(layoutSettings: LayoutSettings, game: GameState, hudEntities: HUDEntities) {
        //Clearing last frame.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw board
        this.drawBoard(layoutSettings, game.board);

        //Draw Ghost / Hover Effects
        this.drawPotentialMove(layoutSettings, game);

        //Draw buttons.
        this.drawButtons(hudEntities.buttons);

        //Draw Players
        //this.drawPlayers(game.players);

        //Draw the bank
        //drawBankCards(this.canvas, this.resources, this.developmentCards, 800, currentY);

        //Draw the dices
        //drawDices(this.canvas, this.dices, 670, 830);

        //Add animations if needed.
    }
}