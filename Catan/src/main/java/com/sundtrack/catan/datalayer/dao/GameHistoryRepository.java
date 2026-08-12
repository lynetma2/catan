package com.sundtrack.catan.datalayer.dao;

import com.sundtrack.catan.datalayer.persistance.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameRecord, UUID> {
}