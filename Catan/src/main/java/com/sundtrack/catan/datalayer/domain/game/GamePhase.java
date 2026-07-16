package com.sundtrack.catan.datalayer.domain.game;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.RollDiceAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.TurnEndAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceCityAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.PlaceRobberAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;

import java.util.Set;

public enum GamePhase {
    SETUP_PLACE_SETTLEMENT("setup_place_settlement",
            Set.of(PlaceSettlementAction.class)),
    SETUP_PLACE_ROAD("setup_place_road",
            Set.of(PlaceRoadAction.class)),
    PRE_ROLL("pre_roll",
            Set.of(RollDiceAction.class)),
    POST_ROLL("post_roll",
            Set.of(TurnEndAction.class, PlaceCityAction.class, PlaceRoadAction.class, PlaceSettlementAction.class)),
    ROBBER_PLACEMENT("robber_placement",
            Set.of(PlaceRobberAction.class)),
    ROBBER_STEAL("robber_steal",
            Set.of(RobberStealAction.class)),
    DISCARD("discard", Set.of()),
    GAME_OVER("end", Set.of()),
    ROAD_BUILDING("road_building", Set.of());

    //TODO finish this class!

    private final String value;
    private final Set<Class<? extends ClientAction>> allowedActions;

    GamePhase(String value, Set<Class<? extends ClientAction>> allowedActions) {
        this.value = value;
        this.allowedActions = allowedActions;
    }

    @JsonCreator
    public static GamePhase fromValue(String value) {
        for (GamePhase phase : GamePhase.values()) {
            if (phase.value.equalsIgnoreCase(value)) {
                return phase;
            }
        }
        throw new IllegalArgumentException("Unknown GamePhase: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public Set<Class<? extends ClientAction>> getAllowedActions() {
        return allowedActions;
    }

    public void validateAllowedAction(ClientAction action) {
        if (!allowedActions.contains(action.getClass())) {
            throw new IllegalGamePhaseException(this);
        }
    }

    public boolean isSetupPhase() {
        return this == SETUP_PLACE_SETTLEMENT || this == SETUP_PLACE_ROAD;
    }

    /**
     * Robber flow:
     * Pre-Roll -> Robber Placement -> Robber Steal -> Post roll.
     *
     * Development Card flows
     * Knight flow:
     * Robber Placement -> Robber Steal -> Post roll.
     *
     * Road building flow:
     * RoadBuilding -> RoadBuilding -> Post roll.
     *
     * Monopoly flow:
     * Claim all ressources of a certain kind
     * No flow should be needed.
     *
     * Year of Plenty flow:
     * No flow should be needed.
     *
     * Victory Pint card:
     * No flow should be needed.
     */
}