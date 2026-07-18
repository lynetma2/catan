package com.sundtrack.catan.datalayer.domain.event;

public final class EventDomainConstants {
    // Top-level domains
    public static final String SEPARATOR = ".";
    public static final String ACTION = "action";
    public static final String SERVER = "server";
    // Sub-categories
    public static final String LOBBY = "lobby";
    public static final String GAME = "game";
    public static final String PLAYER = "player";
    public static final String BUILD = "build";
    public static final String RESOURCE = "resource";
    public static final String STATE = "state";
    public static final String TURN = "turn";
    public static final String ROBBER = "robber";
    public static final String OVERVIEW = "overview";
    public static final String DEVELOPMENT_CARD = "developmentCard";
    public static final String PLAY = "play";
    // Status constants
    public static final String REJECTED = "rejected";
    public static final String ERROR = "error";
    private EventDomainConstants() {
    } // prevent instantiation
}
