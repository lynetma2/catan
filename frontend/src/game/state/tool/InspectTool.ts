import type {Tool} from "@/game/state/tool/Tool.ts";
import type {GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import type {GameContext} from "@/game/state/GameStateHandler.ts";

export class InspectTool implements Tool {
    readonly name: string = "InspectTool";

    onInputEvent(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void {
        // InspectTool doesn't handle direct input events for actions
    }

    onAction(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void {
        // InspectTool doesn't perform actions
    }

    getGhostEffects(): GhostEffect[] | undefined {
        return undefined; // InspectTool doesn't show ghost effects
    }
}