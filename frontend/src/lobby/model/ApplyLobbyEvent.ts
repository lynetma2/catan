import type {Lobby} from "@/lobby/model/Lobby.ts";
import type {LobbyMutatingEvent} from "./LobbyMutatingEvent.ts";
import {LobbyEventType} from "@/events/lobby/LobbyEvents.ts";

export function applyLobbyEvent(
    lobby: Lobby,
    event: LobbyMutatingEvent
): Lobby {
    switch (event.type) {
        case LobbyEventType.server.playerJoined: {
            const players = new Map(lobby.players);
            players.set(event.playerId, {
                playerId: event.playerId,
                username: event.playerName,
                isReady: false,
                isLeader: event.isLeader,
            });

            return {
                ...lobby,
                players,
            };
        }

        case LobbyEventType.server.playerReady: {
            const players = new Map(lobby.players);
            const player = players.get(event.playerId);

            if (player) {
                players.set(event.playerId, {
                    ...player,
                    isReady: true,
                });
            }

            return {
                ...lobby,
                players,
            };
        }

        case LobbyEventType.server.playerUnready: {
            const players = new Map(lobby.players);
            const player = players.get(event.playerId);

            if (player) {
                players.set(event.playerId, {
                    ...player,
                    isReady: false,
                });
            }

            return {
                ...lobby,
                players,
            };
        }

        case LobbyEventType.server.playerDisconnected: {
            const players = new Map(lobby.players);
            players.delete(event.playerId);

            return {
                ...lobby,
                players,
            };
        }

        case LobbyEventType.server.state: {
            const players = new Map(
                event.snapshot.players.map((player) => [
                    player.playerId,
                    player,
                ])
            );

            return {
                lobbyId: event.lobbyId,
                players,
            };
        }

        default:
            // Exhaustiveness check – if you miss a case, TypeScript will error here
            const _exhaustive: never = event;
            return lobby;
    }
}