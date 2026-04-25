package com.sundtrack.catan.datalayer.domain.lobby;

public class LobbyMessages {

    public record LobbyIdMessage(int lobbyId) {}
    public record PlayerNameMessage(String playerName) {}

}
