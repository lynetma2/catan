package com.sundtrack.catan.messaging.routes;

import org.springframework.util.RouteMatcher;

import java.util.UUID;

public class ApiRoutes {
    public static final String TOPIC_PREFIX = "/topic";
    public static final String APP_PREFIX = "/app";
    public static final String WS_PREFIX = "/ws";

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