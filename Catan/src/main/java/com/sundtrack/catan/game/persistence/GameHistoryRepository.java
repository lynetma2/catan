package com.sundtrack.catan.game.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameRecord, UUID> {
}