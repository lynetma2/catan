import type {GameState, Hex} from "@/game/model/types.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";
import gameRules from "@/game/config/gameRules.json";
import {BuildingType, ResourceType} from "@/game/model/enums.ts";

export class GameRuleService {

    public static canBuildRoad(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, gameRules.costs.road)) return false;
        if (this.getPlayerRoadCount(game, playerId) >= gameRules.limits.road) return false;
        return true;
    }

    public static canBuildSettlement(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, gameRules.costs.settlement)) return false;
        if (this.getPlayerBuildingCount(game, playerId, BuildingType.Settlement) >= gameRules.limits.settlement) return false;
        return true;
    }

    public static canBuildCity(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, gameRules.costs.city)) return false;
        if (this.getPlayerBuildingCount(game, playerId, BuildingType.City) >= gameRules.limits.city) return false;
        return true;
    }

    public static canBuyDevelopmentCard(game: GameState, playerId: string): boolean {
        if (!this.hasResources(game, playerId, gameRules.costs.developmentCard)) return false;
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