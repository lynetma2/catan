import type {Player} from '../types/Player';

export class SharedState {
    players: Map<string, Player> = new Map();
    localPlayerId: string | null = null;
    currentPlayerId: string | null = null;

    constructor() {
        this.localPlayerId = "player-1";
        this.currentPlayerId = "player-1";
    }

    get localPlayer(): Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null;
    }

    get isLocalPlayersTurn(): boolean {
        return this.localPlayerId !== null
        && this.currentPlayerId === this.localPlayerId;
    }
}