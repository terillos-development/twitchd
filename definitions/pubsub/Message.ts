import {MessageTypes} from "./MessageTypes.ts"

export interface Message {
    type: MessageTypes
    data?: unknown
}