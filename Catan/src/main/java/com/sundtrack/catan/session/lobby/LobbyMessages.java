package com.sundtrack.catan.session.lobby;

public class LobbyMessages {

    public record LobbyIdMessage(int lobbyId) {}
    public record PlayerNameMessage(String playerName) {}

}
