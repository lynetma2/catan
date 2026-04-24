package com.sundtrack.catan.session.shared.dto.request;

public record SaveSnapshotRequestDTO<T> (String name, T snapshot){}
