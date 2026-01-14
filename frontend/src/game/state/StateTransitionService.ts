import {ButtonType, EventType, GamePhase} from "@/game/model/enums.ts";
import type {GameState} from "@/game/model/types.ts";
import type {GameStateHandler} from "@/game/state/GameStateHandler.ts";
import {DefaultState} from "@/game/state/DefaultState.ts";
import {BuildRoadState} from "@/game/state/BuildRoadState.ts";
import {BuildSettlementState} from "@/game/state/BuildSettlementState.ts";
import {BuildCityState} from "@/game/state/BuildCityState.ts";
import {WaitingState} from "@/game/state/WaitingState.ts";
import type {GameEvent} from "@/game/model/events.ts";

export class StateTransitionService {

    public static getNextStateFromButton(type: ButtonType, game: GameState, playerId: string): GameStateHandler | null {
        switch (type) {
            case ButtonType.putRoad:
                return new BuildRoadState();
            case ButtonType.putSettlement:
                return new BuildSettlementState();
            case ButtonType.putCity:
                return new BuildCityState();
            case ButtonType.waiting:
                return new WaitingState();
            case ButtonType.endTurn:
                // Handled by GameLoop to emit event
                return null;
            default:
                return null;
        }
    }

    public static getNextStateFromEvent(event: GameEvent, game: GameState, localPlayerId: string, isMyTurn: boolean): GameStateHandler | null {
        switch (event.type) {
            case EventType.EndTurn:
                if (isMyTurn) {
                    // In Hotseat, we switch identity, so isMyTurn becomes true immediately.
                    // We should enter the appropriate state for the new player/phase.
                    
                    if (game.phase === GamePhase.SetupSettlement) {
                        return new BuildSettlementState();
                    }
                    
                    return new DefaultState();
                } else {
                    return new WaitingState();
                }

            case EventType.BuildSettlement:
                // If we just built a settlement in Setup, we might need to place a road immediately
                if (isMyTurn && game.phase === GamePhase.SetupRoad) {
                    return new BuildRoadState();
                }
                return new DefaultState();

            case EventType.BuildRoad:
            case EventType.BuildCity:
            case EventType.BuyDevelopmentCard:
            case EventType.RollDice:
            case EventType.TransferResources:
                // Usually return to DefaultState to allow next action
                return isMyTurn ? new DefaultState() : null;

            default:
                return null;
        }
    }
}