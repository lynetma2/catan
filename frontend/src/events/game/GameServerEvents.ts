import {DOT_SEPARATOR, SERVER} from "@/events/shared/RootEventNamespaces.ts";
import type {DeepValues, EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import {
    type DevCardSnapshot,
    type EndGameSummary,
    GamePhase,
    type GameSnapshot,
    type PieceType,
    type Resource,
    ResourceType
} from "@/game/core/types.ts";
import {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {TradeOfferDTO, TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";

export const GAME_SERVER = `${SERVER}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}` as const;
export const BUILD_GAME_SERVER = `${GAME_SERVER}build${DOT_SEPARATOR}` as const;
export const DICE_GAME_SERVER = `${GAME_SERVER}dice${DOT_SEPARATOR}` as const;
export const OVERVIEW_GAME_SERVER = `${GAME_SERVER}state${DOT_SEPARATOR}overview${DOT_SEPARATOR}` as const;
export const RESOURCE_GAME_SERVER = `${GAME_SERVER}resource${DOT_SEPARATOR}` as const;
export const TURN_GAME_SERVER = `${GAME_SERVER}turn${DOT_SEPARATOR}` as const;
export const ROBBER_GAME_SERVER = `${GAME_SERVER}robber${DOT_SEPARATOR}` as const;
export const STATE_GAME_SERVER = `${GAME_SERVER}state${DOT_SEPARATOR}` as const;
export const TRADE_GAME_SERVER = `${GAME_SERVER}trade${DOT_SEPARATOR}` as const;
export const DEVELOPMENT_CARD_GAME_SERVER = `${GAME_SERVER}developmentCard${DOT_SEPARATOR}` as const;
export const PLAY_DEVELOPMENT_CARD_GAME_SERVER = `${GAME_SERVER}developmentCard${DOT_SEPARATOR}play${DOT_SEPARATOR}` as const;
export const PUBLIC_TRADE_GAME_SERVER = `${TRADE_GAME_SERVER}public${DOT_SEPARATOR}` as const;

export const GameServerEvents = {
    state: {
        full: {
            success: `${STATE_GAME_SERVER}full`,
        },
        end: {
            success: `${STATE_GAME_SERVER}end`,
        },
        phase: {
            change: {
                success: `${STATE_GAME_SERVER}phase.change`,
            }
        },
        overview: {
            largestArmy: {
                success: `${OVERVIEW_GAME_SERVER}largestArmy.change`,
            },
            armySize: {
                success: `${OVERVIEW_GAME_SERVER}armySize.change`,
            },
            longestRoad: {
                success: `${OVERVIEW_GAME_SERVER}longestRoad.change`,
            },
            roadLength: {
                success: `${OVERVIEW_GAME_SERVER}roadLength.change`,
            },
            victoryPoint: {
                success: `${OVERVIEW_GAME_SERVER}victoryPoints.change`,
            },
            developmentCard: {
                success: `${OVERVIEW_GAME_SERVER}developmentCard.change`,
            },
            resource: {
                success: `${OVERVIEW_GAME_SERVER}resource.change`,
            }
        },
    },
    build: {
        settlement: {
            success: `${BUILD_GAME_SERVER}settlement`,
            rejected: `${BUILD_GAME_SERVER}settlement.rejected`,
        },
        road: {
            success: `${BUILD_GAME_SERVER}road`,
            rejected: `${BUILD_GAME_SERVER}road.rejected`,
        },
        city: {
            success: `${BUILD_GAME_SERVER}city`,
            rejected: `${BUILD_GAME_SERVER}city.rejected`,
        },
    },
    dice: {
        roll: {
            success: `${DICE_GAME_SERVER}roll`,
            rejected: `${DICE_GAME_SERVER}roll.rejected`,
        }
    },
    resource: {
        grant: {
            success: `${RESOURCE_GAME_SERVER}grant`,
        },
        spent: {
            success: `${RESOURCE_GAME_SERVER}spent`,
        },
        discardRequired: {
            success: `${RESOURCE_GAME_SERVER}discardRequired`,
        },
        discardCards: {
            success: `${RESOURCE_GAME_SERVER}discardCards`,
        },
        discardComplete: {
            success: `${RESOURCE_GAME_SERVER}discardComplete`,
        }
    },
    turn: {
        end: {
            success: `${TURN_GAME_SERVER}end`,
        },
        start: {
            success: `${TURN_GAME_SERVER}start`,
        }
    },
    robber: {
        placed: {
            success: `${ROBBER_GAME_SERVER}place`
        },
        stealTargetRequired: {
            success: `${ROBBER_GAME_SERVER}stealTargetRequired`,
        }
    },
    trade: {
        bank: {
            success: `${TRADE_GAME_SERVER}bank`,
        },
        public: {
            start: {
                success: `${PUBLIC_TRADE_GAME_SERVER}start`,
            },
            cancel: {
                success: `${PUBLIC_TRADE_GAME_SERVER}cancel`,
            },
            confirm: {
                success: `${PUBLIC_TRADE_GAME_SERVER}confirm`,
            },
            responderAccept: {
                success: `${PUBLIC_TRADE_GAME_SERVER}accept`,
            },
            responderDecline: {
                success: `${PUBLIC_TRADE_GAME_SERVER}decline`,
            },
        },
    },
    developmentCard: {
        draw: {
            success: `${DEVELOPMENT_CARD_GAME_SERVER}draw`
        },
        spent: {
            success: `${DEVELOPMENT_CARD_GAME_SERVER}spent`
        },
        play: {
            monopoly: {
                success: `${PLAY_DEVELOPMENT_CARD_GAME_SERVER}monopoly`,
            },
            yearOfPlenty: {
                success: `${PLAY_DEVELOPMENT_CARD_GAME_SERVER}yearOfPlenty`,
            },
        }
    },
    error: {
        success: `${GAME_SERVER}error`,
    }
} as const;

export interface GameServerEventMap {
    [GameServerEvents.state.full.success]: {
        lobbyId: string;
        snapshot: GameSnapshot;
        localPlayerId: string;
    };
    [GameServerEvents.state.end.success]: { endSummary: EndGameSummary };
    [GameServerEvents.state.phase.change.success]: { phase: GamePhase };
    [GameServerEvents.build.settlement.success]: { pieceType: PieceType; vertex: Vertex; playerId: string };
    [GameServerEvents.build.settlement.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.build.road.success]: { pieceType: PieceType; edge: Edge; playerId: string };
    [GameServerEvents.build.road.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.build.city.success]: { pieceType: PieceType; vertex: Vertex; playerId: string };
    [GameServerEvents.build.city.rejected]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameServerEvents.dice.roll.success]: { diceRoll: { values: [number, number] } };
    [GameServerEvents.dice.roll.rejected]: { reason: string };
    [GameServerEvents.state.overview.armySize.success]: { playerId: string, armySize: number };
    [GameServerEvents.state.overview.largestArmy.success]: { playerId: string, hasLargestArmy: boolean };
    [GameServerEvents.state.overview.longestRoad.success]: { playerId: string, hasLongestRoad: boolean };
    [GameServerEvents.state.overview.roadLength.success]: { playerId: string, longestRoadLength: number };
    [GameServerEvents.state.overview.victoryPoint.success]: { playerId: string, victoryPoints: number };
    [GameServerEvents.state.overview.developmentCard.success]: { playerId: string, developmentCards: number };
    [GameServerEvents.state.overview.resource.success]: { playerId: string, resourceCards: number };
    [GameServerEvents.resource.grant.success]: { playerId: string; resources: Resource[] };
    [GameServerEvents.resource.spent.success]: { playerId: string; resources: Resource[] };
    [GameServerEvents.resource.discardRequired.success]: { playerId: string, amount: number };
    [GameServerEvents.resource.discardCards.success]: { playerId: string, resources: Resource[] };
    [GameServerEvents.resource.discardComplete.success]: { playerId: string };
    [GameServerEvents.turn.end.success]: { playerId: string };
    [GameServerEvents.turn.start.success]: { playerId: string, turnNumber: number };
    [GameServerEvents.robber.placed.success]: { playerId: string, hex: Hex };
    [GameServerEvents.robber.stealTargetRequired.success]: { retrievingPlayerId: string, candidates: string[] };
    [GameServerEvents.trade.bank.success]: {
        playerId: string;
        given: Resource[];
        received: Resource[];
    };
    [GameServerEvents.trade.public.start.success]: {
        tradeOfferDTO: TradeOfferDTO;
    };
    [GameServerEvents.trade.public.cancel.success]: { tradeId: string };
    [GameServerEvents.trade.public.confirm.success]: {
        tradeId: string;
        ownerId: string;
        respondentId: string;
    };
    [GameServerEvents.trade.public.responderAccept.success]: {
        tradeId: string;
        playerId: string;
        response: TradeOfferResponseKind
    };
    [GameServerEvents.trade.public.responderDecline.success]: {
        tradeId: string;
        playerId: string;
        response: TradeOfferResponseKind
    };
    [GameServerEvents.developmentCard.draw.success]: { card: DevCardSnapshot };
    [GameServerEvents.developmentCard.spent.success]: { playerId: string, cardId: string };
    [GameServerEvents.developmentCard.play.monopoly.success]: { playerId: string, resourceType: ResourceType };
    [GameServerEvents.developmentCard.play.yearOfPlenty.success]: {
        playerId: string,
        firstResource: ResourceType,
        secondResource: ResourceType
    };
    [GameServerEvents.error.success]: { errorCode: string, message: string, details: Record<string, unknown> };
}

export type GameServerEventValues =
    DeepValues<typeof GameServerEvents>;

export type GameServerEvent =
    EventUnion<GameServerEventMap>;