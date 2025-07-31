
interface GameState {
    board: Board;
    players: Player[];
    dices: number[];
    gamePhase: GamePhase;
    gameStats: GameStats;
    currentPlayerName: string;
    bank: {
        resources: Resources;
        growthCards: number;
    }
    trades: Trade[];
}

interface Trade {
    offeringPlayerName: string;
    givingResources: Resources;
    wantingResources: Resources;
    isAcceptedPlayers: boolean[];
}

interface GameStats {
    turnNumber: number;
    diceAppearances: number[];
}

interface Player {
    name: string;
    color: string;
    stats: PlayerStats;
    resources?: Resources;
    growthCards?: GrowthCards[];
}

interface PlayerStats {
    longestRoad: number;
    points: number;
    houses: number;
    cities: number;
    roads: number;
    army: number;
    totalResources: number;
    totalGrowthCards: number;
}

interface Resources {
    wood: number;
    brick: number;
    grain: number;
    ore: number;
    sheep: number;
}

interface Board {
    map: Map<string, Terrain>;
    roads: Map<string, Road>;
    buildings: Map<string, Building>;
}

interface Terrain {
    hex: Hex;
    kind: ResourceKinds;
    dice?: number;
    tradeKind?: ResourceKinds;
}

interface Hex {
    q: number;
    r: number;
    s: number;
}

interface Road {
    edge: Edge;
    playerName: string;
}

interface Edge {
    q: number;
    r: number;
    s: number;
    direction: EdgeDirection;
}

interface Building {
    vertex: Vertex;
    playerName: string;
    kind: BuildingKind;
}

interface Vertex {
    q: number;
    r: number;
    s: number;
    direction: VertexDirection;
}

enum ResourceKinds {
    lumber,
    brick,
    grain,
    wool,
    ore,
    desert,
    sea,
    port
}

enum GrowthCards {
    knight,
    point,
    monopoly,
    yearOfThePlenty,
    roadBuilding
}

enum EdgeDirection {
    north,
    east,
    west
}

enum VertexDirection {
    east,
    west,
}

enum BuildingKind {
    house,
    city
}

enum GamePhase {
    rollDices,
    buildingHouse,
    buildingCity,
    buildingRoad,
    placingRobber,
    usingYearOfThePlenty,
    usingMonopoly,
    usingRoadBuilding,
    notActiveTurn,
}