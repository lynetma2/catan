package com.sundtrack.catan.datalayer.domain.event.game.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "endSummary")
public record EndSummaryAction() implements ClientAction {
}
