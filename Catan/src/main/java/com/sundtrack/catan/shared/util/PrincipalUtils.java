package com.sundtrack.catan.shared.util;

import com.sundtrack.catan.shared.ws.AnonymousPrincipalHandshakeHandler;
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