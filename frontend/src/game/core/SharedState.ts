import {
    type BuildTarget,
    BuildTargetKind,
    type DevelopmentCardId,
    type FlowState,
    GamePhase,
    type GameSnapshot,
    PieceType,
    type Player,
    type Resource,
    type TileSnapshot
} from "@/game/core/types.ts";
import {buildRules, DEV_CARD_COST, PIECE_COSTS, type ResourceCost} from "@/game/world/systems/build/BuildRules.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import {Board} from "@/game/world/board/Board.ts";
import type {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";
import {DISCARD_RISK_THRESHOLD} from "@/game/core/GameConfigurationConstants.ts";


export class SharedState {
    // ─── Readonly from outside ────────────────────────────────────────
    // Private backing fields — only mutated through methods below
    private _localPlayerId: string | null = null;
    private _currentPlayerId: string | null = null;
    private _currentPhase: GamePhase | null = null;
    private _buildMode: PieceType | null = null;
    private readonly _players: Map<string, Player> = new Map();
    private _robberHex: Hex | null = null;
    private _activeFlowState: FlowState | null = null;
    readonly board: Board = new Board();

    // core/SharedState.ts
    loadFromSnapshot(payload: GameSnapshot, localPlayerId: string) {
        this.setCurrentPhase(payload.currentPhase);
        this.setCurrentPlayer(payload.currentPlayerId);
        this.setPlayers(payload.players);
        this.setActiveFlowState(payload.activeFlowState);
        this.board.hexGrid.loadTiles(payload.tiles);
        this.board.loadFromSnapshot(payload.placements);
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

    get activeFlowState(): FlowState | null {
        return this._activeFlowState;
    }

    get buildMode(): PieceType | "robber" | null {
        if (this.mustPlaceRobber && this.isLocalPlayersTurn) {
            return "robber";
        }
        return this._buildMode;
    }
    get players(): ReadonlyMap<string, Player> { return this._players; }

    get localPlayer(): Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null;
    }

    get localPlayerResources(): Resource[] | null {
        if (!this.localPlayer) return null;
        return this.localPlayer.resources;
    }

    get localPlayerDevCards(): DevelopmentCardId[] | null {
        if (!this.localPlayer) return null;
        return this.localPlayer.devCards;
    }

    get isLocalPlayersTurn(): boolean {
        return this._localPlayerId !== null
            && this._localPlayerId === this._currentPlayerId;
    }

    get robberHex(): Hex | null {
        return this._robberHex;
    }

    get mustDiscard(): boolean {
        if (this._activeFlowState?.type !== "discard") return false;
        if (!this._localPlayerId) return false;
        return this._activeFlowState.requiredDiscards[this._localPlayerId] !== undefined;
    }

    get discardCount(): number {
        if (this._activeFlowState?.type !== "discard") return 0;
        if (!this._localPlayerId) return 0;
        return this._activeFlowState.requiredDiscards[this._localPlayerId] ?? 0;
    }

    get stealCandidateIds(): string[] {
        return this._activeFlowState?.type === "steal" ? this._activeFlowState.candidates : [];
    }

    get retrievingPlayerId(): string | null {
        return this._activeFlowState?.type === "steal" ? this._activeFlowState.retrievingPlayerId : null;
    }

    get roadsPlaced(): number {
        return this._activeFlowState?.type === "roadBuilding" ? this._activeFlowState.roadsPlaced : 0;
    }

    get roadsRequired(): number {
        return this._activeFlowState?.type === "roadBuilding" ? this._activeFlowState.roadsRequired : 0;
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

    setActiveFlowState(state: FlowState | null) {
        this._activeFlowState = state;
    }

    updatePlayer(playerId: string, update: Partial<Player>) {
        const existing = this._players.get(playerId);
        if (existing) this._players.set(playerId, { ...existing, ...update });
    }

    setRobberHex(target: Hex) {
        this._robberHex = target;
        this.board.hexGrid.moveRobber(target);
    }

    placeSettlement(vertex: Vertex, playerId: string) {
        this.board.placementMap.placeSettlement(vertex, playerId);
    }

    placeCity(vertex: Vertex, playerId: string) {
        this.board.placementMap.placeCity(vertex, playerId);
    }

    placeRoad(edge: Edge, playerId: string) {
        this.board.placementMap.placeRoad(edge, playerId);
    }

    clearFlowState() {
        this._activeFlowState = null;
    }

    applyBankTrade(
        playerId: string,
        given: Resource[],
        received: Resource[],
    ) {
        const player = this._players.get(playerId);
        if (!player) return;

        const remainingResources = [...player.resources];
        // Remove given resources
        for (const resource of given) {
            const index = remainingResources.findIndex(
                r => r.uid === resource.uid,
            );
            if (index !== -1) {
                remainingResources.splice(index, 1);
            }
        }
        // Add received resources
        remainingResources.push(...received);
        this.updatePlayer(playerId, {
            resources: remainingResources,
        });
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

    canAffordDevCard(): boolean {
        return this.meetsResourceCost(DEV_CARD_COST);
    }

    canAfford(pieceType: PieceType): boolean {
        if (!this._localPlayerId) return false;
        return this.canPlayerAfford(this._localPlayerId, pieceType);
    }

    canPlayerAfford(playerId: string, pieceType: PieceType): boolean {
        if (pieceType === PieceType.Settlement &&
            this._currentPhase === GamePhase.SetupPlaceSettlement) {
            return true;
        } else if (pieceType === PieceType.Road &&
            this._currentPhase === GamePhase.SetupPlaceRoad) {
            return true;
        } else {
            const player = this._players.get(playerId);
            return this.meetsResourceCostForResources(player?.resources ?? [], PIECE_COSTS[pieceType]);
        }
    }

    validateBuild(pieceType: PieceType, target: BuildTarget, playerId: string): BuildRejectionReason | null {
        return buildRules.validate(pieceType, target, playerId, this);
    }

    canBuild(pieceType: PieceType, target: BuildTarget, playerId: string): boolean {
        return this.validateBuild(pieceType, target, playerId) === null;
    }

    getValidTargets(pieceType: PieceType | "robber", playerId: string): BuildTarget[] {
        if (pieceType === "robber") {
            return this.board.getValidRobberHexes().map(hex => ({ kind: BuildTargetKind.Hex, hex }));
        }
        switch (pieceType) {
            case PieceType.Settlement:
            case PieceType.City:
                return this.board.hexGrid.getAllVertices()
                    .filter(v => buildRules.validate(pieceType, { kind: BuildTargetKind.Vertex, vertex: v }, playerId, this) === null)
                    .map(v => ({ kind: BuildTargetKind.Vertex, vertex: v }));

            case PieceType.Road:
                return this.board.hexGrid.getAllEdges()
                    .filter(e => buildRules.validateRoad({ kind: BuildTargetKind.Edge, edge: e }, playerId, this) === null)
                    .map(e => ({ kind: BuildTargetKind.Edge, edge: e }));
        }
        return [];
    }

    get isAtDiscardRisk(): boolean {
        return (this.localPlayerResources?.length ?? 0) > DISCARD_RISK_THRESHOLD;
    }

    private meetsResourceCost(cost: Partial<ResourceCost>): boolean {
        return this.meetsResourceCostForResources(this.localPlayerResources ?? [], cost);
    }

    addRequiredDiscard(playerId: string, amount: number) {
        const current = this._activeFlowState?.type === "discard" ? this._activeFlowState.requiredDiscards : {};
        this._activeFlowState = {type: "discard", requiredDiscards: {...current, [playerId]: amount}};
    }

    markDiscardComplete(playerId: string) {
        if (this._activeFlowState?.type !== "discard") return;
        const {[playerId]: _, ...rest} = this._activeFlowState.requiredDiscards;
        this._activeFlowState = Object.keys(rest).length > 0 ? {type: "discard", requiredDiscards: rest} : null;
    }

    get pendingDiscardPlayerIds(): string[] {
        return this._activeFlowState?.type === "discard" ? Object.keys(this._activeFlowState.requiredDiscards) : [];
    }

    private meetsResourceCostForResources(resources: Resource[], cost: Partial<ResourceCost>): boolean {
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