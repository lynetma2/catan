// ---------------------------------------------------------------------------
// Event type constants
// ---------------------------------------------------------------------------

export const LobbyEvents = {
    action: {
        create: 'action.lobby.create',
        join: 'action.lobby.join',
    },

    player: {
        ready: 'action.player.ready',
        unready: 'action.player.unready',
    },

    game: {
        start: 'action.game.start',
    },

    server: {
        lobby: {
            created: 'server.lobby.created',
            state: 'server.lobby.state',
            joinRejected: 'server.lobby.join_rejected',
            notFound: 'server.lobby.not_found',
        },

        player: {
            joined: 'server.lobby.player.joined',
            ready: 'server.lobby.player.ready',
            unready: 'server.lobby.player.unready',
            disconnected: 'server.lobby.player.disconnected',
        },

        game: {
            initialized: 'server.game.initialized',
            startRejected: 'server.game.start_rejected',
        },
    },
} as const;

// ---------------------------------------------------------------------------
// Payload map
// ---------------------------------------------------------------------------

export interface LobbyEventPayloads {
    [LobbyEvents.action.create]: {
        playerName: string;
    };

    [LobbyEvents.action.join]: {
        playerName: string;
    };

    [LobbyEvents.player.ready]: Record<never, never>;
    [LobbyEvents.player.unready]: Record<never, never>;
    [LobbyEvents.game.start]: Record<never, never>;

    [LobbyEvents.server.lobby.created]: {
        lobbyId: string;
        playerId: string;
        playerName: string;
    };

    [LobbyEvents.server.lobby.state]: {
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

    [LobbyEvents.server.lobby.joinRejected]: {
        reason: string;
    };

    [LobbyEvents.server.player.joined]: {
        lobbyId: string;
        playerId: string;
        playerName: string;
        isLeader: boolean;
    };

    [LobbyEvents.server.player.ready]: {
        playerId: string;
    };

    [LobbyEvents.server.player.unready]: {
        playerId: string;
    };

    [LobbyEvents.server.player.disconnected]: {
        playerId: string;
    };

    [LobbyEvents.server.game.initialized]: Record<never, never>;

    [LobbyEvents.server.game.startRejected]: {
        reason: string;
    };
}