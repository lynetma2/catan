package com.sundtrack.catan.game.persistence;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

interface GameRepository extends CrudRepository<GameRow, UUID> {
    Optional<GameRow> findByIdAndStatus(UUID id, String status);
    long countByStatus(String status);
}