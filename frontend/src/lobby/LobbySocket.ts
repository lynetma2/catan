import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs';
import {Lobby} from "./Lobby.ts";
import type {LobbyEvent} from "./LobbyEvent.ts";

export class LobbySocket {
    public static lobbyURL = "http://localhost:8080/ws";
    public socket?: WebSocket;
    public stompClient?: Client;
    public lobbyId?: number;

    constructor() {
        //Empty cuz relying on third parties to become initialized
    }

    public async init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket = new SockJS(LobbySocket.lobbyURL);
            this.stompClient = new Client({
                webSocketFactory: () => this.socket,
                reconnectDelay: 5000,
                debug: (str: string) => console.log(str),
                onConnect: () => {
                    console.log('Connected to WebSocket server!');
                    if (!this.stompClient) {
                        reject()
                        return;
                    }

                    this.stompClient.subscribe("/user/queue/topic/greetings", (response) => {
                        console.log("Greetings from WebSocket server!");
                        console.log(response.body);
                    })
                    resolve();
                },
                onStompError: (frame) => console.error(frame),
            });
            this.activate();
        });
    }

    public activate() {
        if (!this.stompClient) {
            console.error("Activate called before init is finished");
            return;
        }

        this.stompClient.activate();
    }

    public deactivate() {
        if (!this.stompClient) {
            console.error("Deactivate called before init is finished");
            return;
        }

        this.stompClient.deactivate().then(() => {
                console.log('Deactivated!');
            }
        );
    }

    private addStatusSubscription(lobbyId: number, onLobbyUpdate: (newLobby: Lobby) => void) {
        if (!this.stompClient) {
            console.error("Adding status subscription before init is finished");
            return;
        }

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

    public static async newLobby(playerName: string) {
        const response = await fetch("http://localhost:8080/lobby/new", {
            method: "POST",
            body: JSON.stringify({'playerName': playerName}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        console.log(response.json());
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

    public sendHello(message: string) {
        if (this.stompClient && this.stompClient.connected) {
            console.log("Sending hello message");
            this.stompClient.publish({
                destination: "/lobby/hello",
                body: JSON.stringify({'name': message}),
            });
        } else {
            console.error("Stomp client not connected!");
        }
    }
}