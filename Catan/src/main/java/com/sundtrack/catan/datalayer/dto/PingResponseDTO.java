package com.sundtrack.catan.datalayer.dto;

import java.time.LocalDateTime;

public record PingResponseDTO(String status, LocalDateTime localDateTime) {
}
