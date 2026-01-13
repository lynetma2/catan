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
    HandCard,
    PlayerOverviewPanel, GhostEffect
} from "@/game/model/types.ts";
import {BuildingType, MoveType} from "@/game/model/enums.ts";
import {TileRender} from "@/game/rendering/tileRender.ts";
import {RoadRender} from "@/game/rendering/roadRender.ts";
import {BuildingRender} from "@/game/rendering/buildingRender.ts";
import {ButtonRender} from "@/game/rendering/buttonRender.ts";
import type {GameStateHandler} from "@/game/state/GameStateHandler.ts";
import {CardRender} from "@/game/rendering/cardRender.ts";
import {PlayerOverviewRender} from "@/game/rendering/playerOverviewRender.ts";
import {DiceRender} from "@/game/rendering/DiceRender.ts";
import {HUDLayoutService} from "@/game/layout/HUDLayoutService.ts";


export class RenderService {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    private drawBoard(layoutSettings: LayoutSettings, game: GameState) {
        this.drawTiles(layoutSettings, game.board.tiles);
        this.drawRoads(layoutSettings, game);
        this.drawBuildings(layoutSettings, game);
    }

    private drawTiles(layoutSettings: LayoutSettings, tiles: Map<string, Tile>) {
        tiles.forEach(tile => {
            TileRender.draw(this.context, layoutSettings, tile);
        })
    }

    private drawRoads(layoutSettings: LayoutSettings, game: GameState) {
        game.board.roads.forEach(road => {
            RoadRender.draw(this.context, layoutSettings, road, game);
        })
    }

    private drawBuildings(layoutSettings: LayoutSettings, game: GameState) {
        game.board.buildings.forEach(building => {
            BuildingRender.draw(this.context, layoutSettings, building, game);
        })
    }

    private drawDices(dices: number[]) {
        const layouts = HUDLayoutService.getDiceLayout(this.canvas.width, this.canvas.height);
        if (layouts.length >= 2 && dices.length >= 2) {
            DiceRender.draw(this.context, layouts[0].x, layouts[0].y, layouts[0].width, dices[0]);
            DiceRender.draw(this.context, layouts[1].x, layouts[1].y, layouts[1].width, dices[1]);
        }
    }

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
        // Draw non-hovered cards first
        cards.forEach(card => {
            if (!card.isHovered) {
                CardRender.draw(this.context, card);
            }
        });
        // Draw hovered cards on top
        cards.forEach(card => {
            if (card.isHovered) {
                CardRender.draw(this.context, card);
            }
        });
    }

    public drawPlayerPanels(panels: PlayerOverviewPanel[]) {
        panels.forEach(panel => {
            PlayerOverviewRender.draw(this.context, panel);
        });
    }

    private drawGhosts(layoutSettings: LayoutSettings, ghosts: GhostEffect[] | undefined) {
        if (!ghosts) return;
        ghosts.forEach(ghost => {
            ghost.draw(this.context, layoutSettings);
        });
    }

    private drawHUD(hudEntities: HUDEntities | undefined) {
        if (!hudEntities) return;
        this.drawCards(hudEntities.cards);
        this.drawPlayerPanels(hudEntities.playerPanels);
        this.drawButtons(hudEntities.buttons);
    }

    draw(layoutSettings: LayoutSettings, game: GameState, state: GameStateHandler) {
        //Clearing last frame.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw board
        this.drawBoard(layoutSettings, game);

        //Draw Ghosts (Data-Driven)
        //this.drawGhost(layoutSettings, game.inputState);

        //Draw HUD (Data-Driven from State)
        this.drawHUD(state.getHUDEntities());

        //Draw Players
        //this.drawPlayers(game.players);

        //Draw the bank
        //drawBankCards(this.canvas, this.resources, this.developmentCards, 800, currentY);

        //Draw the dices
        this.drawDices(game.dices);

        this.drawGhosts(layoutSettings, state.getGhostEffects());

        //Add animations if needed.
    }
}