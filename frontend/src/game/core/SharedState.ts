import {
    GamePhase,
    type GameSnapshot,
    PieceType,
    type Player,
    type Resource,
    type TileSnapshot
} from "@/game/core/types.ts";
import {DEV_CARD_COST, PIECE_COSTS, type ResourceCost} from "@/game/world/systems/build/BuildRules.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";


export class SharedState {
    // ─── Readonly from outside ────────────────────────────────────────
    // Private backing fields — only mutated through methods below

    private _localPlayerId: string | null = null;
    private _currentPlayerId: string | null = null;
    private _currentPhase: GamePhase | null = null;
    private _buildMode: PieceType | null = null;
    private _players: Map<string, Player> = new Map();
    private _mustDiscard: boolean = false; //TODO create better abstraction for this.
    private _discardCount: number = 0; //Todo create better abstraction for this.
    private _stealCandidateIds: string[] = [];
    private _robberHex: Hex | null = null;

    // core/SharedState.ts
    loadFromSnapshot(payload: GameSnapshot, localPlayerId: string) {
        this.setCurrentPhase(payload.currentPhase);
        this.setCurrentPlayer(payload.currentPlayerId);
        this.setPlayers(payload.players.map(p => ({
            id: p.id,
            name: p.name,
            color: p.color,
            resources: p.resources,
            victoryPoints: p.victoryPoints
        })));
        this.setMustDiscard(payload.discardSession.mustDiscard, payload.discardSession.discardAmount);
        const robbedHex = this.findRobbedHex(payload.tiles);
        if (robbedHex !== null) {
            this.setRobberHex(robbedHex);
        }

        const local = payload.players.find(p => p.id === localPlayerId);
        if (local) this.setLocalPlayer(local);
    }

    // ─── Getters ──────────────────────────────────────────────────────

    get localPlayerId(): string | null { return this._localPlayerId; }
    get currentPlayerId(): string | null { return this._currentPlayerId; }
    get currentPhase(): GamePhase | null { return this._currentPhase; }

    get buildMode(): PieceType | "robber" | null {
        if (this.mustPlaceRobber && this.isLocalPlayersTurn) {
            return "robber";
        }
        return this._buildMode;
    }
    get players(): ReadonlyMap<string, Player> { return this._players; }
    get mustDiscard(): boolean { return this._mustDiscard; }
    get discardCount(): number { return this._discardCount; }

    get localPlayer(): Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null;
    }

    get localPlayerResources(): Resource[] | null {
        if (!this.localPlayer) return null;
        return this.localPlayer.resources;
    }

    get isLocalPlayersTurn(): boolean {
        return this._localPlayerId !== null
            && this._localPlayerId === this._currentPlayerId;
    }

    get stealCandidateIds(): string[] {
        return this._stealCandidateIds;
    }

    get robberHex(): Hex | null {
        return this._robberHex;
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

    setMustDiscard(mustDiscard: boolean, amount: number) {
        this._mustDiscard = mustDiscard;
        this._discardCount = amount;
    }

    clearMustDiscard() {
        this._mustDiscard = false;
        this._discardCount = 0;
    }

    setStealCandidateIds(candidateIds: string[]) {
        this._stealCandidateIds = candidateIds;
    }

    clearStealCandidateIds() {
        this._stealCandidateIds = [];
    }

    setRobberHex(target: Hex) {
        this._robberHex = target;
    }

    // Queries

    isPlayersTurn(playerId: string): boolean {
        console.log("Trying to build settlement");
        console.log("player turn", this._currentPlayerId);
        console.log("player id", playerId);
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

    canAffordDevCard(): boolean {
        return this.meetsResourceCost(DEV_CARD_COST);
    }

    canAfford(pieceType: PieceType): boolean {
        if (pieceType === PieceType.Settlement &&
            this._currentPhase === GamePhase.SetupPlaceSettlement) {
            return true;
        } else if (pieceType === PieceType.Road &&
            this._currentPhase === GamePhase.SetupPlaceRoad) {
            return true;
        } else {
            return this.meetsResourceCost(PIECE_COSTS[pieceType]);
        }
    }

    private meetsResourceCost(cost: Partial<ResourceCost>): boolean {
        const resources = this.localPlayerResources ?? [];

        return (Object.keys(cost) as (keyof typeof cost)[])
            .every(type =>
                resources
                    .filter(r => r.resourceType === type)
                    .length >= (cost[type] ?? 0)
            );
    }

    private findRobbedHex(tiles: TileSnapshot[]): Hex | null {
        for (const tile of tiles) {
            if (tile.hasRobber) return tile.hex;
        }
        return null;
    }
}

//TODO refactor to use an object like this:
export interface GlobalState {
    localPlayer: {
        id: string;
        name: string;
        color: string;
        resources: Resource[];
        devCards: string;
        //ETC
    }
    turnState: {
        currentPlayerId: string;
        currentPhase: string;
        //TODO add something to handle the discard flow when needed.
        //TODO add something to handle the robber flow when needed.
    }
    opponents: { //Should be a list
        id: string;
        name: string;
        color: string;
        resourceCount: number;
        devCount: number;
        robbersUsed: number;
        //ETC
    }
}