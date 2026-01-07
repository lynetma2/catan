import type {GameState, LayoutSettings} from "@/game/model/types.ts";

export interface GameStateHandler {
    //Called when entering the state
    onEnter(game: GameState, layoutSettings: LayoutSettings): void;

    //Handle input specific to this phase/state
    onClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;
    onMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    //Called when leaving the state
    onExit(game: GameState): void;

    //Should only be used to draw things on top of the world. Things specific to this state. e.g. build road hovering etc.
    draw(ctx: CanvasRenderingContext2D, game: GameState, layoutSettings: LayoutSettings): void;
}