import type {GameState, LayoutSettings} from "@/game/model/types.ts";
import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";

export class DefaultState extends BaseGameState {
    
    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        super.onEnter(game, layoutSettings, context);
        // Default state might not have any selected buttons
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Handle map clicks (e.g. selecting a tile)
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Handle map hover
    }
}