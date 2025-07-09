package com.sundtrack.catan.lobby;

import java.util.ArrayList;
import java.util.HashMap;

public class Lobby {
    private HashMap<String, Boolean> players;
    //TODO add settings;

    public Lobby() {
        this.players = new HashMap<>();
    }

    public HashMap<String, Boolean> getPlayers() {
        return players;
    }
}
