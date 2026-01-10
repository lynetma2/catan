import {
    BuildingType, ButtonType,
    EdgeDirection,
    GamePhase, MoveType,
    type ResourceType,
    TileKind,
    VertexDirection
} from "@/game/model/enums.ts";
import type {PlayerStyle} from "@/game/theme/playerStyles.ts";
import type {UiLayout} from "@/game/service/layout/HUDLayoutService.ts";

export interface Point {
    x: number;
    y: number;
}

export interface Hex {
    q: number;
    r: number;
}

export interface Edge {
    q: number;
    r: number;
    direction: EdgeDirection;
}

export interface Vertex {
    q: number;
    r: number;
    direction: VertexDirection;
}

export interface Orientation {
    f0: number;
    f1: number;
    f2: number;
    f3: number;
    b0: number;
    b1: number;
    b2: number;
    b3: number;
    startAngle: number;
}

export interface Building {
    vertex: Vertex;
    type: BuildingType;
    playerName: string;
}

export interface Road {
    edge: Edge;
    playerName: string;
}

export interface Tile {
    hex: Hex;
    tileKind: TileKind;
    resourceType?: ResourceType;
    dice?: number;
    //TODO handle ports/trade
}

export interface Button {
    type: ButtonType;
    layout: UiLayout;
    isHovered?: boolean;
    isSelected?: boolean;
    //Todo add more if needed
}

export interface Board {
    buildings: Map<string, Building>;
    roads: Map<string, Road>;
    tiles: Map<string, Tile>;
    robber: Hex;
}

export interface ResourceCollection {
    wood: number;
    brick: number;
    sheep: number;
    wheat: number;
    ore: number;
}

export interface Player {
    playerName: string;
    resources: ResourceCollection;
    //Todo add cards
    points: number;
    isActive: boolean;
    isLocal: boolean;
    style: PlayerStyle;
}

export interface GameState {
    board: Board;
    players: Player[];
    dices: number[];
    phase: GamePhase;
    inputState: InputState;
}

export interface Prices {
    house: ResourceCollection;
    city: ResourceCollection;
    road: ResourceCollection;
    developmentCard: ResourceCollection;
}

export interface MaxBuildings {
    house: number;
    city: number;
    road: number;
}

export interface ValidationContext {
    gameState: GameState;
    playerId: string;
}

export interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

export interface GameStats {
    moves: number;
    //tbd
}

export interface LayoutSettings {
    size: Point;
    origin: Point;
    orientation: Orientation;
    roadWidth: number;
    cityRadius: number;
    settlementRadius: number;
    viewport: { width: number, height: number };
}

export interface InputState {
    pressedKeys: Set<string>;
    mousePosition?: Point;
}

export interface ClientState {
    // The ID of the player currently controlled by this client instance.
    localPlayerId: string;
}

export interface PotentialMove {
    moveType: MoveType;
    location: Vertex | Edge;
    isValid: boolean;
}

export interface GhostEffect {
    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void;
}

export interface HUDEntities {
    buttons: Button[],
    //TODO add more...
}