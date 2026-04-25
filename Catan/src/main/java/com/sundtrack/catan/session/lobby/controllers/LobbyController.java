package com.sundtrack.catan.session.lobby.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class LobbyController {

    // No lobbyId yet — create flow
    @MessageMapping("/lobby")
    public void handleCreate() {

    }

    // LobbyId known — all other lobby actions
    @MessageMapping("/lobby/{lobbyId}/events")
    public void handleEvent(@DestinationVariable UUID lobbyId) {

    }
}