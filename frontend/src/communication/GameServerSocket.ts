import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs';

export class GameServerSocket {
    public socket: WebSocket;
    public stompClient: Client;

    constructor(url: string) {
        this.socket = new SockJS(url);
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            debug: (str: string) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket server!');
                this.stompClient.subscribe("/game/status", (response) => {
                    console.log(response.body);
                })
            },
            onStompError: (frame) => console.error(frame),
        })
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

    //TODO add sending methods.
    public sendEvent(event: string) {
        if (this.stompClient && this.stompClient.connected) {
            console.log(`Got event: ${event}`);
            console.log("Sending event");
            this.stompClient.publish({
                destination: "/game/event",
                body: JSON.stringify({'name': "Join event happened"}),
            });
        } else {
            console.error("Stomp client not connected!");
        }
    }

    //TODO add subscribe channels and handlers.
}