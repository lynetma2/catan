package com.sundtrack.catan.game.model;

import com.sundtrack.catan.game.entity.cards.DevelopmentCard;
import com.sundtrack.catan.game.dto.events.GameEvent;
import com.sundtrack.catan.game.model.board.Board;
import com.sundtrack.catan.game.model.enums.GamePhase;
import com.sundtrack.catan.game.model.player.Inventory;
import com.sundtrack.catan.game.model.player.Player;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class Game {

    private final Board board;
    private final Map<String, Player> players;
    private final int[] dices;
    private final List<GameEvent> events;
    private final Inventory bank; // Replaces resources array
    private final List<DevelopmentCard> developmentCards;
    private final List<String> turnOrder;
    private GamePhase phase;
    private final GameConfig config;
    //TODO add something to log the events, and save them.

    public Game(Board board, Map<String, Player> players) {
        this(board, players, GameConfig.standard());
    }

    public Game(Board board, Map<String, Player> players, GameConfig config) {
        this.board = board;
        this.players = players;
        this.config = config;
        this.developmentCards = DevelopmentCard.generateDeck();
        this.turnOrder = new ArrayList<>(players.keySet());
        Collections.shuffle(this.turnOrder);

        this.bank = new Inventory(); // Initialize with 19 of each if needed
        this.events = new ArrayList<>();
        this.dices = new int[] {1,1};
        this.phase = GamePhase.SETUP;
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

    public Inventory getBank() {
        return bank;
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

    public GamePhase getPhase() {
        return phase;
    }

    public void setPhase(GamePhase phase) {
        this.phase = phase;
    }

    public GameConfig getConfig() {
        return config;
    }

    public void handleGameEvent(GameEvent gameEvent) {
        // gameEvent.doEvent(this); // Assuming this method exists on GameEvent or is handled via pattern matching

        //Add the executed event to the list of events.
        events.add(gameEvent);
    }
}
