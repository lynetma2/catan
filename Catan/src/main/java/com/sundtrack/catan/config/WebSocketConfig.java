package com.sundtrack.catan.config;

import com.sundtrack.catan.activeSessions.PresenceInterceptor;
import com.sundtrack.catan.common.handlers.AnonymousPrincipalHandshakeHandler;
import com.sundtrack.catan.common.interceptors.UuidCookieHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import static com.sundtrack.catan.messaging.routes.ApiRoutes.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final PresenceInterceptor presenceInterceptor;

    public WebSocketConfig(PresenceInterceptor presenceInterceptor) {
        this.presenceInterceptor = presenceInterceptor;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(WS_PREFIX)
                .setHandshakeHandler(new AnonymousPrincipalHandshakeHandler())
                .addInterceptors(new UuidCookieHandshakeInterceptor())
                .setAllowedOriginPatterns("*")  // your Vite dev server
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(presenceInterceptor);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker(TOPIC_PREFIX, QUEUE_PREFIX);
        config.setApplicationDestinationPrefixes(APP_PREFIX);
        config.setUserDestinationPrefix(USER_PREFIX);
    }
}
