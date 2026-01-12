import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";
import type {GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";

export class LoadingState extends BaseGameState {
    
    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        // We don't need to do anything here, just wait for the event.
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Ignore input
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Ignore input
    }

    getGhostEffects(): GhostEffect[] | undefined {
        return undefined;
    }

    // Override update to ensure we don't process game logic if we don't want to
    update(game: GameState, layoutSettings: LayoutSettings): void {
        // Could animate a loading spinner here
    }

    // Override HUD to show loading text
    getHUDEntities() {
        // Return undefined for now, or a specific loading HUD entity if the type allows
        return undefined;
    }
}