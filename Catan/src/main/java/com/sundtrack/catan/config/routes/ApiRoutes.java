package com.sundtrack.catan.config.routes;

public class ApiRoutes {
    public static final String API_ROOT = "/api";
    public static final String WS_PREFIX = "/ws";      // For @MessageMapping
    public static final String TOPIC_PREFIX = "/topic"; // For @SendTo / Broadcasts
    public static final String APP_PREFIX = "/app"; // For @SendTo / Broadcasts
    public static final String QUEUE_PREFIX = "/queue"; // For @SendToUser

    //Path variables
    public static final String SESSION_ID = "sessionId";
}