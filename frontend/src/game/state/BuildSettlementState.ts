import type {GameContext} from "./GameStateHandler";
import type {GameState, GhostEffect, LayoutSettings, Vertex} from "@/game/model/types.ts";
import {BaseGameState} from "@/game/state/BaseGameState.ts";
import {ButtonType, EventType} from "@/game/model/enums.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {KeyService} from "@/game/utils/KeyService.ts";
import {SettlementGhost} from "@/game/rendering/ghosts/SettlementGhost.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import type {BuildSettlementEvent} from "@/game/model/events.ts";

export class BuildSettlementState extends BaseGameState {
    protected triggerButton = ButtonType.putSettlement;
    private ghosts: Map<string, GhostEffect> = new Map();
    private activeGhost: GhostEffect | undefined;
    private activeGhostKey: string | undefined;
    private hoveredVertex: Vertex | undefined;

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
        
        const localPlayer = game.players.find(p => p.isLocal);
        if (localPlayer) {
            const validVertices = BoardService.getValidSettlementVertices(game.board, localPlayer.playerName);
            
            this.ghosts.clear();
            validVertices.forEach(vertex => {
                this.ghosts.set(KeyService.vertexToKey(vertex), new SettlementGhost(vertex));
            });
        }
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        if (this.hoveredVertex) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                const event: BuildSettlementEvent = {
                    type: EventType.BuildSettlement,
                    playerId: localPlayer.playerName,
                    vertex: this.hoveredVertex
                };
                this.context?.emitEvent(event);
                this.returnToDefaultState();
            }
        }
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const nearestVertex = HexLayoutService.getNearestVertex(layoutSettings, {x, y});
        const key = KeyService.vertexToKey(nearestVertex);

        if (this.ghosts.has(key)) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                this.activeGhost = new SettlementGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                this.activeGhostKey = key;
                this.hoveredVertex = nearestVertex;
            }
        } else {
            this.activeGhost = undefined;
            this.activeGhostKey = undefined;
            this.hoveredVertex = undefined;
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