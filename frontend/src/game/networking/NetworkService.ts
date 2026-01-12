import {Client} from "@stomp/stompjs";
import type {GameErrorEvent, GameEvent} from "@/game/model/events.ts";
import {EventType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

export class NetworkService {
    private client: Client;
    private lobbyId: string;
    private onEventReceived: (event: GameEvent) => void;

    constructor(lobbyId: string, onEventReceived: (event: GameEvent) => void) {
        this.lobbyId = lobbyId;
        this.onEventReceived = onEventReceived;

        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // Adjust to your backend URL
            onConnect: () => {
                Logger.info("Connected to WebSocket");
                this.subscribe();
            },
            onStompError: (frame) => {
                Logger.error({frame}, 'Broker reported error');
            }
        });
    }

    public connect() {
        this.client.activate();
    }

    public disconnect() {
        this.client.deactivate();
    }

    public sendEvent(event: GameEvent) {
        if (!this.client.connected) {
            Logger.warn("Cannot send event: Not connected");
            this.onEventReceived({
                type: EventType.Error,
                playerId: event.playerId,
                code: "CONNECTION_ERROR",
                message: "Not connected to server. Please check your internet connection.",
                originalEventType: event.type
            } as GameErrorEvent);
            return;
        }
        
        this.client.publish({
            destination: `/app/game/event/${this.lobbyId}`,
            body: JSON.stringify(event)
        });
    }

    private subscribe() {
        this.client.subscribe(`/topic/game/status/${this.lobbyId}`, (message) => {
            const event: GameEvent = JSON.parse(message.body);
            this.onEventReceived(event);
        });
    }
}