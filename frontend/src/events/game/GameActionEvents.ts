import {ACTION, DOT_SEPARATOR} from "@/events/shared/RootEventNamespaces.ts";
import type {EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import {type Resource, ResourceType} from "@/game/core/types.ts";

export const GAME_ACTION = `${ACTION}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}`;
export const BUILD_GAME_ACTION = `${GAME_ACTION}build${DOT_SEPARATOR}`;
export const DEVELOPMENT_CARD_GAME_ACTION = `${GAME_ACTION}developmentCard${DOT_SEPARATOR}`;
export const PLAY_DEVELOPMENT_CARD_GAME_ACTION = `${GAME_ACTION}developmentCard${DOT_SEPARATOR}play${DOT_SEPARATOR}`;
export const TURN_GAME_ACTION = `${GAME_ACTION}turn${DOT_SEPARATOR}`;
export const ROBBER_GAME_ACTION = `${GAME_ACTION}robber${DOT_SEPARATOR}`;
export const RESOURCE_GAME_ACTION = `${GAME_ACTION}resource${DOT_SEPARATOR}`;
export const TRADE_GAME_ACTION = `${GAME_ACTION}trade${DOT_SEPARATOR}`;
export const PUBLIC_TRADE_GAME_ACTION = `${TRADE_GAME_ACTION}public${DOT_SEPARATOR}`;

export const GameActionEvents = {
    state: `${GAME_ACTION}state`,
    diceRoll: `${GAME_ACTION}dice${DOT_SEPARATOR}roll`,
    build: {
        settlement: `${BUILD_GAME_ACTION}settlement`,
        road: `${BUILD_GAME_ACTION}road`,
        city: `${BUILD_GAME_ACTION}city`,
    },
    developmentCard: {
        draw: `${DEVELOPMENT_CARD_GAME_ACTION}draw`,
        play: {
            knight: `${PLAY_DEVELOPMENT_CARD_GAME_ACTION}knight`,
            monopoly: `${PLAY_DEVELOPMENT_CARD_GAME_ACTION}monopoly`,
            roadBuilding: `${PLAY_DEVELOPMENT_CARD_GAME_ACTION}roadBuilding`,
            yearOfPlenty: `${PLAY_DEVELOPMENT_CARD_GAME_ACTION}yearOfPlenty`,
        }
    },
    turn: {
        end: `${TURN_GAME_ACTION}end`,
    },
    robber: {
        place: `${ROBBER_GAME_ACTION}place`,
        steal: `${ROBBER_GAME_ACTION}steal`,
    },
    resource: {
        discard: `${RESOURCE_GAME_ACTION}discard`,
    },
    trade: {
        bank: `${TRADE_GAME_ACTION}bank`,
        public: {
            start: `${PUBLIC_TRADE_GAME_ACTION}start`,
            cancel: `${PUBLIC_TRADE_GAME_ACTION}cancel`,
            confirm: `${PUBLIC_TRADE_GAME_ACTION}confirm`,
            accept: `${PUBLIC_TRADE_GAME_ACTION}accept`,
            decline: `${PUBLIC_TRADE_GAME_ACTION}decline`,
        },
    },
} as const;

// Flat event map – each leaf event name maps to its payload type
export interface GameActionEventMap {
    [GameActionEvents.state]: Record<never, never>;
    [GameActionEvents.diceRoll]: Record<never, never>;
    [GameActionEvents.build.settlement]: { target: Vertex };
    [GameActionEvents.build.road]: { target: Edge };
    [GameActionEvents.build.city]: { target: Vertex };
    [GameActionEvents.developmentCard.draw]: Record<never, never>;
    [GameActionEvents.developmentCard.play.knight]: { cardId: string };
    [GameActionEvents.developmentCard.play.monopoly]: { cardId: string, resourceType: ResourceType };
    [GameActionEvents.developmentCard.play.roadBuilding]: { cardId: string };
    [GameActionEvents.developmentCard.play.yearOfPlenty]: {
        cardId: string,
        firstResource: ResourceType,
        secondResource: ResourceType
    };
    [GameActionEvents.turn.end]: Record<never, never>;
    [GameActionEvents.robber.place]: { target: Hex };
    [GameActionEvents.robber.steal]: { targetPlayerId: string };
    [GameActionEvents.resource.discard]: { discardedResources: string[] };
    [GameActionEvents.trade.bank]: { givenResources: Resource[]; wantedResourceType: ResourceType[] };
    [GameActionEvents.trade.public.start]: {
        offering: Resource[];
        wanted: ResourceType[];
    };
    [GameActionEvents.trade.public.cancel]: { tradeId: string };
    [GameActionEvents.trade.public.confirm]: { tradeId: string; responderId: string };
    [GameActionEvents.trade.public.accept]: { tradeId: string };
    [GameActionEvents.trade.public.decline]: { tradeId: string };
}

export type GameActionEvent = EventUnion<GameActionEventMap>;

export const GameActionEventCreators = {
    state() {
        return {
            type: GameActionEvents.state,
            payload: {},
        }
    },
    diceRoll() {
        return {
            type: GameActionEvents.diceRoll,
            payload: {},
        }
    },
    placeSettlement(target: Vertex) {
        return {
            type: GameActionEvents.build.settlement,
            payload: {
                target,
            },
        }
    },
    placeRoad(target: Edge) {
        return {
            type: GameActionEvents.build.road,
            payload: {
                target,
            },
        }
    },
    placeCity(target: Vertex) {
        return {
            type: GameActionEvents.build.city,
            payload: {
                target,
            },
        }
    },
    placeRobber(target: Hex) {
        return {
            type: GameActionEvents.robber.place,
            payload: {
                target,
            }
        }
    },
    drawDevelopmentCard() {
        return {
            type: GameActionEvents.developmentCard.draw,
            payload: {},
        }
    },
    playKnight(cardId: string) {
        return {
            type: GameActionEvents.developmentCard.play.knight,
            payload: {
                cardId,
            }
        }
    },
    playMonopoly(cardId: string, resourceType: ResourceType) {
        return {
            type: GameActionEvents.developmentCard.play.monopoly,
            payload: {
                cardId,
                resourceType,
            }
        }
    },
    playRoadBuilding(cardId: string) {
        return {
            type: GameActionEvents.developmentCard.play.roadBuilding,
            payload: {
                cardId,
            }
        }
    },
    playYearOfPlenty(cardId: string, firstResource: ResourceType, secondResource: ResourceType) {
        return {
            type: GameActionEvents.developmentCard.play.knight,
            payload: {
                cardId,
                firstResource,
                secondResource,
            }
        }
    },
    endTurn() {
        return {
            type: GameActionEvents.turn.end,
            payload: {},
        }
    },
    discard(discardedResources: string[]) {
        return {
            type: GameActionEvents.resource.discard,
            payload: {
                discardedResources,
            },
        }
    },
    bankTrade(givenResources: Resource[], wanted: ResourceType[]) {
        return {
            type: GameActionEvents.trade.bank,
            payload: {givenResources, wanted}
        };
    },
    startPublicTrade(offered: Resource[], wanted: ResourceType[]) {
        return {
            type: GameActionEvents.trade.public.start,
            payload: {offered, wanted}
        };
    },
    cancelPublicTrade(tradeId: string) {
        return {
            type: GameActionEvents.trade.public.cancel,
            payload: {tradeId}
        };
    },
    confirmPublicTrade(tradeId: string, responderId: string) {
        return {
            type: GameActionEvents.trade.public.confirm,
            payload: {tradeId, responderId}
        };
    },
    acceptPublicTrade(tradeId: string) {
        return {
            type: GameActionEvents.trade.public.accept,
            payload: {tradeId}
        };
    },
    declinePublicTrade(tradeId: string) {
        return {
            type: GameActionEvents.trade.public.decline,
            payload: {tradeId}
        };
    },
} as const;