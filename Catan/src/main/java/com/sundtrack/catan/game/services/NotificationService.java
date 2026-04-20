//package com.sundtrack.catan.game.services;
//
//import com.sundtrack.catan.game.datalayer.dto.events.GameEvent;
//import com.sundtrack.catan.game.datalayer.dto.events.TransferResourcesEventDTO;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class NotificationService {
//
//    private final SimpMessagingTemplate template;
//
//    public NotificationService(SimpMessagingTemplate template) {
//        this.template = template;
//    }
//
//    public void broadcastEvents(int lobbyId, List<GameEvent> events) {
//        for (GameEvent event : events) {
//            if (event instanceof TransferResourcesEventDTO tr) {
//                handleTransferResources(lobbyId, tr);
//            } else {
//                // Default public broadcast
//                template.convertAndSend("/game/status/" + lobbyId, event);
//            }
//        }
//    }
//
//    private void handleTransferResources(int lobbyId, TransferResourcesEventDTO event) {
//        boolean isBankInteraction = "Bank".equals(event.fromPlayerId()) || "Bank".equals(event.toPlayerId());
//
//        if (isBankInteraction) {
//            // Public: Everyone sees exactly what was paid/received.
//            template.convertAndSend("/game/status/" + lobbyId, event);
//        } else {
//            // Player to Player (e.g., Steal)
//            // 1. Public (Blind): Observers see count, but not resources.
//            TransferResourcesEventDTO blindEvent = new TransferResourcesEventDTO(
//                    event.playerId(),
//                    event.fromPlayerId(),
//                    event.toPlayerId(),
//                    null, // Hide resources
//                    event.count()
//            );
//            template.convertAndSend("/game/status/" + lobbyId, blindEvent);
//
//            // 2. Private (Reveal): Participants see resources.
//            // Frontend must subscribe to /user/queue/game/status/{lobbyId}
//            template.convertAndSendToUser(event.fromPlayerId(), "/queue/game/status/" + lobbyId, event);
//            template.convertAndSendToUser(event.toPlayerId(), "/queue/game/status/" + lobbyId, event);
//        }
//    }
//}