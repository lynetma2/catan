package com.sundtrack.catan.config;

public class ApiRoutes {
    // 1. Base Prefixes
    public static final String API_ROOT = "/api";
    public static final String WS_PREFIX = "/ws";      // For @MessageMapping
    public static final String TOPIC_PREFIX = "/topic"; // For @SendTo / Broadcasts
    public static final String APP_PREFIX = "/app"; // For @SendTo / Broadcasts
    public static final String QUEUE_PREFIX = "/queue"; // For @SendToUser

    // 2. Resource Paths
    private static final String GAME = "/game";
    private static final String LOBBY = "/lobby";
    private static final String SNAPSHOT = "/snapshot";

    // 3. Concrete Inbound Routes (Client -> Server)
    public static final String GAME_SNAPSHOT_INBOUND = GAME + SNAPSHOT;
    public static final String LOBBY_SNAPSHOT_INBOUND = LOBBY + SNAPSHOT;

    // 4. Concrete Outbound Topics (Server -> Client)
    public static final String GAME_TOPIC = TOPIC_PREFIX + GAME;
    public static final String LOBBY_TOPIC = TOPIC_PREFIX + LOBBY;
    public static final String LOBBY_QUEUE = QUEUE_PREFIX + LOBBY;

    public static class LobbySnapshot {
        private static final String BASE = "/lobby/snapshot";

        public static class In {
            public static final String PING   = BASE + "/ping";
            public static final String SAVE   = BASE + "/save";
            public static final String LOAD   = BASE + "/load";
            public static final String LIST   = BASE + "/list";
            public static final String DELETE = BASE + "/delete";
        }

        public static class Out {
            public static final String PING   = TOPIC_PREFIX + BASE + "/ping";
            public static final String SAVE   = QUEUE_PREFIX + BASE + "/save";
            public static final String LOAD   = QUEUE_PREFIX + BASE + "/load";
            public static final String LIST   = QUEUE_PREFIX + BASE + "/list";
            public static final String DELETE = QUEUE_PREFIX + BASE + "/delete";
        }
    }
}