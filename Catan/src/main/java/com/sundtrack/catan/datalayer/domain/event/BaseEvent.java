package com.sundtrack.catan.datalayer.domain.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public sealed interface BaseEvent permits ServerEvent, ClientAction {

    @JsonProperty("type")
    String type();
}