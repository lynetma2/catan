import type {LobbyServerEvent} from "@/events/lobby/LobbyTypes.ts";


type ServerEventHandlers = {
    [E in LobbyServerEvent as E['type']]?: (event: E) => void;
};

export function handleLobbyEvent(event: LobbyServerEvent, handlers: ServerEventHandlers) {
    const handler = handlers[event.type as keyof ServerEventHandlers];
    if (handler) {
        (handler as (e: LobbyServerEvent) => void)(event);
    }
}