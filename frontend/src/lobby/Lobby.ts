import type {
    GameInitializedEvent,
    OutboundLobbyEvent,
    PlayerDisconnectedEvent,
    PlayerJoinedLobbyEvent,
    PlayerReadyEvent,
    PlayerUnreadyEvent,
} from "@/lobby/LobbyEvents.ts";

export type Player = {
    playerId: string;
    username: string;
    isReady: boolean;
    isLeader: boolean;
};

export type Lobby = {
    lobbyId: string;
    players: Map<string, Player>; // keyed by playerId
};

// Only the events that actually mutate lobby state
type LobbyMutatingEvent =
    | PlayerJoinedLobbyEvent
    | PlayerReadyEvent
    | PlayerUnreadyEvent
    | PlayerDisconnectedEvent;

export function applyLobbyEvent(lobby: Lobby, event: LobbyMutatingEvent): Lobby {
    switch (event.type) {
        case 'PLAYER_JOINED_LOBBY': {
            const players = new Map(lobby.players);
            players.set(event.playerId, {
                playerId: event.playerId,
                username: event.playerName,
                isReady: false,
                isLeader: event.isLeader,
            });
            return { ...lobby, players };
        }
        case 'PLAYER_READY': {
            const players = new Map(lobby.players);
            const player = players.get(event.playerId);
            if (player) players.set(event.playerId, { ...player, isReady: true });
            return { ...lobby, players };
        }
        case 'PLAYER_UNREADY': {
            const players = new Map(lobby.players);
            const player = players.get(event.playerId);
            if (player) players.set(event.playerId, { ...player, isReady: false });
            return { ...lobby, players };
        }
        case 'PLAYER_DISCONNECTED': {
            const players = new Map(lobby.players);
            console.log("map before: ", players);
            players.delete(event.playerId);
            console.log("map after: ", players);
            return { ...lobby, players };
        }
    }
}