import type {
    BuildCityEvent,
    BuildRoadEvent,
    BuildSettlementEvent,
    BuyDevelopmentCardEvent,
    GameEvent,
    GameErrorEvent,
    InitializeGameEvent,
    RollDiceEvent,
    TransferResourcesEvent
} from "@/game/model/events.ts";
import {EventType, ResourceType} from "@/game/model/enums.ts";
import type {GameState} from "@/game/model/types.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import gameRules from "@/game/config/gameRules.json";
import {TEST_GAMESTATE} from "@/game/model/testGame.ts";

export class HotseatController {
    private emit: (event: GameEvent) => void;

    constructor(emit: (event: GameEvent) => void) {
        this.emit = emit;
    }

    public requestInitialState() {
        const event: InitializeGameEvent = {
            type: EventType.InitializeGame,
            playerId: "Server",
            gameState: TEST_GAMESTATE // In the future, this comes from MapGenerator
        };
        this.emit(event);
    }

    public handleEvent(game: GameState, event: GameEvent) {
        switch (event.type) {
            case EventType.BuildRoad:
                this.handleBuildRoad(game, event as BuildRoadEvent);
                break;
            case EventType.BuildSettlement:
                this.handleBuildSettlement(game, event as BuildSettlementEvent);
                break;
            case EventType.BuildCity:
                this.handleBuildCity(game, event as BuildCityEvent);
                break;
            case EventType.BuyDevelopmentCard:
                this.handleBuyDevelopmentCard(game, event as BuyDevelopmentCardEvent);
                break;
            case EventType.RollDice:
                this.handleRollDice(game, event as RollDiceEvent);
                break;
            case EventType.EndTurn:
                this.emit(event);
                break;
            default:
                // Pass through other events or ignore
                this.emit(event);
                break;
        }
    }

    private handleBuildRoad(game: GameState, event: BuildRoadEvent) {
        if (!GameRuleService.canBuildRoad(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to build a road.");
            return;
        }
        if (!BoardService.canPlaceRoad(game.board, event.edge, event.playerId)) {
            this.emitError(event, "INVALID_PLACEMENT", "Cannot place a road here.");
            return;
        }

        this.emitTransfer(event.playerId, "Bank", gameRules.costs.road);
        this.emit(event);
    }

    private handleBuildSettlement(game: GameState, event: BuildSettlementEvent) {
        if (!GameRuleService.canBuildSettlement(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to build a settlement.");
            return;
        }
        if (!BoardService.canPlaceSettlement(game.board, event.vertex, event.playerId)) {
            this.emitError(event, "INVALID_PLACEMENT", "Cannot place a settlement here.");
            return;
        }

        this.emitTransfer(event.playerId, "Bank", gameRules.costs.settlement);
        this.emit(event);
    }

    private handleBuildCity(game: GameState, event: BuildCityEvent) {
        if (!GameRuleService.canBuildCity(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to build a city.");
            return;
        }
        if (!BoardService.canPlaceCity(game.board, event.vertex, event.playerId)) {
            this.emitError(event, "INVALID_PLACEMENT", "Cannot place a city here.");
            return;
        }

        this.emitTransfer(event.playerId, "Bank", gameRules.costs.city);
        this.emit(event);
    }

    private handleBuyDevelopmentCard(game: GameState, event: BuyDevelopmentCardEvent) {
        if (!GameRuleService.canBuyDevelopmentCard(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to buy a development card.");
            return;
        }
        // Note: Add deck empty check here if/when DeckService exists

        this.emitTransfer(event.playerId, "Bank", gameRules.costs.developmentCard);
        this.emit(event);
    }

    private handleRollDice(game: GameState, event: RollDiceEvent) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        
        const response: RollDiceEvent = {
            ...event,
            dice: [d1, d2]
        };
        this.emit(response);
    }

    private emitTransfer(from: string, to: string, resources: Record<string, number>) {
        const event: TransferResourcesEvent = {
            type: EventType.TransferResources,
            playerId: "Server",
            fromPlayerId: from,
            toPlayerId: to,
            resources: resources as Record<ResourceType, number>
        };
        this.emit(event);
    }

    private emitError(originalEvent: GameEvent, code: string, message: string) {
        const errorEvent: GameErrorEvent = {
            type: EventType.Error,
            playerId: originalEvent.playerId,
            code: code,
            message: message,
            originalEventType: originalEvent.type
        };
        this.emit(errorEvent);
    }
}