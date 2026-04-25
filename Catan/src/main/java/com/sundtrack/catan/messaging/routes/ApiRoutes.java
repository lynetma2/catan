package com.sundtrack.catan.messaging.routes;

import java.util.UUID;

public class ApiRoutes {
    public static String gameTopic(UUID gameId) {
        return "/topic/games/" + gameId;
    }

    public static String gameQueue(UUID gameId) {
        return "/queue/games/" + gameId;
    }

    public static String lobbyTopic(UUID gameId) {
        return "/topic/lobby/" + gameId;
    }

    public static String lobbyQueue() {
        return "/queue/lobby";
    }

    public static String errors() {
        return "/queue/errors";
    }
}