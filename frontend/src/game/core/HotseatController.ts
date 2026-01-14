import type {
    BuildCityEvent,
    BuildRoadEvent,
    BuildSettlementEvent,
    BuyDevelopmentCardEvent,
    GameEvent,
    GameErrorEvent,
    InitializeGameEvent,
    RollDiceEvent,
    RobberTriggeredEvent,
    TransferResourcesEvent
} from "@/game/model/events.ts";
import {EventType, GamePhase, ResourceType} from "@/game/model/enums.ts";
import type {GameState} from "@/game/model/types.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {BoardService} from "@/game/logic/BoardService.ts";
import {TEST_GAMESTATE} from "@/game/model/testGame.ts";
import {ResourceService} from "@/game/logic/ResourceService.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";

export class HotseatController {
    private emit: (event: GameEvent) => void;

    constructor(emit: (event: GameEvent) => void) {
        this.emit = emit;
    }

    public requestInitialState() {
        const event: InitializeGameEvent = {
            type: EventType.InitializeGame,
            playerId: "Server",
            gameState: TEST_GAMESTATE
        };
        this.emit(event);
    }

    public handleEvent(game: GameState, event: GameEvent) {
        // 1. Validate Phase
        if (!ActionValidator.isActionAllowed(game.phase, event.type, game.phaseConfig)) {
            this.emitError(event, "ACTION_NOT_ALLOWED", `Action ${event.type} is not allowed in phase ${game.phase}`);
            return;
        }

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
                if (!GameRuleService.canEndTurn(game, event.playerId)) {
                    this.emitError(event, "CANNOT_END_TURN", "You must complete your actions (e.g. place a road) before ending your turn.");
                    return;
                }
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

        this.processCost(game, event.playerId, EventType.BuildRoad);
        this.emit(event);
    }

    private handleBuildSettlement(game: GameState, event: BuildSettlementEvent) {
        if (!GameRuleService.canBuildSettlement(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to build a settlement.");
            return;
        }
        const checkConnection = game.phase !== GamePhase.SetupSettlement;
        if (!BoardService.canPlaceSettlement(game.board, event.vertex, event.playerId, checkConnection)) {
            this.emitError(event, "INVALID_PLACEMENT", "Cannot place a settlement here.");
            return;
        }

        this.processCost(game, event.playerId, EventType.BuildSettlement);
        this.emit(event);

        // Handle Setup Phase Resource Granting
        if (GameRuleService.shouldDistributeSetupResources(game)) {
            const resources = BoardService.getResourcesForVertex(game.board, event.vertex);
            this.emitTransfer("Bank", event.playerId, resources);
        }
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

        this.processCost(game, event.playerId, EventType.BuildCity);
        this.emit(event);
    }

    private handleBuyDevelopmentCard(game: GameState, event: BuyDevelopmentCardEvent) {
        if (!GameRuleService.canBuyDevelopmentCard(game, event.playerId)) {
            this.emitError(event, "INSUFFICIENT_RESOURCES", "Not enough resources to buy a development card.");
            return;
        }
        // Note: Add deck empty check here if/when DeckService exists

        this.processCost(game, event.playerId, EventType.BuyDevelopmentCard);
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

        const total = d1 + d2;
        
        // Check for Robber (7)
        if (total === 7) {
            const robberEvent: RobberTriggeredEvent = {
                type: EventType.RobberTriggered,
                playerId: event.playerId
            };
            this.emit(robberEvent);
        } else {
            // Distribute Resources
            const transfers = ResourceService.calculateDistribution(game, total);
            transfers.forEach(t => this.emit(t));
        }
    }

    private processCost(game: GameState, playerId: string, eventType: EventType) {
        const cost = GameRuleService.getActionCost(game, eventType);
        if (Object.keys(cost).length > 0) {
            this.emitTransfer(playerId, "Bank", cost);
        }
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