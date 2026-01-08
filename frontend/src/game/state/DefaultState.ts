import type { GameStateHandler } from "./GameState";
import type {Board, Building, GameState, InputState, LayoutSettings, Player, Road, Tile} from "@/game/model/types.ts";


export class BuildRoadState implements GameStateHandler {
    onEnter(game: GameState): void {
        console.log("Entering BuildRoadState");
        // Any specific setup when entering this state
    }

    onClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Handle click for building a road
        console.log(`BuildRoadState: Clicked at ${x}, ${y}`);
        // Logic to attempt placing a road at the potentialMove location
        // If successful, transition to another state (e.g., MainGameState or next player's turn)
        // If not, provide feedback and remain in this state
    }

    onMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Update potential road placement on mouse move
        console.log(`BuildRoadState: Clicked at ${x}, ${y}`);
    }

    onExit(game: GameState): void {
        console.log("Exiting BuildRoadState");
        // Clean up any state-specific elements
        game.inputState.potentialMove = undefined; // Clear potential move
    }

    draw(ctx: CanvasRenderingContext2D, game: GameState, layoutSettings: LayoutSettings): void {
        console.log("Drawing BuildRoadState");

        //Draw HUD.
    }
}