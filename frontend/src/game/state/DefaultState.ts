import type {GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {CityGhost} from "@/game/rendering/ghosts/CityGhost.ts";
import {SettlementGhost} from "@/game/rendering/ghosts/SettlementGhost.ts";
import {RoadGhost} from "@/game/rendering/ghosts/RoadGhost.ts";

export class DefaultState extends BaseGameState {
    private activeGhost: GhostEffect | undefined;
    
    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
    }

    update(game: GameState, layoutSettings: LayoutSettings): void {
        super.update(game, layoutSettings);

    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Handle map clicks (e.g. selecting a tile)
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const localPlayer = game.players.find(p => p.isLocal);
        if (!localPlayer) {
            this.activeGhost = undefined;
            return;
        }
        const playerId = localPlayer.playerName;
        const snapDist = layoutSettings.size.x * 0.4;

        // 1. Check Vertices (City / Settlement)
        const nearestVertex = HexLayoutService.getNearestVertex(layoutSettings, {x, y});
        const vertexCenter = HexLayoutService.vertexPolygonCorners(layoutSettings, nearestVertex)[0];
        const distV = Math.hypot(x - vertexCenter.x, y - vertexCenter.y);

        if (distV < snapDist) {
            // Priority: City > Settlement
            if (GameRuleService.canBuildCity(game, playerId) && BoardService.canPlaceCity(game.board, nearestVertex, playerId)) {
                this.activeGhost = new CityGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                return;
            }
            if (GameRuleService.canBuildSettlement(game, playerId) && BoardService.canPlaceSettlement(game.board, nearestVertex, playerId)) {
                this.activeGhost = new SettlementGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                return;
            }
        }

        // 2. Check Edges (Road)
        const nearestEdge = HexLayoutService.getNearestEdge(layoutSettings, {x, y});
        const edgeCorners = HexLayoutService.edgePolygonCorners(layoutSettings, nearestEdge);
        const edgeCenter = {
            x: (edgeCorners[0].x + edgeCorners[1].x) / 2,
            y: (edgeCorners[0].y + edgeCorners[1].y) / 2
        };
        const distE = Math.hypot(x - edgeCenter.x, y - edgeCenter.y);

        if (distE < snapDist) {
            if (GameRuleService.canBuildRoad(game, playerId) && BoardService.canPlaceRoad(game.board, nearestEdge, playerId)) {
                this.activeGhost = new RoadGhost(nearestEdge, localPlayer.style.fillColor, 'preview');
                return;
            }
        }

        this.activeGhost = undefined;
    }

    getGhostEffects(): GhostEffect[] | undefined {
        return this.activeGhost ? [this.activeGhost] : undefined;
    }
}