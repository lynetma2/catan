package com.sundtrack.catan.datalayer.domain.event.game.action.trade;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.List;

public record StartPublicTradeAction (
        List<Resource> offered,
        List<ResourceType> wanted
) implements ClientAction {
}
