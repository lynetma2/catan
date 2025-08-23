import {type Game, InputState} from "@/game/core/Game.ts";
import type {PlaceHouseEvent, Resources} from "@/game/core/types.ts";

export class GameRules {

    public static PRICES = {
        road: {
            wood: 1,
            brick: 1,
            grain: 0,
            wool: 0,
            ore: 0
        },
        house: {
            wood: 1,
            brick: 1,
            grain: 1,
            wool: 1,
            ore: 0
        },
        city: {
            wood: 0,
            brick: 0,
            grain: 2,
            wool: 0,
            ore: 3
        },
        card: {
            wood: 0,
            brick: 0,
            grain: 1,
            wool: 1,
            ore: 1
        }
    }

    private static comparePrices(resources: Resources, price: Resources): boolean {
        for (const [key, value] of Object.entries(resources) as [keyof Resources, number][]) {
            if (value < price[key]) {
                return false;
            }
        }
        return true;
    }

    public static validateHousePlacement(event: PlaceHouseEvent, game: Game): boolean {
        if (game.inputState != InputState.HousePlacingMode) {
            return false;
        }

        const currentPlayerRessources = game.players.get(event.playerName)?.resources.resources;

        if (!currentPlayerRessources || !this.comparePrices(currentPlayerRessources, this.PRICES.house)) {
            return false;
        }

        if (game.board.isLegalHouseVertex(event.vertex, event.playerName)) {
            return false;
        }

        return true;
    }



}