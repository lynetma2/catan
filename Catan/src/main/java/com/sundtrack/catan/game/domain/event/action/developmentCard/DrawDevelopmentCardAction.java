package com.sundtrack.catan.game.domain.event.action.developmentCard;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + "draw")
public record DrawDevelopmentCardAction (
) implements ClientAction {
}
