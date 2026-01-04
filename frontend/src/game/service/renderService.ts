import type {Board, Building, GameState, LayoutSettings, Road, Tile} from "@/game/model/types.ts";
import {TileRender} from "@/game/service/renderers/tileRender.ts";
import {RoadRender} from "@/game/service/renderers/roadRender.ts";
import {BuildingRender} from "@/game/service/renderers/buildingRender.ts";


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

    // private drawDices(dices: [number]) {
    //
    // }

    // private drawBankCards(cards: [number]) {
    //
    // }

    // private drawPlayers(players: Map<string, Player>) {
    //
    // }

    // private drawButtons(buttons: [ActionButton]) {
    //
    // }

    draw(layoutSettings: LayoutSettings, game: GameState) {
        //Clearing last frame.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw board
        this.drawBoard(layoutSettings, game.board);

        //Draw buttons.
        //this.drawButtons(game.buttons);

        //Draw Players
        //this.drawPlayers(game.players);

        //Draw the bank
        //drawBankCards(this.canvas, this.resources, this.developmentCards, 800, currentY);

        //Draw the dices
        //drawDices(this.canvas, this.dices, 670, 830);

        //Add animations if needed.
    }
}