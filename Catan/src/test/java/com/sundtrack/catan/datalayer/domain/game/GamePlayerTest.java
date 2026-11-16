package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.testsupport.GameFixture.resource;
import static org.assertj.core.api.Assertions.*;

class GamePlayerTest {

    private static GamePlayer player(ResourceType... types) {
        return playerWith(Arrays.stream(types).map(GameFixture_resource -> resource(GameFixture_resource)).toList(), List.of());
    }

    private static GamePlayer playerWith(List<Resource> resources, List<DevelopmentCard> cards) {
        // mutable lists: GamePlayer mutates them in place
        return new GamePlayer(UUID.randomUUID(), "Tester", "#000000",
                new ArrayList<>(resources), new ArrayList<>(cards), 0);
    }

    private static DevelopmentCard card(DevelopmentCardType type, int boughtOnTurn) {
        return new DevelopmentCard(UUID.randomUUID(), type, boughtOnTurn);
    }

    @Nested
    class Resources {

        @Test
        void deduct_removes_exactly_the_road_cost() {
            GamePlayer p = player(ResourceType.LUMBER, ResourceType.BRICK, ResourceType.ORE);

            List<Resource> spent = p.deduct(PieceType.ROAD);

            assertThat(spent).extracting(Resource::resourceType)
                    .containsExactlyInAnyOrder(ResourceType.LUMBER, ResourceType.BRICK);
            assertThat(p.getResources()).extracting(Resource::resourceType)
                    .containsExactly(ResourceType.ORE);
        }

        @Test
        void cannot_afford_a_settlement_without_grain_and_wool() {
            GamePlayer p = player(ResourceType.LUMBER, ResourceType.BRICK);

            assertThatThrownBy(() -> p.validateCanAfford(PieceType.SETTLEMENT))
                    .isInstanceOf(InsufficientResourcesException.class);
        }

        @Test
        void owns_resources_checks_card_identity_not_just_type() {
            Resource mine = resource(ResourceType.LUMBER);
            GamePlayer p = playerWith(List.of(mine), List.of());

            assertThat(p.ownsResources(List.of(mine))).isTrue();
            assertThat(p.ownsResources(List.of(resource(ResourceType.LUMBER)))).isFalse();
        }

        @Test
        void removing_a_card_you_dont_own_throws() {
            GamePlayer p = player(ResourceType.LUMBER);

            assertThatThrownBy(() -> p.removeResourcesById(List.of(UUID.randomUUID())))
                    .isInstanceOf(ResourceNotOwnedException.class);
        }

        @Test
        void steal_takes_the_only_card_and_empties_the_hand() {
            GamePlayer p = player(ResourceType.LUMBER);

            Resource stolen = p.steal();

            assertThat(stolen.resourceType()).isEqualTo(ResourceType.LUMBER);
            assertThat(p.hasResources()).isFalse();
        }
    }

    @Nested
    class DevelopmentCards {

        @Test
        void a_card_bought_this_turn_is_not_playable() {
            DevelopmentCard knight = card(DevelopmentCardType.KNIGHT, 2);
            GamePlayer p = playerWith(List.of(), List.of(knight));

            assertThatThrownBy(() -> p.useDevelopmentCard(knight.getId(), DevelopmentCardType.KNIGHT, 2))
                    .isInstanceOf(DevelopmentCardNotPlayableException.class);
        }

        @Test
        void a_card_bought_on_an_earlier_turn_is_playable_and_consumed() {
            DevelopmentCard knight = card(DevelopmentCardType.KNIGHT, 1);
            GamePlayer p = playerWith(List.of(), List.of(knight));

            DevelopmentCard played = p.useDevelopmentCard(knight.getId(), DevelopmentCardType.KNIGHT, 2);

            assertThat(played.getId()).isEqualTo(knight.getId());
            assertThat(p.getDevelopmentCardCount()).isZero();
        }

        @Test
        void playing_a_card_you_dont_own_throws() {
            GamePlayer p = playerWith(List.of(), List.of());

            assertThatThrownBy(() -> p.useDevelopmentCard(UUID.randomUUID(), DevelopmentCardType.KNIGHT, 5))
                    .isInstanceOf(DevelopmentCardNotOwnedException.class);
        }

        @Test
        void playing_the_wrong_card_type_throws() {
            DevelopmentCard knight = card(DevelopmentCardType.KNIGHT, 0);
            GamePlayer p = playerWith(List.of(), List.of(knight));

            assertThatThrownBy(() -> p.useDevelopmentCard(knight.getId(), DevelopmentCardType.MONOPOLY, 5))
                    .isInstanceOf(WrongDevelopmentCardTypeException.class);
        }

        @Test
        void victory_point_cards_are_counted_separately() {
            GamePlayer p = playerWith(List.of(), List.of(
                    card(DevelopmentCardType.VICTORY_POINT, 0),
                    card(DevelopmentCardType.VICTORY_POINT, 0),
                    card(DevelopmentCardType.KNIGHT, 0)));

            assertThat(p.getVictoryPointCardCount()).isEqualTo(2);
        }
    }
}