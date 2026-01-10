import {EventType} from "@/game/model/enums.ts";
import type {
    BuildCityEvent,
    BuildRoadEvent,
    BuildSettlementEvent,
    BuyDevelopmentCardEvent,
    EndTurnEvent,
    GameEvent,
    RollDiceEvent
} from "@/game/model/events.ts";
import type {GameState} from "@/game/model/types.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {BuildingType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

type EventHandler<T extends GameEvent> = (state: GameState, event: T) => void;

export class GameEventProcessor {
    private static handlers: Partial<Record<EventType, EventHandler<any>>> = {
        [EventType.BuildRoad]: (state, event: BuildRoadEvent) => {
            BoardService.putRoad(state.board, {
                edge: event.edge,
                playerName: event.playerId
            });
        },
        [EventType.BuildSettlement]: (state, event: BuildSettlementEvent) => {
            BoardService.putBuilding(state.board, {
                vertex: event.vertex,
                type: BuildingType.Settlement,
                playerName: event.playerId
            });
        },
        [EventType.BuildCity]: (state, event: BuildCityEvent) => {
            BoardService.putBuilding(state.board, {
                vertex: event.vertex,
                type: BuildingType.City,
                playerName: event.playerId
            });
        },
        [EventType.EndTurn]: (state, event: EndTurnEvent) => {
            const currentIndex = state.players.findIndex(p => p.isActive);
            if (currentIndex !== -1) {
                state.players[currentIndex].isActive = false;
                const nextIndex = (currentIndex + 1) % state.players.length;
                state.players[nextIndex].isActive = true;
            }
        },
        [EventType.RollDice]: (state, event: RollDiceEvent) => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            state.dices = [d1, d2];
            Logger.info({dices: state.dices}, "Dice Rolled");
        },
        [EventType.BuyDevelopmentCard]: (state, event: BuyDevelopmentCardEvent) => {
            Logger.warn("BuyDevelopmentCard not implemented yet");
        }
    };

    public static process(state: GameState, event: GameEvent) {
        const handler = this.handlers[event.type];
        if (handler) {
            handler(state, event);
            Logger.debug({ type: event.type }, "Processed Event");
        } else {
            Logger.warn({ type: event.type }, "No handler for event type");
        }
    }
}