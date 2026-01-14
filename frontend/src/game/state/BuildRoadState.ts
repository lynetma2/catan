import type {GameContext} from "./GameStateHandler";
import type {Edge, GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import {BaseGameState} from "@/game/state/BaseGameState.ts";
import {ButtonType, EventType} from "@/game/model/enums.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {RoadGhost} from "@/game/rendering/ghosts/RoadGhost.ts";
import {KeyService} from "@/game/utils/KeyService.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import type {BuildRoadEvent} from "@/game/model/events.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";

export class BuildRoadState extends BaseGameState {
    protected triggerButton = ButtonType.putRoad;
    private ghosts: Map<string, GhostEffect> = new Map();
    private activeGhost: GhostEffect | undefined;
    private activeGhostKey: string | undefined;
    private hoveredEdge: Edge | undefined;

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
        
        const localPlayer = game.players.find(p => p.isLocal);
        if (localPlayer) {
            const validEdges = BoardService.getValidRoadEdges(game.board, localPlayer.playerName);
            // Static indicators: White/Transparent circles
            this.ghosts.clear();
            validEdges.forEach(edge => {
                this.ghosts.set(KeyService.edgeToKey(edge), new RoadGhost(edge));
            });
        }
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        if (this.hoveredEdge) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                if (!ActionValidator.canPerformAction(game, localPlayer.playerName, EventType.BuildRoad)) {
                    return;
                }

                const event: BuildRoadEvent = {
                    type: EventType.BuildRoad,
                    playerId: localPlayer.playerName,
                    edge: this.hoveredEdge
                };
                this.context?.emitEvent(event);
                this.returnToDefaultState();
            }
        }
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const nearestEdge = HexLayoutService.getNearestEdge(layoutSettings, {x, y});
        const key = KeyService.edgeToKey(nearestEdge);

        if (this.ghosts.has(key)) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                this.activeGhost = new RoadGhost(nearestEdge, localPlayer.style.fillColor, 'preview');
                this.activeGhostKey = key;
                this.hoveredEdge = nearestEdge;
            }
        } else {
            this.activeGhost = undefined;
            this.activeGhostKey = undefined;
            this.hoveredEdge = undefined;
        }
    }
    
    getGhostEffects(): GhostEffect[] | undefined {
        const effects: GhostEffect[] = [];
        this.ghosts.forEach((ghost, key) => {
            if (key !== this.activeGhostKey) {
                effects.push(ghost);
            }
        });

        if (this.activeGhost) {
            effects.push(this.activeGhost);
        }
        return effects;
    }
    
    
}