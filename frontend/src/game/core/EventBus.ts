import type {EventMap, Middleware, EventListener, BaseEvent} from "@/game/core/types.ts";

export class EventBus<T extends EventMap> {
    // A map to store event listeners. Key is event name, value is an array of listeners.
    private readonly listeners = new Map<keyof T, EventListener<unknown>[]>();

    // An array to store all registered middleware functions.
    private readonly middleware: Middleware<T, keyof T>[] = [];

    /**
     * Registers a middleware function to the EventBus.
     * Middleware functions are executed in the order they are registered.
     */
    public use(middleware: Middleware<T, keyof T>): void {
        this.middleware.push(middleware);
    }

    /**
     * Subscribes a listener function to a specific event.
     */
    public on<E extends keyof T>(eventName: E, listener: EventListener<T[E]>): () => void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName)!.push(listener);

        // Return a function to unsubscribe from the event.
        return () => this.off(eventName, listener);
    }

    /**
     * Unsubscribes a listener function from an event.
     */
    public off<E extends keyof T>(eventName: E, listener: EventListener<T[E]>): void {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            this.listeners.set(eventName, eventListeners.filter(l => l !== listener));
        }
    }

    /**
     * Publishes an event, triggering the middleware chain and then the listeners.
     */
    public publish<E extends keyof T>(eventName: E, payload: T[E]): void {
        // Start the middleware chain.
        this.runMiddleware(eventName, payload, 0);
    }

    /**
     * A recursive helper method to run the middleware chain.
     */
    private runMiddleware<E extends keyof T>(eventName: E, payload: T[E], index: number): void {
        const nextMiddleware = this.middleware[index];

        if (nextMiddleware) {
            // Pass the event and payload to the next middleware.
            // 'next' is a function that calls this method recursively with the next index.
            nextMiddleware(eventName, payload, (updatedEventName, updatedPayload) => {
                this.runMiddleware(updatedEventName, updatedPayload, index + 1);
            });
        } else {
            // All middleware have been executed, now publish to the listeners.
            this.notifyListeners(eventName, payload);
        }
    }

    /**
     * Notifies all listeners subscribed to the event.
     */
    private notifyListeners<E extends keyof T>(eventName: E, payload: T[E]): void {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            // Use a copy to prevent issues if a listener unsubscribes itself during the loop.
            [...eventListeners].forEach(listener => listener(payload));
        }
    }

    public static createEvent<T extends BaseEvent>(event: Omit<T, 'uid' | 'timestamp' | 'stopPropagation'>): T {
        return {
            ...event,
            uid: crypto.randomUUID(), // Or any other UID generation method
            timestamp: Date.now(),
            stopPropagation: false, // By default, events should propagate
        } as unknown as T;
    }
}