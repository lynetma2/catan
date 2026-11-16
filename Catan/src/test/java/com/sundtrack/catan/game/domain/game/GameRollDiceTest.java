package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import org.junit.jupiter.api.Test;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static java.util.Map.entry;
import static org.assertj.core.api.Assertions.assertThat;

class GameRollDiceTest {

    @Test
    void rolling_seven_with_eight_cards_requires_discarding_four() {
        Game game = aGame().withDiceSeed(42).withSetupCompleted().build(); // 42 → 3+4 = 7
        setHand(player(game, ALICE), ResourceType.LUMBER, 8);

        game.rollDice();

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.DISCARD);
        assertThat(game.getPendingRequiredDiscards()).containsExactly(entry(ALICE, 4));
    }

    @Test
    void rolling_seven_with_few_cards_goes_straight_to_robber_placement() {
        Game game = aGame().withDiceSeed(42).withSetupCompleted().build();

        game.rollDice();

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.ROBBER_PLACEMENT);
        assertThat(game.getPendingRequiredDiscards()).isEmpty();
    }

    @Test
    void rolling_non_seven_enters_post_roll() {
        Game game = aGame().withDiceSeed(4).withSetupCompleted().build();  // 4 → 3+5 = 8

        Game.RollOutcome outcome = game.rollDice();

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.POST_ROLL);
        assertThat(outcome.roll().total()).isEqualTo(8);
    }
}