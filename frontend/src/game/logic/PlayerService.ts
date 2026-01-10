import type { GameState, Player } from "@/game/model/types.ts";

export class PlayerService {
    
    public static getPlayer(gameState: GameState, playerId: string): Player | undefined {
        return gameState.players.find(p => p.playerName === playerId);
    }

    public static getActivePlayer(gameState: GameState): Player | undefined {
        return gameState.players.find(p => p.isActive);
    }

    public static getPlayerColor(gameState: GameState, playerId: string): string {
        const player = this.getPlayer(gameState, playerId);
        return player?.color ?? "#000000";
    }
}