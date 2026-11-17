package com.sundtrack.catan.game.persistence;

import com.sundtrack.catan.game.domain.*;
import com.sundtrack.catan.game.domain.building.Building;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.game.domain.event.action.resource.GameDiscardAction;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.trade.TradeOffer;
import com.sundtrack.catan.game.domain.trade.TradeOfferResponseKind;
import com.sundtrack.catan.game.persistence.state.GameStateDocument;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameStateCodecTest {

    private final GameStateCodec codec = new GameStateCodec();

    private Game roundTrip(Game game) {
        return codec.toGame(codec.toDocument(game));
    }

    /** Re-encoding a restored game must produce an identical document. */
    private void assertReencodeStable(Game game) {
        GameStateDocument once = codec.toDocument(game);
        GameStateDocument twice = codec.toDocument(codec.toGame(once));
        assertThat(twice).as("re-encoding a restored game").isEqualTo(once);
    }

    private static Set<UUID> resourceIds(Game g) {
        return g.getPlayers().stream().flatMap(p -> p.getResources().stream())
                .map(Resource::uid).collect(Collectors.toSet());
    }
    private static Set<UUID> resourceIdsOf(GamePlayer p) {
        return p.getResources().stream().map(Resource::uid).collect(Collectors.toSet());
    }
    private static Set<UUID> devCardIds(Game g) {
        return g.getPlayers().stream().flatMap(p -> p.getDevelopmentCards().stream())
                .map(DevelopmentCard::getId).collect(Collectors.toSet());
    }
    private static Set<UUID> buildingIds(Game g) {
        return g.getBoard().getBuildings().stream()
                .map(Building::getId).collect(Collectors.toSet());
    }
    private static Set<UUID> offeredResourceIds(Game g) {
        return g.getActiveTradeOffers().stream().flatMap(o -> o.getOfferedResources().stream())
                .map(Resource::uid).collect(Collectors.toSet());
    }

    @Nested
    class FlowAndTurnState {

        @Test
        void setup_phase_survives_restore() {
            Game game = aGame().build(); // mid-setup, SetupFlow active
            Game restored = roundTrip(game);

            assertThat(restored.getCurrentPhase()).isEqualTo(game.getCurrentPhase());
            assertThat(restored.getCurrentPlayerId()).isEqualTo(game.getCurrentPlayerId());
            assertReencodeStable(game);
        }

        @Test
        void mid_discard_state_survives_and_can_complete() {
            Game game = aGame().withDiceSeed(42).withSetupCompleted().build();
            setHand(player(game, ALICE), ResourceType.LUMBER, 8);
            game.rollDice(); // 7 -> Alice must discard 4

            Game restored = roundTrip(game);

            assertThat(restored.getCurrentPhase()).isEqualTo(GamePhase.DISCARD);
            assertThat(restored.getPendingRequiredDiscards()).containsExactly(Map.entry(ALICE, 4));

            List<UUID> ids = player(restored, ALICE).getResources().stream()
                    .limit(4).map(Resource::uid).toList();
            restored.discard(new GameDiscardAction(ids), ALICE);

            assertThat(restored.getCurrentPhase()).isEqualTo(GamePhase.ROBBER_PLACEMENT);
        }

        @Test
        void dice_sequence_continues_correctly_after_mid_game_restore() {
            Game game = aGame().withDiceSeed(4).withSetupCompleted().build();
            game.rollDice();        // consume roll #1
            game.advanceTurn();     // back to PRE_ROLL so we can roll again

            Game restored = roundTrip(game);

            assertThat(restored.rollDice().roll().total())
                    .isEqualTo(game.rollDice().roll().total());   // both produce roll #2
        }

        @Test
        void road_building_flow_survives_restore() {
            Game game = aGame().withSetupCompleted().build();
            game.advanceTurn();
            GamePlayer bob = player(game, BOB);
            DevelopmentCard card = new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.ROAD_BUILDING, 0);
            bob.addDevelopmentCard(card);
            game.playRoadBuildingCard(BOB, card.getId());

            Game restored = roundTrip(game);

            assertThat(restored.getCurrentPhase()).isEqualTo(GamePhase.ROAD_BUILDING);
            assertThat(restored.getRoadsRequired()).isEqualTo(game.getRoadsRequired());
            assertThat(restored.getRoadsPlaced()).isEqualTo(game.getRoadsPlaced());
        }

        @Test
        void restored_game_can_continue_play() {
            Game restored = roundTrip(aGame().withDiceSeed(4).withSetupCompleted().build());

            Game.RollOutcome outcome = restored.rollDice();

            assertThat(outcome.roll().total()).isEqualTo(8);
            assertThat(restored.getCurrentPhase()).isEqualTo(GamePhase.POST_ROLL);
        }
    }

    @Nested
    class IdentityBasedReferences {

        // These two expose the UUID-regeneration bug: they reference a card/resource
        // by its ORIGINAL id, which the current codec throws away on restore.

        @Test
        void in_flight_trade_can_still_be_confirmed_after_restore() {
            Game game = aGame().withSetupCompleted().build();
            GamePlayer alice = player(game, ALICE);
            setHand(alice, ResourceType.LUMBER, 2);
            setHand(player(game, BOB), ResourceType.BRICK, 1);

            TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
            game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);

            Game restored = roundTrip(game);
            restored.confirmTrade(ALICE, BOB, offer.getTradeOfferId());

            assertThat(player(restored, ALICE).getResources())
                    .extracting(Resource::resourceType).containsExactly(ResourceType.BRICK);
        }

        @Test
        void dev_card_can_still_be_played_by_original_id_after_restore() {
            Game game = aGame().withSetupCompleted().build();
            game.advanceTurn();
            GamePlayer bob = player(game, BOB);
            DevelopmentCard knight = new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.KNIGHT, 0);
            bob.addDevelopmentCard(knight);

            Game restored = roundTrip(game);
            restored.playKnightCard(BOB, knight.getId());

            assertThat(player(restored, BOB).getKnightsUsed()).isEqualTo(1);
        }
    }

    @Nested
    class BanksAndAwards {

        @Test
        void dev_deck_order_is_preserved_exactly() {
            Game game = aGame().withSetupCompleted().build();
            Game restored = roundTrip(game);

            assertThat(restored.getDevelopmentCardBank().getRemainingDeck())
                    .isEqualTo(game.getDevelopmentCardBank().getRemainingDeck());
        }

        @Test
        void resource_bank_counts_are_preserved() {
            Game game = aGame().withSetupCompleted().build();
            setHand(player(game, ALICE), ResourceType.LUMBER, 4);
            game.bankTrade(ALICE, List.copyOf(player(game, ALICE).getResources()), List.of(ResourceType.BRICK));

            Game restored = roundTrip(game);

            for (ResourceType type : ResourceType.values()) {
                assertThat(restored.getResourceBank().available(type))
                        .as("bank stock of %s", type)
                        .isEqualTo(game.getResourceBank().available(type));
            }
        }

        @Test
        void largest_army_holder_is_preserved() {
            Game game = aGame().withSetupCompleted().build();
            game.advanceTurn();
            GamePlayer bob = player(game, BOB);
            for (int i = 0; i < 3; i++) {
                DevelopmentCard knight = new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.KNIGHT, 0);
                bob.addDevelopmentCard(knight);
                game.playKnightCard(BOB, knight.getId());
            }
            assertThat(game.hasLargestArmy(BOB)).isTrue();

            Game restored = roundTrip(game);

            assertThat(restored.hasLargestArmy(BOB)).isTrue();
            assertThat(restored.hasLargestArmy(ALICE)).isFalse();
        }
    }

    @Nested
    class IdentityIntegrityTest {

        @Test
        void every_identity_survives_a_round_trip() {
            Game game = aGame().withSetupCompleted().build();
            GamePlayer alice = player(game, ALICE);
            setHand(alice, ResourceType.LUMBER, 3);
            setHand(player(game, BOB), ResourceType.BRICK, 1);
            alice.addDevelopmentCard(new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.KNIGHT, 0));
            TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
            game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);

            Game restored = roundTrip(game);

            assertThat(resourceIds(restored)).isEqualTo(resourceIds(game));
            assertThat(devCardIds(restored)).isEqualTo(devCardIds(game));
            assertThat(buildingIds(restored)).isEqualTo(buildingIds(game));
            assertThat(offeredResourceIds(restored)).isEqualTo(offeredResourceIds(game));
        }

        @Test
        void trade_offer_still_points_at_real_cards_in_the_hand_after_restore() {
            Game game = aGame().withSetupCompleted().build();
            GamePlayer alice = player(game, ALICE);
            setHand(alice, ResourceType.LUMBER, 2);
            setHand(player(game, BOB), ResourceType.BRICK, 1);
            TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
            game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);

            Game restored = roundTrip(game);

            Set<UUID> handIds = resourceIdsOf(player(restored, ALICE));
            Set<UUID> offeredIds = restored.getActiveTradeOffers().get(0).getOfferedResources()
                    .stream().map(Resource::uid).collect(Collectors.toSet());

            assertThat(handIds).containsAll(offeredIds);   // offer references cards that actually exist
        }

        @Test
        void in_flight_trade_can_be_confirmed_after_restore() {
            Game game = aGame().withSetupCompleted().build();
            GamePlayer alice = player(game, ALICE);
            setHand(alice, ResourceType.LUMBER, 2);
            setHand(player(game, BOB), ResourceType.BRICK, 1);
            TradeOffer offer = game.startTrade(ALICE, List.copyOf(alice.getResources()), List.of(ResourceType.BRICK));
            game.respondToTrade(BOB, offer.getTradeOfferId(), TradeOfferResponseKind.ACCEPT);

            Game restored = roundTrip(game);
            restored.confirmTrade(ALICE, BOB, offer.getTradeOfferId());

            assertThat(player(restored, ALICE).getResources())
                    .extracting(Resource::resourceType).containsExactly(ResourceType.BRICK);
            assertThat(player(restored, BOB).getResources())
                    .extracting(Resource::resourceType)
                    .containsExactly(ResourceType.LUMBER, ResourceType.LUMBER);
        }

        @Test
        void dev_card_can_be_played_by_its_original_id_after_restore() {
            Game game = aGame().withSetupCompleted().build();
            game.advanceTurn();
            GamePlayer bob = player(game, BOB);
            DevelopmentCard knight = new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.KNIGHT, 0);
            bob.addDevelopmentCard(knight);

            Game restored = roundTrip(game);
            restored.playKnightCard(BOB, knight.getId());   // the ORIGINAL id, not re-fetched

            assertThat(player(restored, BOB).getKnightsUsed()).isEqualTo(1);
            assertThat(player(restored, BOB).getDevelopmentCardCount()).isZero();
        }
    }

}