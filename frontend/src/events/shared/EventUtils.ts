export type ValueOf<T> = T[keyof T];

export type DeepValueOf<T> =
    T extends object
        ? DeepValueOf<ValueOf<T>>
        : T;

export type EventOfPayloadMap<T> = {
    [K in keyof T]:
    T[K] extends undefined
        ? { type: K }
        : {
            type: K;
            payload: T[K];
        };
}[keyof T];

export type EventOfPrefix<
    TEvent,
    TPrefix extends string
> = Extract<
    TEvent,
    { type: `${TPrefix}.${string}` }
>;