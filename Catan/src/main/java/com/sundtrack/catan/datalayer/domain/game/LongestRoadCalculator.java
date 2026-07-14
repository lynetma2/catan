package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class LongestRoadCalculator {
    private final List<Edge> playerRoads;
    private final Set<Vertex> blockedVertices; // opponent settlements/cities

    public LongestRoadCalculator(List<Edge> playerRoads, Set<Vertex> blockedVertices) {
        this.playerRoads = playerRoads;
        this.blockedVertices = blockedVertices;
    }

    public int longestPathLength() {
        int best = 0;
        for (Edge start : playerRoads) {
            for (Vertex startVertex : start.getVertices()) {
                best = Math.max(best, dfs(startVertex, new HashSet<>()));
            }
        }
        return best;
    }

    private int dfs(Vertex at, Set<Edge> used) {
        int best = 0;
        for (Edge edge : playerRoads) {
            if (used.contains(edge) || !edge.getVertices().contains(at)) continue;

            Vertex next = otherEndpoint(edge, at);
            if (blockedVertices.contains(next) && !used.isEmpty()) {
                // can still traverse INTO a blocked vertex (edge counts) but not further past it
                best = Math.max(best, 1);
                continue;
            }

            used.add(edge);
            best = Math.max(best, 1 + dfs(next, used));
            used.remove(edge);
        }
        return best;
    }

    private Vertex otherEndpoint(Edge edge, Vertex from) {
        return edge.getVertices().stream().filter(v -> !v.equals(from)).findFirst().orElseThrow();
    }
}
