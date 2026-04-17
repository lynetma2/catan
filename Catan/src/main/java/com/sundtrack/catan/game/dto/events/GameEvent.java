package com.sundtrack.catan.game.dto.events; // Must be same package

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.sundtrack.catan.game.enums.EventType;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        // You reference the classes, even though they are in other files
        @JsonSubTypes.Type(value = BuildRoadEventDTO.class, name = "BuildRoad"),
        @JsonSubTypes.Type(value = BuildSettlementEventDTO.class, name = "BuildSettlement"),
        @JsonSubTypes.Type(value = BuildCityEventDTO.class, name = "BuildCity"),
        @JsonSubTypes.Type(value = BuyDevelopmentCardEventDTO.class, name = "BuyDevelopmentCard"),
        @JsonSubTypes.Type(value = EndTurnEventDTO.class, name = "EndTurn"),
        @JsonSubTypes.Type(value = RollDiceEventDTO.class, name = "RollDice"),
        @JsonSubTypes.Type(value = TransferResourcesEventDTO.class, name = "TransferResources")
})
public sealed interface GameEvent permits
        BuildRoadEventDTO,
        BuildSettlementEventDTO,
        BuildCityEventDTO,
        BuyDevelopmentCardEventDTO,
        EndTurnEventDTO,
        RollDiceEventDTO,
        TransferResourcesEventDTO {

    EventType type();
    String playerId();
}
