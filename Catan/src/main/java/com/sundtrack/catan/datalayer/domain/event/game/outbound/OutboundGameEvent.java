package com.sundtrack.catan.datalayer.domain.event.game.outbound;

import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;

public sealed interface OutboundGameEvent extends OutboundEvent permits  {

    OutboundGameEventType type();
}
