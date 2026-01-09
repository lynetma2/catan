import type {GameState, GhostEffect, HUDEntities, LayoutSettings} from "@/game/model/types.ts";
import type {ButtonType} from "@/game/model/enums.ts";

export interface GameContext {
    setGameState(state: GameStateHandler): void;
    handleButtonAction(type: ButtonType): void;
}

export interface GameStateHandler {
    //Called when entering the state
    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void;

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