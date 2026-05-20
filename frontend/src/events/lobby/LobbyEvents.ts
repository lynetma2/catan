import type {DeepValueOf} from "@/events/shared/EventUtils.ts";
import {namespace} from "@/events/shared/EventNamespace.ts";

const lobbyAction =
    namespace('action.lobby');

const lobbyServer =
    namespace('server.lobby');

const gameAction =
    namespace('action.game');

const gameServer =
    namespace('server.game');

export const LobbyEventType = {

    action: lobbyAction({

        create: 'create',

        join: 'join',

        ready: 'ready',

        unready: 'unready',
    }),

    server: lobbyServer({

        created: 'created',

        playerJoined:
            'player.joined',

        playerReady:
            'player.ready',

        playerUnready:
            'player.unready',

        playerDisconnected:
            'player.disconnected',

        state:
            'state',

        joinRejected:
            'join.rejected',
    }),

    game: {

        action: gameAction({

            start: 'start',
        }),

        server: gameServer({

            initialized:
                'initialized',

            startRejected:
                'start.rejected',
        }),
    },

} as const;

export type LobbyEventType =
    DeepValueOf<typeof LobbyEventType>;