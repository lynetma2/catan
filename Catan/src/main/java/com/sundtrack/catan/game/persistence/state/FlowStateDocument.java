package com.sundtrack.catan.game.persistence.state;

import java.util.List;

public record FlowStateDocument(
        TurnOrderDocument turnOrder,
        String basePhase,
        int turnNumber,
        List<SubFlowStateDocument> activeFlows
) {}