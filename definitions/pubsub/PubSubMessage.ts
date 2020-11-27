export interface PubSubMessage {
    type: PubSubMessageType,
    data?: PubSubMessageData
}

export enum PubSubMessageType {
    MESSAGE = "MESSAGE",
    PING = "PING",
    RECONNECT = "RECONNECT",
    RESPONSE = "RESPONSE"
}

export interface PubSubMessageData {
    error?: string,
    topic?: string,
    message?: string
}