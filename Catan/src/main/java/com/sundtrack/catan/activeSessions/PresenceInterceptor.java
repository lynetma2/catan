package com.sundtrack.catan.activeSessions;

import com.sundtrack.catan.session.game.services.RoomLifecycleService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PresenceInterceptor implements ChannelInterceptor {

    // Matches /topic/lobby/{uuid} and /topic/game/{uuid} — extend if you add more room topics
    private static final Pattern ROOM_DESTINATION =
            Pattern.compile("^/topic/(?:lobby|game)/(?<id>[0-9a-fA-F-]{36})$");

    private final GameSessionRegistry registry;
    private final RoomLifecycleService lifecycle;

    public PresenceInterceptor(GameSessionRegistry registry, RoomLifecycleService lifecycle) {
        this.registry = registry;
        this.lifecycle = lifecycle;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) return message;

        String subscriptionId = accessor.getFirstNativeHeader("id"); // STOMP "id" header
        if (subscriptionId == null) return message;

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            UUID roomId = parseRoomId(accessor.getDestination());
            UUID playerId = parsePlayerId(accessor.getUser());
            if (roomId != null && playerId != null) {
                registry.bind(subscriptionId, accessor.getSessionId(), playerId, roomId);
                lifecycle.onPlayerConnected(roomId); // cancels any pending cleanup
            }
        } else if (StompCommand.UNSUBSCRIBE.equals(accessor.getCommand())) {
            registry.unbindSubscription(subscriptionId)
                    .ifPresent(lifecycle::onRoomPossiblyEmpty); // e.g. "Return to homepage"
        }
        return message;
    }

    /**
     * The method that was missing: extracts the lobby/game UUID from the destination.
     */
    private UUID parseRoomId(String destination) {
        if (destination == null) return null;
        Matcher matcher = ROOM_DESTINATION.matcher(destination);
        if (!matcher.matches()) return null;
        try {
            return UUID.fromString(matcher.group("id"));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private UUID parsePlayerId(Principal user) {
        if (user == null) return null;
        try {
            return UUID.fromString(user.getName()); // your principal name is the playerId
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}