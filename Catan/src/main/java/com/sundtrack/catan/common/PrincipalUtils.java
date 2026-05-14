package com.sundtrack.catan.common;

import com.sundtrack.catan.common.handlers.AnonymousPrincipalHandshakeHandler;
import java.security.Principal;
import java.util.UUID;

public final class PrincipalUtils {

    private PrincipalUtils() {}

    public static UUID extractPlayerId(Principal principal) {
        if (principal instanceof AnonymousPrincipalHandshakeHandler.StompPrincipal stomp) {
            return UUID.fromString(stomp.getUuid());
        }
        throw new IllegalStateException("Principal is not a StompPrincipal");
    }
}