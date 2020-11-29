import { ChatModeratorAction } from "../definitions/pubsub/ChatModeratorAction.ts"
import { ChatModeratorActionData } from "../definitions/pubsub/ChatModeratorActionData.ts"
import { Message } from "../definitions/pubsub/Message.ts"
import { MessageType } from "../definitions/pubsub/MessageType.ts"
import { MessageTypes } from "../definitions/pubsub/MessageTypes.ts"
import { ResponseType } from "../definitions/pubsub/ResponseType.ts"
import { Topics } from "../definitions/pubsub/Topics.ts"
import { EventEmitter, WebSocketClient } from "../deps.ts"

/**
 * Declares a PubSub.
 */
export class PubSub extends EventEmitter {
    private readonly wssTraget: string = "wss://pubsub-edge.twitch.tv"
    private socket: WebSocketClient

    /**
     * @constructor
     * Create connection to the WebSocket Endpoint for PubSub and register some handlers.
     * Also creating an interval timer for keeping the connection alive.
     */
    constructor() { 
        super()
        this.socket = new WebSocketClient(this.wssTraget)
        this.socket.on("open", () => this.wsOnConnectionHandler() )
        this.socket.on("error", (error: string) => this.wsOnErrorHandler(error))
        this.socket.on("message", (message: string) => this.wsGlobalOnMessageHandler(message))
        this.socket.on("close", () => this.wsOnCloseHandler())

        // Send every 4 Minutes a Ping to the WS to keep the connection alive.
        setInterval(() => this.wsSendPing(), 1000 * 60 * 4)
    }

    /**
     * Subscribe to chat_moderation_actions of a specific channel read by a specific user 
     * 
     * @param {string} oAuthToken oAuth Token for the given user.
     * @param {string} userId ID of the user which is used to read the actions
     * @param {string} channelId ID of the channel which should be subscribed to.
     */
    subscribeChatModerationActions(oAuthToken: string, userId: string, channelId: string): void {
        this.socket.send(`{
            "type": "LISTEN",
            "data": {
                "topics": ["chat_moderator_actions.${userId}.${channelId}"],
                "auth_token": "${oAuthToken}"
            }
        }`)
    }

    /**
     * This function handles the different responses of the PubSub API and emits the according events.
     * 
     * @param {string} message 
     * @fires PubSub#pong
     */
    private wsGlobalOnMessageHandler(message: string): void {
        const msg: Message = JSON.parse(message)
        let typedMessage
        switch (msg.type) {
            case MessageTypes.PONG:
                this.emit("pong")
                break
            case MessageTypes.RECONNECT:
                this.socket.close()
                this.socket = new WebSocketClient(this.wssTraget)
                this.emit("reconnected")
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

    /**
     * This function handles if the message from the WebSocket is an actual message which has to be passed to the user.
     * @param {MessageType} message 
     */
    private messageHandler(message: MessageType): void {
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
                this.emit(Topics.CHAT_MODERATOR_ACTIONS, data)
                break
        }
    }

    /**
     * This function fires the connected event for the user.
     */
    private wsOnConnectionHandler() {
        this.emit("connected")
    }

    /**
     * This function fires an event if an error happened.
     * @param {string} error 
     */
    private wsOnErrorHandler(error: string) {
        this.emit("error", error)
    }

    /**
     * This function fires an event if the connection has been closed.
     */
    private wsOnCloseHandler() {
        this.emit("closed")
    }

    /**
     * This function sends a PING for keeping alive the connection.
     */
    private wsSendPing() {
        this.socket.send('{ "type": "PING" }')
    }
}