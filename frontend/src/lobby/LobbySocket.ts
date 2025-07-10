import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs';
import {Lobby} from "./Lobby.ts";
import type {LobbyEvent} from "./LobbyEvent.ts";

export class LobbySocket {
    public static lobbyURL = "http://localhost:8080/ws";
    public socket: WebSocket;
    public stompClient: Client;
    public lobbyId?: number;

    constructor() {
        this.socket = new SockJS(LobbySocket.lobbyURL);
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            debug: (str: string) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket server!');
            },
            onStompError: (frame) => console.error(frame),
        });
        this.activate();
    }

    public activate() {
        this.stompClient.activate();
    }

    public deactivate() {
        this.stompClient.deactivate().then(() => {
                console.log('Deactivated!');
            }
        );
    }

    private addStatusSubscription(lobbyId: number, onLobbyUpdate: (newLobby: Lobby) => void) {
        this.lobbyId = lobbyId;
        this.stompClient.subscribe(`/lobby/status/${lobbyId}`, (response) => {
            const lobby = JSON.parse(response.body);
            if (!lobby.players) {
                //Some error happened
                console.error("Wrongly formatted lobby from the server!");
                return;
            }
            //TODO check that it is actually a map (JSON does natively handle maps)
            const newLobby = new Lobby(lobby.players);
            onLobbyUpdate(newLobby);
            return;
        });
    }

    public joinLobby(playerName: string, lobbyId: number, onLobbyUpdate: (newLobby: Lobby) => void) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("Stomp client not connected!");
            return;
        }

        this.addStatusSubscription(lobbyId, onLobbyUpdate);

        console.log(`Joining lobby ${lobbyId}...`);
        this.stompClient.publish({
            destination: `/lobby/join/${lobbyId}`,
            body: JSON.stringify({'playerName': playerName}),
        });
    }

    public newLobby(playerName: string, onLobbyUpdate: (newLobby: Lobby) => void) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("Stomp client not connected!");
            return;
        }

        this.stompClient.subscribe('/lobby/new', response => {
            console.log("subcription event on /lobby/new:", response.body);
            const nLobby = JSON.parse(response.body);
            //TODO check that the response is what is expected.

            this.lobbyId = nLobby.id;
            const newLobby = new Lobby(nLobby.lobby.players);
            onLobbyUpdate(newLobby);
            this.addStatusSubscription(nLobby.id, onLobbyUpdate);
            this.stompClient.unsubscribe('/lobby/new');
        });

        this.stompClient.publish({
            destination: "/lobby/new",
            body: JSON.stringify({'playerName': playerName}),
        });
        console.log("Published /lobby/new");
    }

    public sendEvent(event: LobbyEvent) {
        if (!this.stompClient || !this.stompClient.connected || !this.lobbyId) {
            console.error("Stomp client not connected!");
            return;
        }

        this.stompClient.publish({
            destination: `/lobby/event/${this.lobbyId}`,
            body: JSON.stringify(event),
        });
    }
}