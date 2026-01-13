import {EventType} from "@/game/model/enums.ts";
import type {
    BuildCityEvent,
    BuildRoadEvent,
    BuildSettlementEvent,
    BuyDevelopmentCardEvent,
    EndTurnEvent,
    GameEvent,
    RollDiceEvent,
    TransferResourcesEvent
} from "@/game/model/events.ts";
import type {GameState} from "@/game/model/types.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {BuildingType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";
import {ResourceType} from "@/game/model/enums.ts";

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
            state.hasRolledDice = false;
        },
        [EventType.RollDice]: (state, event: RollDiceEvent) => {
            let d1, d2;
            if (event.dice) {
                [d1, d2] = event.dice;
            } else {
                d1 = Math.floor(Math.random() * 6) + 1;
                d2 = Math.floor(Math.random() * 6) + 1;
            }
            state.dices = [d1, d2];
            state.hasRolledDice = true;
            Logger.info({dices: state.dices}, "Dice Rolled");
        },
        [EventType.BuyDevelopmentCard]: (state, event: BuyDevelopmentCardEvent) => {
            Logger.warn("BuyDevelopmentCard not implemented yet");
        },
        [EventType.TransferResources]: (state, event: TransferResourcesEvent) => {
            // 1. Remove from Source
            if (event.fromPlayerId !== "Bank") {
                const fromPlayer = PlayerService.getPlayer(state, event.fromPlayerId);
                if (fromPlayer) {
                    if (event.resources) {
                        // We know exactly what was removed
                        Object.entries(event.resources).forEach(([res, amount]) => {
                            const type = res as ResourceType;
                            const current = fromPlayer.inventory.resources[type] || 0;
                            const toRemove = amount as number;
                            
                            // If we have enough known resources, remove them
                            // If not, we assume the rest came from the hidden pile
                            if (current >= toRemove) {
                                fromPlayer.inventory.resources[type] = current - toRemove;
                            } else {
                                fromPlayer.inventory.resources[type] = 0;
                                fromPlayer.inventory.hiddenCount -= (toRemove - current);
                            }
                        });
                    } else if (event.count) {
                        // Blind remove (e.g. someone stole from them, and we don't know what)
                        fromPlayer.inventory.hiddenCount -= event.count;
                    }
                }
            }

            // 2. Add to Target
            if (event.toPlayerId !== "Bank") {
                const toPlayer = PlayerService.getPlayer(state, event.toPlayerId);
                if (toPlayer) {
                    if (event.resources) {
                        Object.entries(event.resources).forEach(([res, count]) => {
                            toPlayer.inventory.resources[res as ResourceType] += (count as number);
                        });
                    } else if (event.count) {
                        toPlayer.inventory.hiddenCount += event.count;
                    }
                }
            }
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