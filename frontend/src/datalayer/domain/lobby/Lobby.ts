export type Player = {
    playerId: string;
    username: string;
    isReady: boolean;
    isLeader: boolean;
};

export type Lobby = {
    lobbyId: string;
    players: Record<string, Player>;
};