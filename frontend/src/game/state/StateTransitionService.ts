import type {GameState} from "@/game/model/types.ts";
import {ButtonType, EventType} from "@/game/model/enums.ts";
import type {GameStateHandler} from "@/game/state/GameStateHandler.ts";
import {BuildRoadState} from "@/game/state/BuildRoadState.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {BuildSettlementState} from "@/game/state/BuildSettlementState.ts";
import {BuildCityState} from "@/game/state/BuildCityState.ts";
import {MoveRobberState} from "@/game/state/MoveRobberState.ts";
import {StealResourceState} from "@/game/state/StealResourceState.ts";
import {DefaultState} from "@/game/state/DefaultState.ts";
import {WaitingState} from "@/game/state/WaitingState.ts";
import type {GameEvent, MoveRobberEvent} from "@/game/model/events.ts";

export class StateTransitionService {

    /**
     * Determines the next state based on a UI Button click.
     */
    public static getNextStateFromButton(
        type: ButtonType, 
        game: GameState, 
        localPlayerId: string
    ): GameStateHandler | null {
        
        switch (type) {
            case ButtonType.putRoad:
                if (GameRuleService.canBuildRoad(game, localPlayerId)) {
                    return new BuildRoadState();
                }
                break;
            case ButtonType.putSettlement:
                if (GameRuleService.canBuildSettlement(game, localPlayerId)) {
                    return new BuildSettlementState();
                }
                break;
            case ButtonType.putCity:
                if (GameRuleService.canBuildCity(game, localPlayerId)) {
                    return new BuildCityState();
                }
                break;
        }
        return null;
    }

    /**
     * Determines the next state based on an incoming Game Event.
     */
    public static getNextStateFromEvent(
        event: GameEvent,
        game: GameState,
        localPlayerId: string,
        isMyTurn: boolean
    ): GameStateHandler | null {

        switch (event.type) {
            case EventType.RobberTriggered:
                // If the robber is triggered, the active player must move it.
                return isMyTurn ? new MoveRobberState() : null;

            case EventType.MoveRobber:
                // After the robber moves, the active player might need to steal.
                // We pass the hex from the event so the state knows where to look for victims.
                return isMyTurn ? new StealResourceState((event as MoveRobberEvent).hex) : new DefaultState();

            case EventType.EndTurn:
                return isMyTurn ? new DefaultState() : new WaitingState();
        }
        
        return null;
    }
}