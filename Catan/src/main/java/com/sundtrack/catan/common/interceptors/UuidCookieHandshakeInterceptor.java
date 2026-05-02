package com.sundtrack.catan.common.interceptors;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

import static com.sundtrack.catan.common.WebSocketConstants.UUID_COOKIE_NAME;

public class UuidCookieHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
        String newUuid = (String) servletRequest.getAttribute(UUID_COOKIE_NAME);
        if (newUuid != null) {
            String cookie = UUID_COOKIE_NAME + "=" + newUuid
                    + "; Path=/"
                    + "; HttpOnly"
                    + "; SameSite=Strict";
            response.getHeaders().add(HttpHeaders.SET_COOKIE, cookie);
        }
    }
}
