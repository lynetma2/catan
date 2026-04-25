package com.sundtrack.catan.datalayer.domain.event.outbound;

import com.sundtrack.catan.datalayer.domain.event.GameEvent;

public sealed interface OutboundGameEvent extends GameEvent permits GameInitializedEvent {

    OutboundGameEventType type();
}
