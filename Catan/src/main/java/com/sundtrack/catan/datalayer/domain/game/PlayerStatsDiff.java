package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.overview.*;

import java.util.*;

public class PlayerStatsDiff {

    private PlayerStatsDiff() {
    }

    public static Map<UUID, PlayerStats> capture(Game game) {
        Map<UUID, Integer> roadLengths = game.getLongestRoadLengths();
        Map<UUID, Integer> armySizes = game.getArmySizes();

        Map<UUID, PlayerStats> snapshot = new HashMap<>();
        for (GamePlayer player : game.getPlayers()) {
            UUID id = player.getId();
            snapshot.put(id, new PlayerStats(
                    game.computePublicVictoryPoints(id),
                    game.hasLongestRoad(id),
                    roadLengths.get(id),
                    game.hasLargestArmy(id),
                    armySizes.get(id)
            ));
        }
        return snapshot;
    }

    public static List<ServerEvent> diff(Map<UUID, PlayerStats> before, Map<UUID, PlayerStats> after) {
        List<ServerEvent> events = new ArrayList<>();

        for (var entry : after.entrySet()) {
            UUID playerId = entry.getKey();
            PlayerStats prev = before.get(playerId);
            PlayerStats curr = entry.getValue();

            if (prev.publicVictoryPoints() != curr.publicVictoryPoints()) {
                events.add(new VictoryPointsChangedEvent(playerId, curr.publicVictoryPoints()));
            }
            if (prev.longestRoadLength() != curr.longestRoadLength()) {
                events.add(new RoadLengthChangedEvent(playerId, curr.longestRoadLength()));
            }
            if (prev.hasLongestRoad() != curr.hasLongestRoad()) {
                events.add(new LongestRoadAwardChangedEvent(playerId, curr.hasLongestRoad()));
            }
            if (prev.armySize() != curr.armySize()) {
                events.add(new ArmySizeChangedEvent(playerId, curr.armySize()));
            }
            if (prev.hasLargestArmy() != curr.hasLargestArmy()) {
                events.add(new LargestArmyAwardChangedEvent(playerId, curr.hasLargestArmy()));
            }
        }
        return events;
    }
}
