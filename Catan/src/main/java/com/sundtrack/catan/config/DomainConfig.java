package com.sundtrack.catan.config;

import com.sundtrack.catan.game.domain.board.BoardFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DomainConfig {

    @Bean
    public BoardFactory boardFactory() {
        return new BoardFactory();
    }
}