package com.sundtrack.catan.session.api.request;

public record SaveSnapshotRequestDTO<T> (String name, T snapshot){}
