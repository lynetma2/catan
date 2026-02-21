import type {Player} from '../types/Player';

export class SharedState {
    players: Map<string, Player> = new Map();
    localPlayerId: string | null = null;

    get localPlayer(): Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null;
    }
}