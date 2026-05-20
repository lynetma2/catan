import type {DeepValueOf} from "@/events/shared/EventUtils.ts";

export const LobbyEventType = {
    action: {
        create: 'action.lobby.create',
        join: 'action.lobby.join',
        ready: 'action.lobby.ready',
        unready: 'action.lobby.unready',
        gameStart: 'action.game.start',
    },

    server: {
        created: 'server.lobby.created',

        playerJoined:
            'server.lobby.player.joined',

        playerReady:
            'server.lobby.player.ready',

        playerUnready:
            'server.lobby.player.unready',

        playerDisconnected:
            'server.lobby.player.disconnected',

        stateUpdated:
            'server.lobby.state.updated',

        gameInitialized:
            'server.game.initialized',

        joinRejected:
            'server.lobby.join.rejected',

        gameStartRejected:
            'server.game.start.rejected',
    },
} as const;

export type LobbyEventType =
    DeepValueOf<typeof LobbyEventType>;