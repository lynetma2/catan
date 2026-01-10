import type {
    Board,
    Building,
    GameState,
    LayoutSettings,
    Road,
    Tile,
    Edge,
    Button,
    HUDEntities,
    Vertex,
    InputState,
    HandCard
} from "@/game/model/types.ts";
import {BuildingType, MoveType} from "@/game/model/enums.ts";
import {TileRender} from "@/game/service/renderers/tileRender.ts";
import {RoadRender} from "@/game/service/renderers/roadRender.ts";
import {BuildingRender} from "@/game/service/renderers/buildingRender.ts";
import {ButtonRender} from "@/game/service/renderers/buttonRender.ts";
import type {GameStateHandler} from "@/game/state/GameStateHandler.ts";
import {CardRender} from "@/game/service/renderers/cardRender.ts";


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

    public drawButtons(buttons: Button[]) {
        buttons.forEach(button => {
            ButtonRender.draw(this.context, button);
        });
    }

    public drawCards(cards: HandCard[]) {
        cards.forEach(card => {
            CardRender.draw(this.context, card);
        });
    }

    private drawGhost(layoutSettings: LayoutSettings, inputState: InputState) {
        const move = inputState.potentialMove;
        if (!move || !move.isValid) return; // Optional: Draw invalid moves in red

        this.context.save();
        this.context.globalAlpha = 0.6; // Ghost transparency

        if (move.moveType === MoveType.Road) {
            const road: Road = {
                edge: move.location as Edge,
                playerName: "Player 1" // TODO: Use ClientState to get local player color
            };
            RoadRender.draw(this.context, layoutSettings, road);
        } 
        // Add other ghost types here (Settlement, City) as needed
        // else if (move.moveType === MoveType.Settlement) { ... }

        this.context.restore();
    }

    private drawHUD(hudEntities: HUDEntities | undefined) {
        if (!hudEntities) return;
        this.drawCards(hudEntities.cards);
        this.drawButtons(hudEntities.buttons);
    }

    draw(layoutSettings: LayoutSettings, game: GameState, state: GameStateHandler) {
        //Clearing last frame.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw board
        this.drawBoard(layoutSettings, game.board);

        //Draw Ghosts (Data-Driven)
        //this.drawGhost(layoutSettings, game.inputState);

        //Draw HUD (Data-Driven from State)
        this.drawHUD(state.getHUDEntities());

        //Draw Players
        //this.drawPlayers(game.players);

        //Draw the bank
        //drawBankCards(this.canvas, this.resources, this.developmentCards, 800, currentY);

        //Draw the dices
        //drawDices(this.canvas, this.dices, 670, 830);

        //Add animations if needed.
    }
}