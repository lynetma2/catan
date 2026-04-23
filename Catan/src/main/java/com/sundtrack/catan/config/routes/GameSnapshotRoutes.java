package com.sundtrack.catan.config.routes;

import static com.sundtrack.catan.config.routes.ApiRoutes.SESSION_ID;

public class GameSnapshotRoutes {
    public static final String BASE = "/game/{" + SESSION_ID + "}/snapshot";

    public static class In {
        public static final String PING   = "/ping";
        public static final String SAVE   = "/save";
        public static final String LOAD   = "/load";
        public static final String LIST   = "/list";
        public static final String DELETE = "/delete";
    }

    public static class Out {
        private static final String BASE = ApiRoutes.TOPIC_PREFIX + "/session/" + ApiRoutes.SESSION_ID + "/game/snapshot";
        public static final String PING   = BASE + "/ping";
        public static final String SAVE   = BASE + "/save";
        public static final String LOAD   = BASE + "/load";
        public static final String LIST   = BASE + "/list";
        public static final String DELETE = BASE + "/delete";
    }
}
