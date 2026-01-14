import type {GameState, Hex} from "@/game/model/types.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";
import gameRules from "@/game/config/gameRules.json";
import {BuildingType, EventType, GamePhase, ResourceType} from "@/game/model/enums.ts";

export class GameRuleService {

    public static getActionCost(game: GameState, eventType: EventType): Record<string, number> {
        // During Setup, everything is free
        if (game.phase === GamePhase.SetupSettlement || game.phase === GamePhase.SetupRoad) {
            return {};
        }

        // Standard Costs
        switch (eventType) {
            case EventType.BuildRoad: return gameRules.costs.road;
            case EventType.BuildSettlement: return gameRules.costs.settlement;
            case EventType.BuildCity: return gameRules.costs.city;
            case EventType.BuyDevelopmentCard: return gameRules.costs.developmentCard;
            default: return {};
        }
    }

    public static shouldDistributeSetupResources(game: GameState): boolean {
        // In standard Catan snake draft (1-2-3-3-2-1), players get resources 
        // for the settlement placed in the second round of setup.
        // Assuming 2 setup rounds:
        const totalPlayers = game.players.length;
        return game.phase === GamePhase.SetupSettlement && game.turn >= totalPlayers;
    }

    public static canBuildRoad(game: GameState, playerId: string): boolean {
        // Setup Phase Limits: Max 1 road per setup turn
        if (game.phase === GamePhase.SetupRoad) {
            const roadCount = this.getPlayerRoadCount(game, playerId);
            const expected = game.turn < game.players.length ? 1 : 2;
            if (roadCount >= expected) return false;
        }

        if (!this.hasResources(game, playerId, this.getActionCost(game, EventType.BuildRoad))) return false;
        if (this.getPlayerRoadCount(game, playerId) >= gameRules.limits.road) return false;
        return true;
    }

    public static canBuildSettlement(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, this.getActionCost(game, EventType.BuildSettlement))) return false;
        if (this.getPlayerBuildingCount(game, playerId, BuildingType.Settlement) >= gameRules.limits.settlement) return false;
        return true;
    }

    public static canBuildCity(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, this.getActionCost(game, EventType.BuildCity))) return false;
        if (this.getPlayerBuildingCount(game, playerId, BuildingType.City) >= gameRules.limits.city) return false;
        return true;
    }

    public static canBuyDevelopmentCard(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, this.getActionCost(game, EventType.BuyDevelopmentCard))) return false;
        return true;
    }

    public static canEndTurn(game: GameState, playerId: string): boolean {
        if (game.phase === GamePhase.SetupRoad) {
            const roadCount = this.getPlayerRoadCount(game, playerId);
            // In setup, you must place your road before ending turn
            const expected = game.turn < game.players.length ? 1 : 2;
            return roadCount >= expected;
        }
        // In Setup_Settlement, you cannot end turn (must build settlement)
        if (game.phase === GamePhase.SetupSettlement) return false;
        
        return true;
    }

    public static canMoveRobber(game: GameState, targetHex: Hex): boolean {
        const currentRobber = game.board.robber;
        
        // 1. Cannot place on the same spot
        if (targetHex.q === currentRobber.q && targetHex.r === currentRobber.r) {
            return false;
        }

        // 2. Must be a valid tile (exists on board)
        const s = -targetHex.q - targetHex.r;
        const key = `q${targetHex.q}r${targetHex.r}s${s}`;
        return game.board.tiles.has(key);
    }

    private static hasResources(game: GameState, playerId: string, cost: Record<string, number>): boolean {
        const player = PlayerService.getPlayer(game, playerId);
        if (!player) return false;

        for (const [res, amount] of Object.entries(cost)) {
            if ((player.inventory.resources[res as ResourceType] || 0) < amount) {
                return false;
            }
        }
        return true;
    }

    private static getPlayerBuildingCount(game: GameState, playerId: string, type: BuildingType): number {
        let count = 0;
        for (const building of game.board.buildings.values()) {
            if (building.playerName === playerId && building.type === type) {
                count++;
            }
        }
        return count;
    }

    private static getPlayerRoadCount(game: GameState, playerId: string): number {
        let count = 0;
        for (const road of game.board.roads.values()) {
            if (road.playerName === playerId) {
                count++;
            }
        }
        return count;
    }
}