package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.GameAwards;
import com.sundtrack.catan.game.domain.GameConfiguration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.Map;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.ALICE;
import static com.sundtrack.catan.game.domain.testsupport.GameFixture.BOB;
import static org.assertj.core.api.Assertions.assertThat;

class GameAwardsTest {

    private final GameAwards awards = new GameAwards(GameConfiguration.standard());

    @ParameterizedTest
    @CsvSource({"0, false", "2, false", "3, true", "5, true"})
    void largest_army_requires_at_least_three_knights(int knights, boolean expected) {
        awards.refreshLargestArmy(Map.of(ALICE, knights, BOB, 0));

        assertThat(awards.hasLargestArmy(ALICE)).isEqualTo(expected);
    }

    @Test
    void a_tie_does_not_dethrone_the_holder() {
        awards.refreshLargestArmy(Map.of(ALICE, 3, BOB, 0));

        awards.refreshLargestArmy(Map.of(ALICE, 3, BOB, 3));

        assertThat(awards.hasLargestArmy(ALICE)).isTrue();
        assertThat(awards.hasLargestArmy(BOB)).isFalse();
    }

    @Test
    void strictly_more_knights_dethrone_the_holder() {
        awards.refreshLargestArmy(Map.of(ALICE, 3, BOB, 0));

        awards.refreshLargestArmy(Map.of(ALICE, 3, BOB, 4));

        assertThat(awards.hasLargestArmy(BOB)).isTrue();
        assertThat(awards.hasLargestArmy(ALICE)).isFalse();
    }

    @Test
    void longest_road_requires_five_segments() {
        awards.refreshLongestRoad(Map.of(ALICE, 4, BOB, 0));
        assertThat(awards.getLongestRoadHolder()).isEmpty();

        awards.refreshLongestRoad(Map.of(ALICE, 5, BOB, 0));
        assertThat(awards.hasLongestRoad(ALICE)).isTrue();
    }
}