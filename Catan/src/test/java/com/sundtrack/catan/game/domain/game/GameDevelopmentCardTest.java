package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.game.domain.exceptions.validation.InsufficientBankResourcesException;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.testsupport.GameFixture;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.GamePlayer;
import com.sundtrack.catan.game.domain.ResourceBank;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.*;

class GameDevelopmentCardTest {

    /** Setup done, then one turn advanced: turn 1, Bob to move, turn-0 cards playable. */
    private static Game gameOnTurnOne() {
        Game game = aGame().withSetupCompleted().build();
        game.advanceTurn();
        return game;
    }

    private static DevelopmentCard card(DevelopmentCardType type) {
        return new DevelopmentCard(UUID.randomUUID(), type, 0); // bought on turn 0
    }

    @Test
    void knight_moves_the_robber_and_counts_toward_largest_army() {
        Game game = gameOnTurnOne();
        GamePlayer bob = player(game, BOB);
        DevelopmentCard knight = card(DevelopmentCardType.KNIGHT);
        bob.addDevelopmentCard(knight);

        game.playKnightCard(BOB, knight.getId());

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.ROBBER_PLACEMENT);
        assertThat(bob.getKnightsUsed()).isEqualTo(1);
        assertThat(bob.getDevelopmentCardCount()).isZero();
    }

    @Test
    void monopoly_takes_every_card_of_one_type_from_opponents() {
        Game game = gameOnTurnOne();
        GamePlayer alice = player(game, ALICE);
        GamePlayer bob = player(game, BOB);
        setHand(alice, ResourceType.LUMBER, 3);
        setHand(bob, ResourceType.ORE, 0);
        DevelopmentCard monopoly = card(DevelopmentCardType.MONOPOLY);
        bob.addDevelopmentCard(monopoly);

        game.playMonopolyCard(BOB, monopoly.getId(), ResourceType.LUMBER);

        assertThat(alice.getResourceCount()).isZero();
        assertThat(bob.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.LUMBER, ResourceType.LUMBER, ResourceType.LUMBER);
    }

    @Test
    void year_of_plenty_draws_the_two_chosen_resources() {
        Game game = gameOnTurnOne();
        GamePlayer bob = player(game, BOB);
        setHand(bob, ResourceType.ORE, 0);
        DevelopmentCard plenty = card(DevelopmentCardType.YEAR_OF_PLENTY);
        bob.addDevelopmentCard(plenty);

        game.playYearOfPlentyCard(BOB, plenty.getId(), ResourceType.LUMBER, ResourceType.BRICK);

        assertThat(bob.getResources()).extracting(Resource::resourceType)
                .containsExactlyInAnyOrder(ResourceType.LUMBER, ResourceType.BRICK);
        assertThat(bob.getDevelopmentCardCount()).isZero();
    }

    @Test
    void year_of_plenty_fails_and_keeps_the_card_when_the_bank_cannot_pay() {
        GameFixture fixture = aGame().withSetupCompleted();
        Game game = fixture.build();
        game.advanceTurn();
        GamePlayer bob = player(game, BOB);
        setHand(bob, ResourceType.ORE, 0);
        DevelopmentCard plenty = card(DevelopmentCardType.YEAR_OF_PLENTY);
        bob.addDevelopmentCard(plenty);

        ResourceBank bank = fixture.resourceBank();
        bank.draw(ResourceType.LUMBER, bank.available(ResourceType.LUMBER)); // empty the lumber pile

        assertThatThrownBy(() -> game.playYearOfPlentyCard(BOB, plenty.getId(), ResourceType.LUMBER, ResourceType.BRICK))
                .isInstanceOf(InsufficientBankResourcesException.class);
        assertThat(bob.getDevelopmentCardCount()).isEqualTo(1); // bank is checked before the card is consumed
    }

    @Test
    void drawing_a_dev_card_costs_grain_wool_ore() {
        Game game = gameOnTurnOne();
        GamePlayer bob = player(game, BOB);
        setHand(bob, ResourceType.ORE, 0);
        bob.receive(List.of(resource(ResourceType.GRAIN), resource(ResourceType.WOOL), resource(ResourceType.ORE)));

        Game.DrawDevelopmentCardResult result = game.drawDevelopmentCard(BOB);

        assertThat(result.deductedResources()).hasSize(3);
        assertThat(bob.getResourceCount()).isZero();
        assertThat(bob.getDevelopmentCardCount()).isEqualTo(1);
    }
}