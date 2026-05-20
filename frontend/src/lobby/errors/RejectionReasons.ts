export const LobbyJoinRejectionReason = {
    lobbyNotFound: 'LOBBY_NOT_FOUND',
    lobbyFull: 'LOBBY_FULL',
    nameAlreadyTaken: 'NAME_ALREADY_TAKEN',
    gameAlreadyStarted: 'GAME_ALREADY_STARTED',
} as const;

export type LobbyJoinRejectionReason =
    typeof LobbyJoinRejectionReason[
        keyof typeof LobbyJoinRejectionReason
        ];


export const GameStartRejectionReason = {
    notLeader: 'NOT_LEADER',
    notAllReady: 'NOT_ALL_READY',
} as const;

export type GameStartRejectionReason =
    typeof GameStartRejectionReason[
        keyof typeof GameStartRejectionReason
        ];