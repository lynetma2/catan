package com.sundtrack.catan.config;

public class ApiRoutes {
    // 1. Base Prefixes
    public static final String API_ROOT = "/api";
    public static final String WS_PREFIX = "/ws";      // For @MessageMapping
    public static final String TOPIC_PREFIX = "/topic"; // For @SendTo / Broadcasts
    public static final String APP_PREFIX = "/app"; // For @SendTo / Broadcasts

    // 2. Resource Paths (The "Noun")
    private static final String GAME = "/game";
    private static final String SNAPSHOT = "/snapshot";

    // 3. Concrete Inbound Routes (Client -> Server)
    // Results in: "/game/snapshot"
    public static final String GAME_SNAPSHOT_INBOUND = GAME + SNAPSHOT;

    // 4. Concrete Outbound Topics (Server -> Client)
    // Results in: "/topic/game"
    public static final String GAME_TOPIC = TOPIC_PREFIX + GAME;
}