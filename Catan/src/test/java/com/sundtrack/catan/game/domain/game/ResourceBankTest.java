package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.exceptions.validation.InsufficientBankResourcesException;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.ResourceBank;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.resource;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ResourceBankTest {

    private final ResourceBank standardBank = ResourceBank.standard();

    @Test
    void standard_bank_holds_19_of_each_type() {
        for (ResourceType type : ResourceType.values()) {
            assertThat(standardBank.available(type))
                    .as("bank stock of %s", type)
                    .isEqualTo(19);
        }
    }

    @Test
    void draw_removes_and_deposit_returns() {
        List<Resource> drawn = standardBank.draw(ResourceType.LUMBER, 3);

        assertThat(drawn).hasSize(3)
                .allMatch(r -> r.resourceType() == ResourceType.LUMBER);
        assertThat(standardBank.available(ResourceType.LUMBER)).isEqualTo(16);

        standardBank.deposit(drawn);
        assertThat(standardBank.available(ResourceType.LUMBER)).isEqualTo(19);
    }

    @Test
    void drawing_exactly_the_available_amount_succeeds_and_empties_the_bank() {
        ResourceBank bank = new ResourceBank(Map.of(ResourceType.ORE, 2));

        List<Resource> drawn = bank.draw(ResourceType.ORE, 2);

        assertThat(drawn).hasSize(2);
        assertThat(bank.available(ResourceType.ORE)).isZero();
    }

    @Test
    void overdraw_fails_and_changes_nothing() {
        ResourceBank bank = new ResourceBank(Map.of(ResourceType.ORE, 2));

        assertThatThrownBy(() -> bank.draw(ResourceType.ORE, 3))
                .isInstanceOf(InsufficientBankResourcesException.class);

        assertThat(bank.available(ResourceType.ORE)).isEqualTo(2);
    }

    @Test
    void deposit_counts_each_type_in_a_mixed_list() {
        ResourceBank bank = new ResourceBank(Map.of(ResourceType.LUMBER, 1, ResourceType.BRICK, 2));

        bank.deposit(List.of(
                resource(ResourceType.LUMBER),
                resource(ResourceType.BRICK),
                resource(ResourceType.BRICK)));

        assertThat(bank.available(ResourceType.LUMBER)).isEqualTo(2);
        assertThat(bank.available(ResourceType.BRICK)).isEqualTo(4);
    }

    @Test
    void is_available_checks_the_exact_amount() {
        ResourceBank bank = new ResourceBank(Map.of(ResourceType.ORE, 2));

        assertThat(bank.isAvailable(ResourceType.ORE, 2)).isTrue();
        assertThat(bank.isAvailable(ResourceType.ORE, 3)).isFalse();
    }
}