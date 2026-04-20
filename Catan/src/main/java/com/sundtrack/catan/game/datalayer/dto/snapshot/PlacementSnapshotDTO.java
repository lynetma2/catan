package com.sundtrack.catan.game.datalayer.dto.snapshot;

import com.sundtrack.catan.game.datalayer.dto.placement.CityPlacementDTO;
import com.sundtrack.catan.game.datalayer.dto.placement.RoadPlacementDTO;
import com.sundtrack.catan.game.datalayer.dto.placement.SettlementPlacementDTO;

import java.util.List;

public record PlacementSnapshotDTO(
        List<RoadPlacementDTO> roads,
        List<SettlementPlacementDTO> settlements,
        List<CityPlacementDTO> cities
) {
    public PlacementSnapshotDTO {
        // Defensive copies for strict immutability
        roads = List.copyOf(roads != null ? roads : List.of());
        settlements = List.copyOf(settlements != null ? settlements : List.of());
        cities = List.copyOf(cities != null ? cities : List.of());
    }
}