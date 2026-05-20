import {GameStartRejectionReason, LobbyJoinRejectionReason} from "@/lobby/errors/RejectionReasons.ts";


export const lobbyJoinRejectionMessages:
    Record<LobbyJoinRejectionReason, string> = {

    [LobbyJoinRejectionReason.lobbyNotFound]:
        'Lobby not found.',

    [LobbyJoinRejectionReason.lobbyFull]:
        'The lobby is already full.',

    [LobbyJoinRejectionReason.nameAlreadyTaken]:
        'That username is already taken.',

    [LobbyJoinRejectionReason.gameAlreadyStarted]:
        'The game has already started.',
};


export const gameStartRejectionMessages:
    Record<GameStartRejectionReason, string> = {

    [GameStartRejectionReason.notLeader]:
        'Only the lobby leader can start the game.',

    [GameStartRejectionReason.notAllReady]:
        'All players must be ready before starting.',
};

export function getLobbyJoinRejectionMessage(
    reason: LobbyJoinRejectionReason
): string {

    return lobbyJoinRejectionMessages[reason];
}


export function getGameStartRejectionMessage(
    reason: GameStartRejectionReason
): string {

    return gameStartRejectionMessages[reason];
}