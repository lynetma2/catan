import type {GameState, GhostEffect, HUDEntities, LayoutSettings} from "@/game/model/types.ts";

export interface GameStateHandler {
    //Called when entering the state
    onEnter(game: GameState, layoutSettings: LayoutSettings): void;

    //Handle input specific to this phase/state
    onClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;
    onMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    //Called when leaving the state
    onExit(game: GameState): void;

    // Expose UI elements for the RenderService to draw
    getHUDEntities(): HUDEntities | undefined;

    //TODO add the ability to expose a ghost effect structure. (e.g. road, settlement, city, robber)
    getGhostEffects(): GhostEffect[];
}