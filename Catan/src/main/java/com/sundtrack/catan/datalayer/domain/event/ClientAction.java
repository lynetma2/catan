package com.sundtrack.catan.datalayer.domain.event;

public non-sealed interface ClientAction extends BaseEvent {

    String domain();

    String action();

    @Override
    default String type() {
        return "action."
                + domain()
                + "."
                + action();
    }
}
