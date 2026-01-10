import type { GameState } from "@/game/model/types.ts";
import { PlayerService } from "@/game/logic/PlayerService.ts";

export class ColorService {

    /**
     * Returns the color of the player whose turn it currently is.
     * Useful for coloring the screen background or UI borders.
     */
    public static getActivePlayerColor(gameState: GameState): string {
        const activePlayer = PlayerService.getActivePlayer(gameState);
        return activePlayer?.color ?? "#FFFFFF"; 
    }

    public static getEntityColor(gameState: GameState, ownerId: string): string {
        return PlayerService.getPlayerColor(gameState, ownerId);
    }
}