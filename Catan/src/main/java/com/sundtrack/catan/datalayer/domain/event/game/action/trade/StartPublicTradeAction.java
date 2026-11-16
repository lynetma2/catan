package com.sundtrack.catan.datalayer.domain.event.game.action.trade;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.List;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "start")
public record StartPublicTradeAction(
        List<Resource> offered,
        List<ResourceType> wanted
) implements ClientAction {
}
