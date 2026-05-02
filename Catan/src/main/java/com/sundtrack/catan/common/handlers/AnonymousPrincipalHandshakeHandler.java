package com.sundtrack.catan.common.handlers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeFailureException;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.sundtrack.catan.common.WebSocketConstants.UUID_COOKIE_NAME;

public class AnonymousPrincipalHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {

        String uuid = extractUuidFromCookies(request);
        if (uuid == null) {
            uuid = UUID.randomUUID().toString();
            attributes.put(UUID_COOKIE_NAME, uuid);
            // Bridge for the interceptor
            ((ServletServerHttpRequest) request).getServletRequest()
                    .setAttribute(UUID_COOKIE_NAME, uuid);
        }

        String username = "anonymous-" + uuid.substring(0, 8);
        return new StompPrincipal(username, uuid);
    }

    private String extractUuidFromCookies(ServerHttpRequest request) {
        List<String> cookieHeaders = request.getHeaders().get(HttpHeaders.COOKIE);
        if (cookieHeaders == null) return null;

        return cookieHeaders.stream()
                .flatMap(header -> Arrays.stream(header.split(";")))
                .map(String::trim)
                .filter(cookie -> cookie.startsWith(UUID_COOKIE_NAME + "="))
                .map(cookie -> cookie.substring(UUID_COOKIE_NAME.length() + 1))
                .findFirst()
                .orElse(null);
    }

    public static class StompPrincipal implements Principal {
        private volatile String displayName;
        private final String uuid;

        public StompPrincipal(String displayName, String uuid) {
            this.displayName = displayName;
            this.uuid = uuid;
        }

        @Override
        public String getName() { return uuid; } // Spring uses this for routing

        public String getDisplayName() { return displayName; }
        public String getUuid() { return uuid; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
    }
}
