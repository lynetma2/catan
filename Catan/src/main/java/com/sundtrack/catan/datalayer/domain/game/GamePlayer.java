package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

public class GamePlayer {
    private UUID id;
    private String username;
    private String color;
    private List<Resource> resources;
    private List<DevCard> developmentCards;
    private Integer victoryPoints;
    private Integer cardCount;
    private Boolean hasLongestRoad;
    private Boolean hasLargestArmy;
    private Integer robbersUsed;
}
