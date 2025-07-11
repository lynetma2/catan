import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs';
import {Lobby, type LobbyEvent, type NewLobby} from "./Lobby.ts";

export class LobbySocket {
    public static lobbyURL = "http://localhost:8080/ws";
    public socket?: WebSocket;
    public stompClient?: Client;
    public lobbyId?: number;

    constructor() {
        //Empty cuz async constructor needed.
    }

    public async init(lobbyId: number,  onLobbyUpdate: (newLobby: Lobby) => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.lobbyId = lobbyId;
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

                    this.addStatusSubscription(lobbyId, onLobbyUpdate);
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
            const newLobby = Lobby.fromJSON(lobby);
            onLobbyUpdate(newLobby);
            return;
        });
    }

    public joinLobby(playerName: string, lobbyId: number) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("Stomp client not connected!");
            return;
        }

        console.log(`Joining lobby ${lobbyId}...`);
        this.stompClient.publish({
            destination: `/lobby/join/${lobbyId}`,
            body: JSON.stringify({'playerName': playerName}),
        });
    }

    public static async newLobby(playerName: string): Promise<NewLobby> {
        const response = await fetch("http://localhost:8080/lobby/new", {
            method: "POST",
            body: JSON.stringify({'playerName': playerName}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.json();
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