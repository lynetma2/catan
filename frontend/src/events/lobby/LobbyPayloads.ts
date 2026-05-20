import {LobbyEventType} from "@/events/lobby/LobbyEvents.ts";

import type {GameStartRejectionReason, LobbyJoinRejectionReason} from "@/lobby/errors/RejectionReasons.ts";

export interface LobbyEventPayloads {

    // =====================================================
    // Lobby Actions
    // =====================================================

    [LobbyEventType.action.create]: {
        playerName: string;
    };

    [LobbyEventType.action.join]: {
        lobbyId: string;
        playerName: string;
    };

    [LobbyEventType.action.ready]:
        undefined;

    [LobbyEventType.action.unready]:
        undefined;


    // =====================================================
    // Game Actions
    // =====================================================

    [LobbyEventType.game.action.start]:
        undefined;


    // =====================================================
    // Lobby Server Events
    // =====================================================

    [LobbyEventType.server.created]: {
        lobbyId: string;
        playerId: string;
        playerName: string;
    };

    [LobbyEventType.server.playerJoined]: {
        lobbyId: string;
        playerId: string;
        playerName: string;
        isLeader: boolean;
    };

    [LobbyEventType.server.playerReady]: {
        playerId: string;
    };

    [LobbyEventType.server.playerUnready]: {
        playerId: string;
    };

    [LobbyEventType.server.playerDisconnected]: {
        playerId: string;
    };

    [LobbyEventType.server.joinRejected]: {
        reason: LobbyJoinRejectionReason;
    };

    [LobbyEventType.server.state]: {
        lobbyId: string;
        localPlayerId: string;
        snapshot: {
            players: Array<{
                playerId: string;
                username: string;
                isReady: boolean;
                isLeader: boolean;
            }>;
        };
    };


    // =====================================================
    // Game Server Events
    // =====================================================

    [LobbyEventType.game.server.initialized]:
        undefined;

    [LobbyEventType.game.server.startRejected]: {
        reason: GameStartRejectionReason;
    };
}