import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {TradeOfferPanelData} from "@/game/hud/panels/tradeOffer/types.ts";

export interface Player {
    id: string;
    name: string;
    color: string;
    resources: Resource[];
    victoryPoints: number;
}

export enum ResourceType {
    Lumber = "lumber",
    Brick = "brick",
    Wool = "wool",
    Grain = "grain",
    Ore = "ore"
}

export interface Resource {
    resourceType: ResourceType,
    uid: string
}

export enum PieceType {
    Road = "road",
    Settlement = "settlement",
    City = "city"
}

export enum BuildTargetKind {
    Vertex = 'vertex',
    Edge = 'edge',
    Hex = 'hex',
}

export type BuildTarget =
    | { kind: BuildTargetKind.Vertex; vertex: Vertex }
    | { kind: BuildTargetKind.Edge; edge: Edge }
    | { kind: BuildTargetKind.Hex; hex: Hex };

export interface PlacedPiece {
    playerId: string;
    pieceType: PieceType;
}

export interface PlacementState {
    vertices: { vertex: Vertex; piece: PlacedPiece }[];
    edges: { edge: Edge; piece: PlacedPiece }[];
}

export enum TileType {
    Forest = 'forest',
    Hills = 'hills',
    Pasture = 'pasture',
    Fields = 'fields',
    Mountains = 'mountains',
    Desert = 'desert',
    Sea = 'sea',
}

// 1. Let's make an enum for 'kind' to stay consistent!
export enum TileKind {
    Land = 'land',
    Desert = 'desert',
    Sea = 'sea',
}

export type LandTileType = Exclude<TileType, TileType.Desert | TileType.Sea>;

export type PortResource = ResourceType | 'any';

interface BaseTile {
    hex: Hex;
    hasRobber: boolean;
}

export interface LandTile extends BaseTile {
    kind: TileKind.Land;
    type: LandTileType;
    number: number;
}

export interface DesertTile extends BaseTile {
    kind: TileKind.Desert;
    type: TileType.Desert;
}

export interface SeaTile extends BaseTile {
    kind: TileKind.Sea;
    type: TileType.Sea;
    isPort: boolean;
    portType: PortResource | null; // Prevents accidental 'desert' or 'sea' ports!
    portFacing: number | null;
}

export type Tile = LandTile | DesertTile | SeaTile;

export interface HexGridState {
    tiles: Tile[];
}

export interface TileSnapshot {
    hex: Hex;
    kind: TileKind;
    type: TileType;
    number: number | null;
    hasRobber: boolean;
    isPort: boolean;
    portType: PortResource | null;
    portFacing: number | null;
}

export interface PlacementSnapshot {
    roads: { edge: Edge; playerId: string }[];
    settlements: { vertex: Vertex; playerId: string }[];
    cities: { vertex: Vertex; playerId: string }[];
}

export interface PlayerSnapshot {
    id: string;
    name: string;
    color: string;
    resources: Resource[];
    devCards: DevCardSnapshot[];
    victoryPoints: number;
    cardCount: number;
    hasLongestRoad: boolean;
    hasLargestArmy: boolean;
    usedRobbers: number;
}

export interface DevCardSnapshot {
    uid: string;
    type: DevCardType;
    used: boolean;
}

export interface GameSnapshot {
    players: PlayerSnapshot[];
    tiles: TileSnapshot[];
    placements: PlacementSnapshot;
    currentPhase: GamePhase;
    currentPlayerId: string;
    turnNumber: number;
    activeTradeOffers: TradeOfferPanelData[];
    discardSession: DiscardSession;
    diceRoll?: { values: [number, number] };
    stealSession: StealSession;
}

export interface DiscardSession {
    mustDiscard: boolean;
    discardAmount: number;
}

export interface StealSession {
    isActive: boolean;
    retrievingPlayerId: string;
    candidates: string[];
}

export enum GamePhase {
    /** initial placement — settlement */
    SetupPlaceSettlement = 'setup_place_settlement',

    /** initial placement — road after settlement */
    SetupPlaceRoad = 'setup_place_road',

    /** waiting to roll dice */
    PreRoll = 'pre_roll',

    /** dice rolled, can build/trade */
    PostRoll = 'post_roll',

    /** 7 rolled or knight played — must move robber */
    RobberPlacement = 'robber_placement',

    /** robber placed — must choose player to steal from */
    RobberSteal = 'robber_steal',

    /** active trade offer in progress */
    Trading = 'trading',

    /** Seven Rolled - must discard half cards */
    Discard = 'discard',

    /** game over */
    End = 'end',
}

export enum DevCardType {
    Knight = 'knight',
    RoadBuilding = 'roadBuilding',
    YearOfPlenty = 'yearOfPlenty',
    Monopoly = 'monopoly',
    VictoryPoint = 'victoryPoint',
}

export const TileToResourceMap: Record<LandTileType, ResourceType> = {
    [TileType.Forest]: ResourceType.Lumber,
    [TileType.Hills]: ResourceType.Brick,
    [TileType.Pasture]: ResourceType.Wool,
    [TileType.Fields]: ResourceType.Grain,
    [TileType.Mountains]: ResourceType.Ore,
};