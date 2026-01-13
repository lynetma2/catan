import type {ClientState, GameState} from "@/game/model/types.ts";
import type {PlayerStyle} from "@/game/theme/playerStyles.ts";

export class PlayerService {
    // Centralized palette for player styles.
    private static readonly STYLES: PlayerStyle[] = [
        { fillColor: "#ef5350", strokeColor: "#ef5350" }, // Red
        { fillColor: "#42a5f5", strokeColor: "#42a5f5" }, // Blue
        { fillColor: "#ffa726", strokeColor: "#ffa726" }, // Orange
        { fillColor: "#fcfcfc", strokeColor: "#fcfcfc" }, // White
        { fillColor: "#ab47bc", strokeColor: "#ab47bc" }, // Purple
        { fillColor: "#26a69a", strokeColor: "#26a69a" }, // Teal
    ];

    /**
     * Returns the ID of the player currently considered "Local".
     * - In Multiplayer: The static ID of the logged-in user.
     * - In Hotseat: The ID of the currently active player (since they hold the device).
     */
    public static getCurrentLocalPlayerId(game: GameState, clientState: ClientState, isHotseat: boolean): string {
        if (isHotseat) {
            return game.players.find(p => p.isActive)?.playerName ?? clientState.localPlayerId;
        }
        return clientState.localPlayerId;
    }

    /**
     * Updates the 'isLocal' flag on all players in the GameState.
     * This is crucial for the UI to know which hand to show, which buttons to enable, etc.
     */
    public static syncLocalPlayerIdentity(game: GameState, clientState: ClientState, isHotseat: boolean): void {
        const currentId = this.getCurrentLocalPlayerId(game, clientState, isHotseat);
        game.players.forEach(p => {
            p.isLocal = p.playerName === currentId;
        });
    }

    public static getStyle(index: number): PlayerStyle {
        return this.STYLES[index % this.STYLES.length];
    }

    public static getPlayerStyle(game: GameState, playerId: string) {
        const player = this.getPlayer(game, playerId);
        return player ? player.style : this.STYLES[0];
    }

    public static getPlayer(game: GameState, playerId: string) {
        return game.players.find(p => p.playerName === playerId);
    }
}