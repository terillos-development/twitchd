import { Message } from "./Message.ts";
import { MessageTypes } from "./MessageTypes.ts";

export interface MessageType {
    type: MessageTypes
    data: {
        topic: string,
        message: string
    }
}