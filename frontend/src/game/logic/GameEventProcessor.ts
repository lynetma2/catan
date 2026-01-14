import {BuildingType, EventType, GamePhase, ResourceType} from "@/game/model/enums.ts";
import type {
    BuildCityEvent,
    BuildRoadEvent,
    BuildSettlementEvent,
    BuyDevelopmentCardEvent,
    EndTurnEvent,
    GameEvent,
    MoveRobberEvent,
    RobberTriggeredEvent,
    RollDiceEvent,
    TransferResourcesEvent
} from "@/game/model/events.ts";
import type {GameState} from "@/game/model/types.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {Logger} from "@/game/utils/Logger.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";

export class GameEventProcessor {

    public static process(state: GameState, event: GameEvent) {
        Logger.debug({ type: event.type }, "Processing Event");

        switch (event.type) {
            case EventType.BuildRoad:
                this.handleBuildRoad(state, event as BuildRoadEvent);
                break;
            case EventType.BuildSettlement:
                this.handleBuildSettlement(state, event as BuildSettlementEvent);
                break;
            case EventType.BuildCity:
                this.handleBuildCity(state, event as BuildCityEvent);
                break;
            case EventType.EndTurn:
                this.handleEndTurn(state, event as EndTurnEvent);
                break;
            case EventType.MoveRobber:
                this.handleMoveRobber(state, event as MoveRobberEvent);
                break;
            case EventType.RobberTriggered:
                // No state change needed
                break;
            case EventType.RollDice:
                this.handleRollDice(state, event as RollDiceEvent);
                break;
            case EventType.BuyDevelopmentCard:
                this.handleBuyDevelopmentCard(state, event as BuyDevelopmentCardEvent);
                break;
            case EventType.TransferResources:
                this.handleTransferResources(state, event as TransferResourcesEvent);
                break;
            case EventType.StealResource:
                this.handleStealResource(state);
                break;
            default:
                Logger.warn({ type: event.type }, "No handler for event type");
                break;
        }
    }

    private static handleBuildRoad(state: GameState, event: BuildRoadEvent) {
        BoardService.putRoad(state.board, {
            edge: event.edge,
            playerName: event.playerId
        });

        if (state.phase === GamePhase.SetupSettlement) {
            state.phase = GamePhase.FinishSetupBuild;
        }
    }

    private static handleBuildSettlement(state: GameState, event: BuildSettlementEvent) {
        BoardService.putBuilding(state.board, {
            vertex: event.vertex,
            type: BuildingType.Settlement,
            playerName: event.playerId
        });

        if (state.phase === GamePhase.SetupSettlement) {
            state.phase = GamePhase.SetupRoad;
        }
    }

    private static handleBuildCity(state: GameState, event: BuildCityEvent) {
        BoardService.putBuilding(state.board, {
            vertex: event.vertex,
            type: BuildingType.City,
            playerName: event.playerId
        });
    }

    private static handleEndTurn(state: GameState, event: EndTurnEvent) {
        state.turn++;
        const totalPlayers = state.players.length;
        const totalSetupTurns = totalPlayers * 2;

        this.updateGamePhase(state, totalSetupTurns);
        this.updateActivePlayer(state, totalPlayers, totalSetupTurns);
    }

    private static updateGamePhase(state: GameState, totalSetupTurns: number) {
        if (state.turn < totalSetupTurns) {
            state.phase = GamePhase.SetupSettlement;
        } else {
            state.phase = GamePhase.PreRoll;
        }
    }

    private static updateActivePlayer(state: GameState, totalPlayers: number, totalSetupTurns: number) {
        state.players.forEach(p => p.isActive = false);
        let nextPlayerIndex = 0;

        if (state.turn < totalSetupTurns) {
            // Setup Phase: Snake Draft (1-2-3-3-2-1)
            if (state.turn < totalPlayers) {
                nextPlayerIndex = state.turn;
            } else {
                nextPlayerIndex = (2 * totalPlayers - 1) - state.turn;
            }
        } else {
            // Main Game: Round Robin
            nextPlayerIndex = (state.turn - totalSetupTurns) % totalPlayers;
        }

        if (state.players[nextPlayerIndex]) {
            state.players[nextPlayerIndex].isActive = true;
        }
    }

    private static handleMoveRobber(state: GameState, event: MoveRobberEvent) {
        state.board.robber = event.hex;
        state.phase = GamePhase.Stealing;
    }

    private static handleRollDice(state: GameState, event: RollDiceEvent) {
        let d1, d2;
        if (event.dice) {
            [d1, d2] = event.dice;
        } else {
            d1 = Math.floor(Math.random() * 6) + 1;
            d2 = Math.floor(Math.random() * 6) + 1;
        }
        state.dices = [d1, d2];
        Logger.info({dices: state.dices}, "Dice Rolled");

        if (d1 + d2 === 7) {
            state.phase = GamePhase.RobberPlacement;
        } else {
            state.phase = GamePhase.Main;
        }
    }

    private static handleBuyDevelopmentCard(state: GameState, event: BuyDevelopmentCardEvent) {
        Logger.warn("BuyDevelopmentCard not implemented yet");
    }

    private static handleTransferResources(state: GameState, event: TransferResourcesEvent) {
        if (event.fromPlayerId !== "Bank") {
            this.updatePlayerResources(state, event.fromPlayerId, event.resources, event.count, false);
        }
        if (event.toPlayerId !== "Bank") {
            this.updatePlayerResources(state, event.toPlayerId, event.resources, event.count, true);
        }
    }

    private static updatePlayerResources(
        state: GameState,
        playerId: string,
        resources: Record<string, number> | undefined,
        count: number | undefined,
        isAdding: boolean
    ) {
        const player = PlayerService.getPlayer(state, playerId);
        if (!player) return;

        if (resources) {
            Object.entries(resources).forEach(([res, amount]) => {
                const type = res as ResourceType;
                const val = amount as number;
                if (isAdding) {
                    player.inventory.resources[type] += val;
                } else {
                    const current = player.inventory.resources[type] || 0;
                    if (current >= val) {
                        player.inventory.resources[type] = current - val;
                    } else {
                        player.inventory.resources[type] = 0;
                        player.inventory.hiddenCount -= (val - current);
                    }
                }
            });
        } else if (count) {
            if (isAdding) {
                player.inventory.hiddenCount += count;
            } else {
                player.inventory.hiddenCount -= count;
            }
        }
    }

    private static handleStealResource(state: GameState) {
        state.phase = GamePhase.Main;
    }
}