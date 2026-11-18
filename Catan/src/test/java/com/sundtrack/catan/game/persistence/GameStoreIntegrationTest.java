package com.sundtrack.catan.game.persistence;

import com.sundtrack.catan.game.application.port.GameQueryPort;
import com.sundtrack.catan.game.application.port.GameStorePort;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.event.action.TurnEndAction;
import com.sundtrack.catan.game.domain.event.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.UUID;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
@Transactional
class GameStoreIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired private GameStorePort gameStore;
    @Autowired private GameQueryPort gameQuery;
    @Autowired private GameStateCodec codec;
    @Autowired private JdbcTemplate jdbc;

    @Test
    void saved_active_game_is_loaded_back_losslessly() {
        Game game = aGame().withSetupCompleted().build();
        setHand(player(game, ALICE), ResourceType.LUMBER, 3);
        game.recordEvent(
                new TurnEndAction(BOB),
                EventResult.<ServerEvent>broadcast(new GamePhaseChangedEvent(GamePhase.POST_ROLL)),
                BOB
        );

        gameStore.save(game);

        Game loaded = gameStore.findActive(game.getId()).orElseThrow();

        assertThat(codec.toDocument(loaded)).isEqualTo(codec.toDocument(game));
        assertThat(loaded.getCurrentPhase()).isEqualTo(game.getCurrentPhase());
        assertThat(loaded.getTurnNumber()).isEqualTo(game.getTurnNumber());
        assertThat(loaded.getRecordedEvents()).hasSize(1);
        assertThat(loaded.getRecordedEvents().get(0).action()).isInstanceOf(TurnEndAction.class);
    }

    @Test
    void saving_again_updates_the_same_row_instead_of_inserting_a_new_one() {
        Game game = aGame().withSetupCompleted().build();
        gameStore.save(game);
        long firstVersion = versionOf(game.getId());

        setHand(player(game, ALICE), ResourceType.BRICK, 2);
        gameStore.save(game);

        assertThat(countRows(game.getId())).isEqualTo(1);
        assertThat(versionOf(game.getId())).isGreaterThan(firstVersion);

        Game loaded = gameStore.findActive(game.getId()).orElseThrow();
        assertThat(codec.toDocument(loaded)).isEqualTo(codec.toDocument(game));
    }

    @Test
    void unknown_games_are_not_found_anywhere() {
        UUID unknown = UUID.randomUUID();

        assertThat(gameStore.findActive(unknown)).isEmpty();
        assertThat(gameStore.isActive(unknown)).isFalse();
        assertThat(gameQuery.exists(unknown)).isFalse();
        assertThat(gameQuery.findSnapshot(unknown)).isEmpty();
        assertThat(gameQuery.findEndSummary(unknown)).isEmpty();
    }

    @Test
    void active_games_are_stored_but_have_no_snapshot() {
        Game game = aGame().withSetupCompleted().build();

        gameStore.save(game);

        assertThat(statusOf(game.getId())).isEqualTo("ACTIVE");
        assertThat(jdbc.queryForObject(
                "SELECT state_json FROM game WHERE id = ?", String.class, game.getId()))
                .isNotNull();
        assertThat(gameQuery.findSnapshot(game.getId())).isEmpty();
        assertThat(gameQuery.findEndSummary(game.getId())).isEmpty();
    }

    @Test
    void saving_a_game_over_game_finishes_it_and_writes_snapshots() {
        Game game = aGame().withSetupCompleted().build();
        gameStore.save(game);

        game.getFlow().enterGameOver();
        gameStore.save(game);

        assertThat(gameStore.findActive(game.getId())).isEmpty();
        assertThat(gameStore.isActive(game.getId())).isFalse();
        assertThat(gameQuery.exists(game.getId())).isTrue();
        assertThat(gameQuery.findSnapshot(game.getId())).isPresent();
        assertThat(gameQuery.findEndSummary(game.getId())).isPresent();

        assertThat(statusOf(game.getId())).isEqualTo("FINISHED");
        assertThat(jdbc.queryForObject(
                "SELECT state_json FROM game WHERE id = ?", String.class, game.getId()))
                .isNull();
        assertThat(jdbc.queryForObject(
                "SELECT snapshot_json FROM game WHERE id = ?", String.class, game.getId()))
                .isNotNull();
        assertThat(jdbc.queryForObject(
                "SELECT end_summary_json FROM game WHERE id = ?", String.class, game.getId()))
                .isNotNull();
    }

    @Test
    void abandoned_games_are_not_active_but_remain_stored() {
        Game game = aGame().withSetupCompleted().build();
        gameStore.save(game);

        gameStore.markAbandoned(game.getId());

        assertThat(gameStore.findActive(game.getId())).isEmpty();
        assertThat(gameStore.isActive(game.getId())).isFalse();
        assertThat(gameQuery.exists(game.getId())).isTrue();
        assertThat(statusOf(game.getId())).isEqualTo("ABANDONED");
        assertThat(jdbc.queryForObject(
                "SELECT state_json FROM game WHERE id = ?", String.class, game.getId()))
                .isNotNull();
    }

    @Test
    void counts_follow_status_transitions() {
        long activeBefore = gameStore.countActive();
        long finishedBefore = gameQuery.countFinished();

        Game game = aGame().withSetupCompleted().build();
        gameStore.save(game);

        assertThat(gameStore.countActive()).isEqualTo(activeBefore + 1);

        game.getFlow().enterGameOver();
        gameStore.save(game);

        assertThat(gameStore.countActive()).isEqualTo(activeBefore);
        assertThat(gameQuery.countFinished()).isEqualTo(finishedBefore + 1);
    }

    private long countRows(UUID gameId) {
        Long count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM game WHERE id = ?", Long.class, gameId);
        return count == null ? 0 : count;
    }

    private long versionOf(UUID gameId) {
        Long version = jdbc.queryForObject(
                "SELECT version FROM game WHERE id = ?", Long.class, gameId);
        return version == null ? -1 : version;
    }

    private String statusOf(UUID gameId) {
        return jdbc.queryForObject(
                "SELECT status FROM game WHERE id = ?", String.class, gameId);
    }
}