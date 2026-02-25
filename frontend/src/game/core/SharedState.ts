import {GamePhase, PieceType, type Player, type Resource} from "@/game/core/types.ts";


export class SharedState {
    // ─── Readonly from outside ────────────────────────────────────────
    // Private backing fields — only mutated through methods below

    private _localPlayerId:   string | null  = null;
    private _currentPlayerId: string | null  = null;
    private _currentPhase:    GamePhase | null = null;
    private _buildMode:       PieceType | null = null;
    private _players:         Map<string, Player> = new Map();
    private _mustDiscard: boolean;
    private _discardCount: number;

    // ─── Getters ──────────────────────────────────────────────────────

    get localPlayerId():   string | null       { return this._localPlayerId; }
    get currentPlayerId(): string | null       { return this._currentPlayerId; }
    get currentPhase():    GamePhase | null    { return this._currentPhase; }
    get buildMode():       PieceType | null    { return this._buildMode; }
    get players():         ReadonlyMap<string, Player> { return this._players; }
    get mustDiscard(): boolean { return this._mustDiscard; }
    get discardCount(): number { return this._discardCount; }
    
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

    setMustDiscard(amount: number) {
        this._mustDiscard = true;
        this._discardCount = amount;
    }

    clearMustDiscard() {
        this._mustDiscard  = false;
        this._discardCount = 0;
    }

    // Queries

    isPlayersTurn(playerId: string): boolean {
        return this._currentPlayerId === playerId;
    }

    get isBuildingPhase(): boolean {
        return this._currentPhase === GamePhase.PostRoll;
    }

    get isSetupPhase(): boolean {
        return this._currentPhase === GamePhase.SetupPlaceSettlement
            || this._currentPhase === GamePhase.SetupPlaceRoad;
    }

    get canRollDice(): boolean {
        return this._currentPhase === GamePhase.PreRoll;
    }

    get mustPlaceRobber(): boolean {
        return this._currentPhase === GamePhase.RobberPlacement;
    }

    get mustSteal(): boolean {
        return this._currentPhase === GamePhase.RobberSteal;
    }

    get canInitiateTrade(): boolean {
        return this._currentPhase === GamePhase.PostRoll;
    }

    get isGameOver(): boolean {
        return this._currentPhase === GamePhase.End;
    }
}