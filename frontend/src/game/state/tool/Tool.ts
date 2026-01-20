import type {ButtonType} from "@/game/model/enums.ts";
import type {GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";

export interface Tool {
    readonly name: string;
    readonly triggerButton?: ButtonType;

    onEnter?(game: GameState): void;
    onExit?(game: GameState): void;

    onInputEvent(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void;
    onAction(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void;

    getGhostEffects(): GhostEffect[] | undefined;
}