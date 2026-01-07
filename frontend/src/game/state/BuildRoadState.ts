import type { GameStateHandler } from "./GameStateHandler";
import type {Edge, GameState, LayoutSettings, Road} from "@/game/model/types.ts";
import {MoveType} from "@/game/model/enums.ts";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";
import {RoadRender} from "@/game/service/renderers/roadRender.ts";
import {BoardService} from "@/game/service/logic/boardService.ts";

export class BuildRoadState implements GameStateHandler {
    
    onEnter(game: GameState, layoutSettings: LayoutSettings): void {
        // If we have a mouse position, immediately calculate ghost so it appears instantly
        if (game.inputState.mousePosition) {
            this.updatePotentialMove(game.inputState.mousePosition.x, game.inputState.mousePosition.y, game, layoutSettings);
        }
    }

    onClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const move = game.inputState.potentialMove;
        if (move && move.isValid && move.moveType === MoveType.Road) {
            // Perform the build action
            // BoardService.putRoad(game.board, { edge: move.location as Edge, playerName: "Player 1" });
            // game.inputState.potentialMove = undefined;
            console.log("Road Built!");
        }
    }

    onMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        this.updatePotentialMove(x, y, game, layoutSettings);
    }

    private updatePotentialMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings) {
        game.inputState.mousePosition = {x, y};
        
        // Snap to nearest edge
        const nearestEdge = HexLayoutService.getNearestEdge(layoutSettings, {x, y});
        const isValid = !BoardService.hasRoad(game.board, nearestEdge); // Basic validation

        game.inputState.potentialMove = {
            moveType: MoveType.Road,
            location: nearestEdge,
            isValid: isValid
        };
    }

    onExit(game: GameState): void {
        game.inputState.potentialMove = undefined;
    }

    draw(ctx: CanvasRenderingContext2D, game: GameState, layoutSettings: LayoutSettings): void {
        const move = game.inputState.potentialMove;
        if (move && move.moveType === MoveType.Road && move.location) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            // Color could be green if valid, red if invalid
            const ghostRoad: Road = { 
                edge: move.location as Edge, 
                playerName: "Player 1" // Should come from ClientState
            };
            RoadRender.draw(ctx, layoutSettings, ghostRoad);
            ctx.restore();
        }
    }
}