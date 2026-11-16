package com.sundtrack.catan.shared.event;

public sealed interface BaseEvent permits ServerEvent, ClientAction {
}