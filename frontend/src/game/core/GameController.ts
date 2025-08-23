import type {PlaceHouseEvent, PressedButtonEvent} from "@/game/core/types.ts";
import {type Game, InputState} from "@/game/core/Game.ts";
import {ButtonType} from "@/game/core/Buttons/ButtonType.ts";

export class GameController {

    public static handlePressedButtonEvent(event: PressedButtonEvent, game: Game) {
        //Check the input state
        switch (event.buttonType) {
            case ButtonType.putRoad:
                game.updateInputState(game.inputState == InputState.RoadPlacingMode
                    ? InputState.DefaultMode : InputState.RoadPlacingMode);
                break;
            case ButtonType.putHouse:
                game.updateInputState(game.inputState == InputState.HousePlacingMode
                    ? InputState.DefaultMode : InputState.HousePlacingMode);
                break;
            case ButtonType.putCity:
                game.updateInputState(game.inputState == InputState.CityPlacingMode
                    ? InputState.DefaultMode : InputState.CityPlacingMode);
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

    public static handlePlaceHouseEvent(event: PlaceHouseEvent, game: Game) {
        //validate that it is possible to put it here. Otherwise send an error event.

    }

    // Create the interaction handlers

}