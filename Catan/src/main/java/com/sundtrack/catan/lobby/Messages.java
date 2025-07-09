package com.sundtrack.catan.lobby;

public class Messages {

    public record NewLobby(int id, Lobby lobby) {}

    public record PlayerMessage(String playerName) {}

}
