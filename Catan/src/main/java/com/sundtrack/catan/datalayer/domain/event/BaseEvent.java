package com.sundtrack.catan.datalayer.domain.event;

public sealed interface BaseEvent permits ServerEvent, ClientAction {
}