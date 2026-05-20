import {LobbyEventType} from "@/events/lobby/LobbyEvents.ts";
import type {GameStartRejectionReason, LobbyJoinRejectionReason} from "@/lobby/errors/RejectionReasons.ts";

export interface LobbyEventPayloads {

    // -------------------------
    // Actions
    // -------------------------

    [LobbyEventType.action.create]: {
        playerName: string;
    };

    [LobbyEventType.action.join]: {
        lobbyId: string;
        playerName: string;
    };

    [LobbyEventType.action.ready]: undefined;

    [LobbyEventType.action.unready]: undefined;

    [LobbyEventType.action.gameStart]: undefined;


    // -------------------------
    // Server Events
    // -------------------------

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

    [LobbyEventType.server.gameInitialized]:
        undefined;

    [LobbyEventType.server.joinRejected]: {
        reason: LobbyJoinRejectionReason;
    };

    [LobbyEventType.server.gameStartRejected]: {
        reason: GameStartRejectionReason;
    };

    [LobbyEventType.server.stateUpdated]: {
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
}