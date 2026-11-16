package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.Board;
import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.PortType;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.GivenResourcesWrongTradeException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InsufficientResourcesException;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;
import com.sundtrack.catan.datalayer.domain.testsupport.GameFixture;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.sundtrack.catan.datalayer.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.*;

class GameTradeTest {

    @Test
    void trades_four_lumber_for_one_brick_at_the_default_ratio() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 4);
        List<Resource> given = List.copyOf(alice.getResources());

        List<Resource> received = game.bankTrade(ALICE, given, List.of(ResourceType.BRICK));

        assertThat(received).extracting(Resource::resourceType)
                .containsExactly(ResourceType.BRICK);
        assertThat(alice.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.BRICK);
    }

    @Test
    void rejects_a_trade_that_does_not_meet_the_ratio() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 3);
        List<Resource> given = List.copyOf(alice.getResources());

        assertThatThrownBy(() -> game.bankTrade(ALICE, given, List.of(ResourceType.BRICK)))
                .isInstanceOf(GivenResourcesWrongTradeException.class);

        assertThat(alice.getResourceCount()).isEqualTo(3);
    }

    @Test
    void cannot_trade_a_resource_for_the_same_resource() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 4);
        List<Resource> given = List.copyOf(alice.getResources());

        assertThatThrownBy(() -> game.bankTrade(ALICE, given, List.of(ResourceType.LUMBER)))
                .isInstanceOf(GivenResourcesWrongTradeException.class);
    }

    @Test
    void public_trade_swaps_cards_between_players_on_confirm() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        GamePlayer bob = player(game, BOB);
        setHand(alice, ResourceType.LUMBER, 2);
        setHand(bob, ResourceType.BRICK, 1);

        TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
        game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);
        game.confirmTrade(ALICE, BOB, offer.getTradeOfferId());

        assertThat(alice.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.BRICK);
        assertThat(bob.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.LUMBER, ResourceType.LUMBER);
        assertThat(game.getActiveTradeOffers()).isEmpty();
    }

    @Test
    @Disabled("Bug: bankTrade keys the 2:1 discount to the WANTED resource; official Catan keys it to the GIVEN resource")
    void a_matching_port_lets_you_trade_two_of_its_resource_for_one_other() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        fixture.board().placeSettlement(portVertex(fixture.board(), PortType.LUMBER), ALICE, true);
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 2);

        // Official rule: lumber port -> GIVE 2 lumber, get 1 brick.
        List<Resource> received = game.bankTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));

        assertThat(received).extracting(Resource::resourceType).containsExactly(ResourceType.BRICK);
    }

    @Test
    @Disabled("Bug: a lumber port must not make RECEIVING lumber cheaper; the discount belongs to the given resource")
    void a_resource_port_does_not_discount_receiving_that_resource() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        fixture.board().placeSettlement(portVertex(fixture.board(), PortType.LUMBER), ALICE, true);
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.BRICK, 2);

        // Giving brick (not lumber) -> still 4:1 -> 2 brick is not enough.
        assertThatThrownBy(() -> game.bankTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.LUMBER)))
                .isInstanceOf(GivenResourcesWrongTradeException.class);
    }

    @Test
    void a_generic_port_improves_the_ratio_to_three_to_one() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        fixture.board().placeSettlement(portVertex(fixture.board(), PortType.ANY), ALICE, true);
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.BRICK, 3);

        List<Resource> received = game.bankTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.LUMBER));

        assertThat(received).extracting(Resource::resourceType).containsExactly(ResourceType.LUMBER);
    }

    // ---- bug-documentation tests: re-enable in fix/trade-confirm-validation ----

    @Test
    @Disabled("Bug: confirmTrade ignores ownsResources() and throws ResourceNotOwnedException instead of InsufficientResourcesException")
    void confirm_rejects_when_initiator_no_longer_owns_offered_cards() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        GamePlayer bob = player(game, BOB);
        setHand(alice, ResourceType.LUMBER, 2);
        setHand(bob, ResourceType.BRICK, 1);

        TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
        game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);
        alice.removeResourceOfType(ResourceType.LUMBER);   // Alice spends one offered card

        assertThatThrownBy(() -> game.confirmTrade(ALICE, BOB, offer.getTradeOfferId()))
                .isInstanceOf(InsufficientResourcesException.class);
    }

    @Test
    @Disabled("Bug: confirmTrade removes the initiator's remaining offered card before failing")
    void failed_confirm_leaves_both_hands_untouched() {
        Game game = aGame().build();
        GamePlayer alice = player(game, ALICE);
        GamePlayer bob = player(game, BOB);
        setHand(alice, ResourceType.LUMBER, 2);
        setHand(bob, ResourceType.BRICK, 1);

        TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
        game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);

        // Spend the SECOND offered card. The first is still in Alice's hand, so the
        // removal loop deletes it BEFORE hitting the missing one -> state corruption.
        alice.removeResources(List.of(offer.getOfferedResources().get(1)));

        Throwable thrown = catchThrowable(() -> game.confirmTrade(ALICE, BOB, offer.getTradeOfferId()));

        assertThat(thrown).isNotNull();
        assertThat(alice.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.LUMBER);   // fails today: hand is now empty
        assertThat(bob.getResources()).extracting(Resource::resourceType)
                .containsExactly(ResourceType.BRICK);
        assertThat(game.getActiveTradeOffers()).hasSize(1);
    }

    @Test
    @Disabled("Bug: bankTrade removes paid cards from the player but never deposits them into the bank")
    void bank_trade_returns_paid_cards_to_the_bank() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        GamePlayer alice = player(game, ALICE);
        setHand(alice, ResourceType.LUMBER, 4);
        List<Resource> given = List.copyOf(alice.getResources());

        game.bankTrade(ALICE, given, List.of(ResourceType.BRICK));

        ResourceBank bank = fixture.resourceBank();
        assertThat(bank.available(ResourceType.LUMBER)).isEqualTo(23); // 19 + 4 paid → today stays 19, fails
        assertThat(bank.available(ResourceType.BRICK)).isEqualTo(18);  // 19 - 1 drawn → passes today
    }

    // Helpers

    private static Vertex portVertex(Board board, PortType type) {
        for (Tile tile : board.getTiles()) {
            if (tile.isPort() && tile.getPortType() == type) {
                Edge harbor = Edge.of(tile.getHex(), tile.getHex().neighbor(tile.getPortFacing()));
                return harbor.getVertices().get(0);
            }
        }
        throw new IllegalStateException("No port of type " + type + " on the board");
    }
}