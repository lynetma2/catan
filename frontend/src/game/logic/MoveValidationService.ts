import type {GameState} from "@/game/model/types.ts";

export class MoveValidationService {
    private readonly game: GameState;

    constructor(game: GameState) {
        this.game = game;
    }
}