import { LobbyActionEvents }
    from "@/events/lobby/LobbyActionEvents";

import { LobbyServerEvents }
    from "@/events/lobby/LobbyServerEvents";

export const AppEvents = {
    action: {
        lobby: LobbyActionEvents,
    },
    server: {
        lobby: LobbyServerEvents,
    },
} as const;