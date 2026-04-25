package com.sundtrack.catan.datalayer.dto.mapper;

import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePlayer;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.PlayerSnapshotDTO;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
public class GameMapper {

    public GameSnapshotDTO toSnapshotDTO(Game game) {
        return new GameSnapshotDTO(
                game.getId().toString(),
                mapPlayers(game.getPlayers()),
                mapTiles(game.getTiles()),
                mapPlacements(game.getBuildings()),
                game.getCurrentPhase(),
                getCurrentPlayerId(game),
                game.getTurnNumber(),
                game.getActiveTradeOffers()
        );
    }

    private List<PlayerSnapshotDTO> mapPlayers(List<GamePlayer> players) {
        // Map GamePlayer domain to PlayerSnapshotDTO
        return players.stream()
                .map(p -> new PlayerSnapshotDTO(...))
                .toList();
    }

    private String getCurrentPlayerId(Game game) {
        // Logic to determine whose turn it is based on turnNumber
        // and player list order
        return game.getPlayers().get(game.getTurnNumber() % game.getPlayers().size()).getId().toString();
    }

    // ... mapTiles and mapPlacements methods
}
