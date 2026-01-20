import {
    BuildingType, ButtonType,
    EdgeDirection,
    GamePhase, MoveType,
    type DevelopmentCardType,
    type ResourceType,
    TileKind,
    VertexDirection
} from "@/game/model/enums.ts";
import type {EventType} from "@/game/model/enums.ts";
import type {PlayerStyle} from "@/game/theme/playerStyles.ts";
import type {PlayerPanelLayout, UiLayout} from "@/game/layout/HUDLayoutService.ts";

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
    isDisabled?: boolean;
    //Todo add more if needed
}

export interface HandCard {
    resourceType: ResourceType;
    layout: UiLayout;
    isHovered: boolean;
    isSelected: boolean;
}

export interface PlayerOverviewPanel {
    player: Player; // Reference to the data we need to draw
    layout: PlayerPanelLayout;
}

export interface Board {
    buildings: Map<string, Building>;
    roads: Map<string, Road>;
    tiles: Map<string, Tile>;
    robber: Hex;
}

export type ResourceCollection = Record<ResourceType, number>;

export interface Inventory {
    resources: ResourceCollection;
    hiddenCount: number; // Cards held by the player that are unknown to the local client
    developmentCards: DevelopmentCardType[];
}

export interface Player {
    playerName: string;
    inventory: Inventory;
    points: number;
    isActive: boolean;
    isLocal: boolean;
    style: PlayerStyle;
}

export type PhaseConfig = Record<GamePhase, EventType[]>;

export interface GameState {
    board: Board;
    players: Player[];
    dices: number[];
    deck: DevelopmentCardType[];
    turn: number;
    hasRolledDice?: boolean;
    phase: GamePhase;
    phaseConfig: PhaseConfig;
    inputState: InputState;
}

export interface Prices {
    house: Record<ResourceType, number>;
    city: Record<ResourceType, number>;
    road: Record<ResourceType, number>;
    developmentCard: Record<ResourceType, number>;
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
    viewport: { width: number, height: number };
    ratios: WorldRatios;
}

export interface WorldRatios {
    roadWidth: number;
    settlementScale: number;
    cityScale: number;
    tile: {
        iconScale: number;
        fontSize: number;
        labelOffset: number;
    }
}

export interface InputState {
    pressedKeys: Set<string>;
    mousePosition?: Point;
}

export interface ClientState {
    // The ID of the player currently controlled by this client instance.
    localPlayerId: string;
    layoutSettings: LayoutSettings;
}

export interface GhostEffect {
    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void;
}

export interface HUDEntities {
    buttons: Button[],
    cards: HandCard[];
    playerPanels: PlayerOverviewPanel[];
}