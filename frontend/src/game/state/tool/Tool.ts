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


export interface SelectEdgeTool {

}

export interface SelectVertexTool {

}

export interface SelectHexTool {

}

//This might be harder because it relies on a lot of UI to make a player clickable
//But we try it anyway
export interface SelectPlayerTool {

}

export interface DiscardCardsTool {

}

export interface ChooseResourcesTool {

}

export interface RollDiceTool {

}


//Hardest part going to be the priority on the tools, when there are more than one tool!