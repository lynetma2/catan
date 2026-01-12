import type {ClientState, GameState} from "@/game/model/types.ts";
import type {PlayerStyle} from "@/game/theme/playerStyles.ts";

export class PlayerService {
    // Centralized palette for player styles.
    private static readonly STYLES: PlayerStyle[] = [
        { fillColor: "#ef5350", strokeColor: "#b71c1c" }, // Red
        { fillColor: "#42a5f5", strokeColor: "#0d47a1" }, // Blue
        { fillColor: "#ffa726", strokeColor: "#e65100" }, // Orange
        { fillColor: "#fcfcfc", strokeColor: "#9e9e9e" }, // White
        { fillColor: "#ab47bc", strokeColor: "#4a148c" }, // Purple
        { fillColor: "#26a69a", strokeColor: "#004d40" }, // Teal
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

    public static getPlayer(game: GameState, playerId: string) {
        return game.players.find(p => p.playerName === playerId);
    }
}