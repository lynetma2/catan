import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameState, LayoutSettings} from "@/game/model/types.ts";
import {ButtonType} from "@/game/model/enums.ts";
import type {Button} from "@/game/model/types.ts";

export class WaitingState extends BaseGameState {

    // Override to only show the Waiting button/indicator
    protected generateButtons(game: GameState) {
        const buttons: Button[] = [];
        buttons.push(this.createButton(ButtonType.waiting));
        this.hudEntities!.buttons = buttons;
    }

    // Disable all map interactions
    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Do nothing
    }

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        // Do nothing
    }
}