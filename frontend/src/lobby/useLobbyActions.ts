import { useWebSocket } from '@/WebSocketContext';
import {
    LobbyActionEventCreators,
} from '@/events/lobby/LobbyActionEvents';

export function useLobbyActions(lobbyId: string) {
    const { sendMessage } = useWebSocket();

    const endpoint = `/app/lobby/${lobbyId}/events`;

    function reconnectLobby(username: string) {
        sendMessage(
            endpoint,
            LobbyActionEventCreators.join(username)
        );
    }

    function setReady() {
        sendMessage(
            endpoint,
            LobbyActionEventCreators.player.ready()
        );

        console.log("Send event: ready");
    }

    function setUnready() {
        sendMessage(
            endpoint,
            LobbyActionEventCreators.player.unready()
        );

        console.log("Send event: unready");
    }

    function startGame() {
        sendMessage(endpoint, LobbyActionEventCreators.start());
        console.log("Send event: start game");
    }

    return {
        reconnectLobby,
        setReady,
        setUnready,
        startGame,
    };
}