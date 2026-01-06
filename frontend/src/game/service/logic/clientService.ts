import type { GameState } from "@/game/model/types.ts";
import { PlayerService } from "@/game/service/logic/playerService.ts";

export class ClientService {
    // Static state to hold the local player's ID
    private static myPlayerId: string | null = null;

    public static setMyPlayerId(id: string) {
        this.myPlayerId = id;
    }

    public static getMyPlayerId(): string | null {
        return this.myPlayerId;
    }

    public static isMyTurn(gameState: GameState): boolean {
        const myId = this.getMyPlayerId();
        if (!myId) return false;
        
        const activePlayer = PlayerService.getActivePlayer(gameState);
        return activePlayer?.id === myId;
    }
}