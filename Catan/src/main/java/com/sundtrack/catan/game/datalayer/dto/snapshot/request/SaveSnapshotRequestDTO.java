package com.sundtrack.catan.game.datalayer.dto.snapshot.request;

import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;

public record SaveSnapshotRequestDTO<T> (String name, T snapshot){}
