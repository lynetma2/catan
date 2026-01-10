import type {GameContext} from "./GameStateHandler";
import type {GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import {BaseGameState} from "@/game/state/BaseGameState.ts";
import {ButtonType} from "@/game/model/enums.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {KeyService} from "@/game/utils/KeyService.ts";
import {CityGhost} from "@/game/rendering/ghosts/CityGhost.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";

export class BuildCityState extends BaseGameState {
    protected triggerButton = ButtonType.putCity;
    private ghosts: Map<string, GhostEffect> = new Map();
    private activeGhost: GhostEffect | undefined;
    private activeGhostKey: string | undefined;

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
        
        const localPlayer = game.players.find(p => p.isLocal);
        if (localPlayer) {
            const validVertices = BoardService.getValidCityVertices(game.board, localPlayer.playerName);
            
            this.ghosts.clear();
            validVertices.forEach(vertex => {
                this.ghosts.set(KeyService.vertexToKey(vertex), new CityGhost(vertex));
            });
        }
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Handle map clicks (e.g. selecting a tile)
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const nearestVertex = HexLayoutService.getNearestVertex(layoutSettings, {x, y});
        const key = KeyService.vertexToKey(nearestVertex);

        if (this.ghosts.has(key)) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                this.activeGhost = new CityGhost(nearestVertex, localPlayer.style.fillColor, 'preview');
                this.activeGhostKey = key;
            }
        } else {
            this.activeGhost = undefined;
            this.activeGhostKey = undefined;
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