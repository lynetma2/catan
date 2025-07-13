package com.sundtrack.catan.lobby;

import java.util.HashMap;

public class Lobby {
    private HashMap<String, Player> players;
    //TODO add settings;

    public Lobby() {
        this.players = new HashMap<>();
    }

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public void addPlayer(Player player) {
        players.put(player.username,  player);
    }

    public void removePlayer(String username) {
        players.remove(username);
    }

    public Player getPlayer(String username) {
        if (!players.containsKey(username)) {
            throw new RuntimeException("Player with name " + username + " does not exist");
        }

        return players.get(username);
    }

    public static class Player {
        private String username;
        private boolean isLeader;
        private boolean isReady;

        public Player(String username, boolean isLeader, boolean isReady){
            this.username = username;
            this.isLeader = isLeader;
            this.isReady = isReady;
        }

        public String getUsername() {
            return username;
        }

        public boolean getIsLeader() {
            return isLeader;
        }

        public void setLeader(boolean leader) {
            isLeader = leader;
        }

        public boolean getIsReady() {
            return isReady;
        }

        public void setReady(boolean ready) {
            isReady = ready;
        }
    }

    public static class LobbyEvent {
        public enum EventKind {
            SETREADY,
            SETNOTREADY,
            STARTGAME,
            //TODO add some to handle settings
        }

        private final EventKind kind;
        private final String playerName;

        public  LobbyEvent(EventKind kind, String playerName) {
            this.kind = kind;
            this.playerName = playerName;
        }

        public EventKind getKind() {
            return kind;
        }

        public String getPlayerName() {
            return playerName;
        }
    }

    public static record LobbyIdandUsername (String username, int lobbyId){}
}
