import {useWebSocket} from '@/WebSocketContext';
import type {
    GameStartRequestedEvent,
    LobbyJoinRequestedEvent,
    PlayerReadyRequestedEvent,
    PlayerUnreadyRequestedEvent,
} from '@/lobby/LobbyEvents';

export function useLobbyActions(lobbyId: string) {
    const {sendMessage} = useWebSocket();

    function reconnectLobby(username: string) {
        const event: LobbyJoinRequestedEvent = {
            type: 'LOBBY_JOIN_REQUESTED',
            playerName: username,
        };
        sendMessage(`/app/lobby/${lobbyId}/events`, event);
    }

    function setReady() {
        const event: PlayerReadyRequestedEvent = {
            type: 'PLAYER_READY_REQUESTED'
        };
        sendMessage(`/app/lobby/${lobbyId}/events`, event);
        console.log("Send event", event);
    }

    function setUnready() {
        const event: PlayerUnreadyRequestedEvent = {
            type: 'PLAYER_UNREADY_REQUESTED'
        };
        sendMessage(`/app/lobby/${lobbyId}/events`, event);
        console.log("Send event", event);
    }

    function startGame() {
        const event: GameStartRequestedEvent = {
            type: 'GAME_START_REQUESTED'
        };
        sendMessage(`/app/lobby/${lobbyId}/events`, event);
    }

    return {reconnectLobby, setReady, setUnready, startGame};
}