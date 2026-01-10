import type {
    Edge,
    GameState,
    MaxBuildings,
    Player,
    Prices,
    Inventory,
    ValidationResult,
    Vertex
} from "@/game/model/types.ts";
import type {BoardService} from "@/game/service/logic/boardService.ts";

export class RuleService {
    private readonly PRICES: Prices = {
        house: { wood: 1, brick: 1, sheep: 1, wheat: 1, ore: 0 },
        city: { wood: 0, brick: 0, sheep: 0, wheat: 2, ore: 3 },
        road: { wood: 1, brick: 1, sheep: 1, wheat: 1, ore: 0 },
        developmentCard: { wood: 0, brick: 0, sheep: 1, wheat: 1, ore: 1 },
    }

    private readonly MAX_BUILDINGS: MaxBuildings = {
        house: 5,
        city: 4,
        road: 15,
    }

    private boardService: BoardService;

    constructor(boardService: BoardService) {
        this.boardService = boardService;
    }

    public canBuildHouse(gameState: GameState, player: Player, vertex: Vertex): ValidationResult {
        //Check position

        //Check distance rule

        //Check road connection

        //Check resources

        //Check building limit
    }

    public canBuildCity(gameState: GameState, player: Player, vertex: Vertex): ValidationResult {}

    public canBuildRoad(gameState: GameState, player: Player, edge: Edge): ValidationResult {}

    public canDrawDevelopmentCard(gameState: GameState, player: Player,): ValidationResult {}

    public canMoveRobber(gameState: GameState, player: Player, vertex: Vertex): ValidationResult {}

    //TODO add stuff related to trading.

    private hasResources(player: Player, cost: Inventory): boolean {
        return Object.entries(cost).every(([resource, price]) =>
            player.inventory[resource as keyof Inventory] >= price
        );
    }

    private getActivePlayer(gameState: GameState): Player | null {
        for (const player of gameState.players) {
            if (player.isActive) {
                return player;
            }
        }
        return null;
    }
}