package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.cards.DevelopmentCard;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class Game {

    //Resource array indices
    public static final int LUMBER_INDEX = 0;
    public static final int BRICK_INDEX = 1;
    public static final int GRAIN_INDEX = 2;
    public static final int WOOL_INDEX = 3;
    public static final int ORE_INDEX = 4;

    private final Board board;
    private final Map<String, Player> players;
    private final int[] dices;
    private final List<GameEvent> events;
    private final Integer[] resources;
    private final List<DevelopmentCard> developmentCards;
    private final List<String> turnOrder;
    //TODO add something to log the events, and save them.

    public Game(Board board, Map<String, Player> players) {
        this.board = board;
        this.players = players;
        this.developmentCards = DevelopmentCard.generateDeck();
        this.turnOrder = new ArrayList<>(players.keySet());
        Collections.shuffle(this.turnOrder);

        this.resources = new Integer[] {19,19,19,19,19};
        this.events = new ArrayList<>();
        this.dices = new int[] {1,1};
    }

    public Board getBoard() {
        return board;
    }

    public Map<String, Player> getPlayers() {
        return players;
    }

    public int[] getDices() {
        return dices;
    }

    public Integer[] getResources() {
        return resources;
    }

    public void setDices(int[] dices) {
        System.arraycopy(dices, 0, this.dices, 0, dices.length);
    }

    public List<GameEvent> getGameEvents() {
        return events;
    }

    public List<DevelopmentCard> getDevelopmentCards() {
        return developmentCards;
    }

    public void handleGameEvent(GameEvent gameEvent) {
        gameEvent.doEvent(this);

        //Add the executed event to the list of events.
        events.add(gameEvent);
    }
}
