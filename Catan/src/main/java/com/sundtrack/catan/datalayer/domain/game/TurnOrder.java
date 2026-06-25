package com.sundtrack.catan.datalayer.domain.game;

import java.util.List;
import java.util.UUID;

public class TurnOrder {

    public enum SetupAdvanceResult {
        NEXT_PLAYER,
        SAME_PLAYER_AGAIN,
        SETUP_COMPLETE
    }

    private final List<UUID> playerIds;
    private int index;
    private boolean reversed;

    private TurnOrder(List<UUID> playerIds, int index, boolean reversed) {
        this.playerIds = playerIds;
        this.index = index;
        this.reversed = reversed;
    }

    public static TurnOrder startingNewGame(List<UUID> playerIds) {
        if (playerIds == null || playerIds.size() < 2) {
            throw new IllegalArgumentException("TurnOrder requires at least 2 players");
        }
        return new TurnOrder(List.copyOf(playerIds), 0, false);
    }

    public static TurnOrder restore(List<UUID> playerIds, int index, boolean reversed) {
        return new TurnOrder(List.copyOf(playerIds), index, reversed);
    }

    public UUID currentPlayerId() {
        return playerIds.get(index);
    }

    public boolean isLastPlayer() {
        return reversed ? index == 0 : index == playerIds.size() - 1;
    }

    public boolean isFirstPlayer() {
        return index == 0;
    }

    public void advance() {
        index = (index + 1) % playerIds.size();
    }

    public SetupAdvanceResult advanceSetup() {
        if (!reversed && isLastPlayer()) {
            reversed = true;
            return SetupAdvanceResult.SAME_PLAYER_AGAIN;
        }
        if (reversed && isFirstPlayer()) {
            return SetupAdvanceResult.SETUP_COMPLETE;
        }
        index += reversed ? -1 : 1;
        return SetupAdvanceResult.NEXT_PLAYER;
    }

    public boolean isReversed() {
        return reversed;
    }

    public int getIndex() {
        return index;
    }

    public List<UUID> getPlayerIds() {
        return playerIds;
    }
}