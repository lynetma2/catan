import {type GamePhase, PieceType, type Player, type Resource} from "@/game/core/types.ts";


export class SharedState {
    // ─── Readonly from outside ────────────────────────────────────────
    // Private backing fields — only mutated through methods below

    private _localPlayerId:   string | null  = null;
    private _currentPlayerId: string | null  = null;
    private _currentPhase:    GamePhase | null = null;
    private _buildMode:       PieceType | null = null;
    private _players:         Map<string, Player> = new Map();

    // ─── Getters ──────────────────────────────────────────────────────

    get localPlayerId():   string | null       { return this._localPlayerId; }
    get currentPlayerId(): string | null       { return this._currentPlayerId; }
    get currentPhase():    GamePhase | null    { return this._currentPhase; }
    get buildMode():       PieceType | null    { return this._buildMode; }
    get players():         ReadonlyMap<string, Player> { return this._players; }
    
    get localPlayer():     Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null; }
    
    get localPlayerResources(): Resource[] | null {
        if (!this.localPlayer) return null;
        return this.localPlayer.resources;
    }
    
    get isLocalPlayersTurn(): boolean {
        return this._localPlayerId !== null
            && this._localPlayerId === this._currentPlayerId;
    }

    // ─── Mutations — explicit, named, intentional ─────────────────────

    setLocalPlayerId(id: string) {
        this._localPlayerId = id;
    }

    setCurrentPlayer(playerId: string) {
        this._currentPlayerId = playerId;
    }

    setCurrentPhase(phase: GamePhase) {
        this._currentPhase = phase;
    }

    setBuildMode(mode: PieceType | null) {
        this._buildMode = mode;
    }

    setLocalPlayer(player: Player) {
        if (!this._localPlayerId) return;
        this._players.set(this._localPlayerId, player);
    }

    updateLocalPlayerResources(resources: Resource[]) {
        if (!this._localPlayerId) return;
        this.updatePlayer(this._localPlayerId, { resources });
    }

    setPlayers(players: Player[]) {
        this._players.clear();
        players.forEach(p => this._players.set(p.id, p));
    }

    updatePlayer(playerId: string, update: Partial<Player>) {
        const existing = this._players.get(playerId);
        if (existing) this._players.set(playerId, { ...existing, ...update });
    }
}