package com.sundtrack.catan.lobby;

public class LobbyMessages {

    public record LobbyIdMessage(int lobbyId) {}
    public record PlayerNameMessage(String playerName) {}

}
