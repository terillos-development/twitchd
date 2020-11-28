import { MessageTypes } from "./MessageTypes.ts";

export interface ResponseType {
    type: MessageTypes,
    nonce: string,
    error: string
}