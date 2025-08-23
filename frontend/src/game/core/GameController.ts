import type {PressedButtonEvent} from "@/game/core/types.ts";
import {type Game, InputState} from "@/game/core/Game.ts";
import {ButtonType} from "@/game/core/Buttons/ButtonType.ts";

export class GameController {

    public static handlePressedButtonEvent(event: PressedButtonEvent, game: Game) {
        //Check the input state
        switch (event.buttonType) {
            case ButtonType.putRoad:
                game.inputState = game.inputState == InputState.RoadPlacingMode
                                ? InputState.DefaultMode : InputState.RoadPlacingMode;
                break;
            case ButtonType.putHouse:
                game.inputState = game.inputState == InputState.HousePlacingMode
                    ? InputState.DefaultMode : InputState.HousePlacingMode;
                break;
            case ButtonType.putCity:
                game.inputState = game.inputState == InputState.CityPlacingMode
                    ? InputState.DefaultMode : InputState.CityPlacingMode;
                break;
            case ButtonType.drawDevelopmentCard:
                //TODO implement this
                break;
            case ButtonType.endTurn:
                //TODO implement this
                break;
        }

        //Redraw with the updates...
        game.draw();
    }

    // Create the interaction handlers

}