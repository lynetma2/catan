// All Game Events currently defined
/*
----------TURN LIFECYCLE EVENTS---------
 */
export interface TurnStartEvent {
    type: "TurnStartEvent";
    newActivePlayer: string;
}

export interface TurnEndTryEvent {
    type: "TurnEndTryEvent";
    activePlayer: string;
}

export interface TurnEndedEvent {
    type: "TurnEndedEvent";
    activePlayer: string;
}

export interface RollDiceTryEvent {
    type: "RollDiceTryEvent";
    activePlayer: string;
}

export interface RolledDiceEvent {
    type: "RolledDiceEvent";
    activePlayer: string;
    dice: number[]
}

export interface DistributeResourcesTryEvent {
    type: "DistributeResourcesTryEvent";
    distribution: [{
        player: string;
        resources: string;
    }]
}

export interface DistributedResourcesEvent {
    type: "DistributedResourcesEvent";
    distribution: [{
        player: string;
        resources: string;
    }]
}

/*
---------TURN ACTION EVENTS---------
 */
export interface BuildStructureTryEvent {
    type: "BuildStructureTryEvent";
    activePlayer: string;
    structure: "ROAD" | "SETTLEMENT" | "CITY";
    coordinates: string; //TODO make this part more robust
}

export interface BuiltStructureEvent {
    type: "BuiltStructureEvent";
    activePlayer: string;
    coordinates: string;
}

export interface BuyDevelopmentCardTryEvent {
    type: "BuyDevelopmentCardTryEvent";
    activePlayer: string;
}

export interface BoughtDevelopmentCardEvent {
    type: "BoughtDevelopmentCardTryEvent";
    activePlayer: string;
    developmentCard: string;
}

export interface PlayDevelopmentCardTryEvent {
    type: "PlayDevelopmentCardTryEvent";
    activePlayer: string;
    developmentCard: string;
}

export interface PlayedDevelopmentCardEvent {
    type: "PlayedDevelopmentCardTryEvent";
    activePlayer: string;
    developmentCard: string;
}

/*
--------INTERRUPT EVENTS----------
 */
export interface DiscardResourcesTryEvent {
    type: "DiscardResourcesTryEvent";
    activePlayer: string;
    resources: string;
}

export interface DiscardedResourcesEvent {
    type: "DiscardedResourcesEvent";
    activePlayer: string;
    resources: string;
}

/*
--------ROBBER EVENTS--------
 */
export interface MoveRobberTryEvent {
    type: "MoveRobberTryEvent";
    activePlayer: string;
    coordinates: string;
}

export interface MovedRobberEvent {
    type: "MovedRobberEvent";
    activePlayer: string;
    coordinates: string;
}

export interface StealResourcesTryEvent {
    type: "StealResourcesTryEvent";
    activePlayer: string;
    coordinates: string; //Coordinates of the settlement/city we steal form
}

export interface StoleResourcesEvent {
    type: "StoleResourcesEvent";
    activePlayer: string;
    coordinates: string;
    resource: string;
}

/*
--------DEV CARD EVENTS-----------
 */
//Used for Monopoly and YearOfPlenty
export interface ChooseResourcesTryEvent {
    type: "ChooseResourcesTryEvent";
    activePlayer: string;
    resources: string;
}

export interface ChosenResourcesEvent {
    type: "ChosenResourcesTryEvent";
    activePlayer: string;
    resources: string;
}


