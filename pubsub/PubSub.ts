import { ChatModeratorAction } from "../definitions/pubsub/ChatModeratorAction.ts"
import { ChatModeratorActionData } from "../definitions/pubsub/ChatModeratorActionData.ts"
import { Message } from "../definitions/pubsub/Message.ts"
import { MessageType } from "../definitions/pubsub/MessageType.ts"
import { MessageTypes } from "../definitions/pubsub/MessageTypes.ts"
import { ResponseType } from "../definitions/pubsub/ResponseType.ts"
import { Topics } from "../definitions/pubsub/Topics.ts"
import { EventEmitter, WebSocketClient } from "../deps.ts"

export class PubSub {
    private readonly wssTraget: string = "wss://pubsub-edge.twitch.tv"
    private socket: WebSocketClient
    event: EventEmitter

    constructor() { 
        this.event = new EventEmitter()
        this.socket = new WebSocketClient(this.wssTraget)
        this.socket.on("open", () => this.wsOnConnectionHandler() )
        this.socket.on("error", (error: string) => this.wsOnErrorHandler(error))
        this.socket.on("message", (message: string) => this.wsGlobalOnMessageHandler(message))
        this.socket.on("close", () => this.wsOnCloseHandler())

        // Send every 4 Minutes a Ping to the WS to keep the connection alive.
        setInterval(() => this.wsSendPing(), 1000 * 60 * 4)
    }

    subscribeChatModerationActions(oAuthToken: string, userId: string, channelId: string) {
        this.socket.send(`{
            "type": "LISTEN",
            "data": {
                "topics": ["chat_moderator_actions.${userId}.${channelId}"],
                "auth_token": "${oAuthToken}"
            }
        }`)
    }

    private wsGlobalOnMessageHandler(message: string) {
        const msg: Message = JSON.parse(message)
        let typedMessage
        switch (msg.type) {
            case MessageTypes.PONG:
                this.event.emit("pong")
                break
            case MessageTypes.RECONNECT:
                this.socket.close()
                this.socket = new WebSocketClient(this.wssTraget)
                this.event.emit("reconnected")
                break
            case MessageTypes.RESPONSE:
                typedMessage = <ResponseType>msg

                if (typedMessage.error !== "") {
                    this.wsOnErrorHandler(typedMessage.error)
                }
                break
            case MessageTypes.MESSAGE:
                typedMessage = <MessageType>msg
                this.messageHandler(typedMessage)
            break
        }
    }

    private messageHandler(message: MessageType) {
        const splittedType: string = message.data.topic.split(".")[0]
        //deno-lint-ignore prefer-const
        let typedTopic
        //deno-lint-ignore prefer-const
        let typedData
        switch (splittedType) {
            //deno-lint-ignore no-case-declarations
            case Topics.CHAT_MODERATOR_ACTIONS:
                typedTopic = <string>message.data.topic
                typedData = <ChatModeratorActionData>JSON.parse(message.data.message)
                const data: ChatModeratorAction = {topic: typedTopic, message: typedData} 
                this.event.emit(Topics.CHAT_MODERATOR_ACTIONS, data)
                break
        }
    }

    private wsOnConnectionHandler() {
        this.event.emit("connected")
    }

    private wsOnErrorHandler(error: string) {
        this.event.emit("error", error)
    }

    private wsOnCloseHandler() {
        this.event.emit("closed")
    }

    private wsSendPing() {
        this.socket.send('{ "type": "PING" }')
    }

}