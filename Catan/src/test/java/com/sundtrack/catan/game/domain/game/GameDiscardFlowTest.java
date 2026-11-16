package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.event.action.resource.GameDiscardAction;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.GamePlayer;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.testsupport.GameFixture;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameDiscardFlowTest {

    @Test
    void only_players_with_more_than_seven_cards_must_discard() {
        Game game = aGame().withDiceSeed(42).withSetupCompleted().build();
        setHand(player(game, ALICE), ResourceType.LUMBER, 8);
        setHand(player(game, BOB), ResourceType.BRICK, 7);

        game.rollDice(); // 7

        assertThat(game.isDiscardPending(ALICE)).isTrue();
        assertThat(game.getRequiredDiscardCount(ALICE)).isEqualTo(4); // 8 / 2
        assertThat(game.isDiscardPending(BOB)).isFalse();            // 7 is not > 7
        assertThat(game.getRequiredDiscardCount(BOB)).isZero();
    }

    @Test
    void once_everyone_discards_the_robber_placement_emerges() {
        Game game = aGame().withDiceSeed(42).withSetupCompleted().build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 8);
        game.rollDice();
        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.DISCARD);

        game.discard(new GameDiscardAction(discardIds(alice, 4)), ALICE);

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.ROBBER_PLACEMENT);
        assertThat(game.getPendingRequiredDiscards()).isEmpty();
        assertThat(alice.getResourceCount()).isEqualTo(4);
    }

    @Test
    void discarded_cards_return_to_the_bank() {
        GameFixture fixture = aGame().withDiceSeed(42).withSetupCompleted();
        Game game = fixture.build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 8);
        game.rollDice();
        int lumberBefore = fixture.resourceBank().available(ResourceType.LUMBER);

        game.discard(new GameDiscardAction(discardIds(alice, 4)), ALICE);

        assertThat(fixture.resourceBank().available(ResourceType.LUMBER)).isEqualTo(lumberBefore + 4);
    }

    private static List<UUID> discardIds(GamePlayer p, int n) {
        return p.getResources().stream().limit(n).map(Resource::uid).toList();
    }
}