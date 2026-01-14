import type {Button, Edge, GameState, GhostEffect, LayoutSettings, Vertex} from "@/game/model/types.ts";
import {GameplayState} from "@/game/state/GameplayState.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {HUDLayoutService} from "@/game/layout/HUDLayoutService.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {CityGhost} from "@/game/rendering/ghosts/CityGhost.ts";
import {SettlementGhost} from "@/game/rendering/ghosts/SettlementGhost.ts";
import {RoadGhost} from "@/game/rendering/ghosts/RoadGhost.ts";
import {ButtonType, EventType, GamePhase} from "@/game/model/enums.ts";
import type {BuildCityEvent, BuildRoadEvent, BuildSettlementEvent} from "@/game/model/events.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";

type SmartAction = 
    | { type: EventType.BuildCity | EventType.BuildSettlement, vertex: Vertex }
    | { type: EventType.BuildRoad, edge: Edge };

export class DefaultState extends GameplayState {
    private activeGhost: GhostEffect | undefined;
    private hoveredAction: SmartAction | undefined;
    
    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
    }

    update(game: GameState, layoutSettings: LayoutSettings): void {
        super.update(game, layoutSettings);
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Check for Dice Click
        const diceLayouts = HUDLayoutService.getDiceLayout(layoutSettings.viewport.width, layoutSettings.viewport.height);
        const clickedDice = diceLayouts.some(rect => 
            x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height
        );

        if (clickedDice) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer && ActionValidator.canPerformAction(game, localPlayer.playerName, EventType.RollDice)) {
                this.context?.emitEvent({
                    type: EventType.RollDice,
                    playerId: localPlayer.playerName
                });
            }
            return;
        }

        if (this.hoveredAction) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                const event = {
                    ...this.hoveredAction,
                    playerId: localPlayer.playerName
                } as BuildCityEvent | BuildSettlementEvent | BuildRoadEvent;
                this.context?.emitEvent(event);
            }
        }
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const localPlayer = game.players.find(p => p.isLocal);
        if (!localPlayer) {
            this.activeGhost = undefined;
            this.hoveredAction = undefined;
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
            if (ActionValidator.canPerformAction(game, playerId, EventType.BuildCity) &&
                BoardService.canPlaceCity(game.board, nearestVertex, playerId)) {
                this.activeGhost = new CityGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                this.hoveredAction = { type: EventType.BuildCity, vertex: nearestVertex };
                return;
            }
            const checkConnection = game.phase !== GamePhase.SetupSettlement;
            if (ActionValidator.canPerformAction(game, playerId, EventType.BuildSettlement) &&
                BoardService.canPlaceSettlement(game.board, nearestVertex, playerId, checkConnection)) {
                this.activeGhost = new SettlementGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                this.hoveredAction = { type: EventType.BuildSettlement, vertex: nearestVertex };
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
            if (ActionValidator.canPerformAction(game, playerId, EventType.BuildRoad) &&
                BoardService.canPlaceRoad(game.board, nearestEdge, playerId)) {
                this.activeGhost = new RoadGhost(nearestEdge, localPlayer.style.fillColor, 'preview');
                this.hoveredAction = { type: EventType.BuildRoad, edge: nearestEdge };
                return;
            }
        }

        this.activeGhost = undefined;
        this.hoveredAction = undefined;
    }

    getGhostEffects(): GhostEffect[] | undefined {
        return this.activeGhost ? [this.activeGhost] : undefined;
    }
}