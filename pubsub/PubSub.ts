import {WebSocketClient} from "../deps.ts"
import {PubSubConstructor, topic} from "../definitions/pubsub/topics.ts"
import {PubSubMessage, PubSubMessageType} from "../definitions/pubsub/PubSubMessage.ts"
import EventEmitter from "https://deno.land/std@0.65.0/node/events.ts"

export class PubSub extends EventEmitter {
    readonly wwsEndpoint: string = "wss://pubsub-edge.twitch.tv"
    private socket: WebSocketClient
    private oAuthToken: string
    private topics: topic[]
    private user_id?: number
    private channel_id?: number

    /**
     * Create a connection to the PubSub Endpoint and listen to events
     * 
     * @param {PubSubConstructor} PubSubConstructor 
     */
    constructor(params: PubSubConstructor) {
        super()
        this.oAuthToken = params.oAuthToken
        this.topics = params.topics
        this.user_id = params.user_id
        this.channel_id = params.channel_id
        this.socket = new WebSocketClient(this.wwsEndpoint)

        this.socket.on("open", () => this.wsOnOpenHandler())
        this.socket.on("message",(message: string) => this.wsOnMessageHandler(message))
        this.socket.on("error", (error: string) => this.emit("error", error))
    }

    private wsOnOpenHandler() {
        let topicsArray: Array<string> = new Array()
        this.topics.forEach((element) => {
            switch (element) {
                case topic.chat_moderator_actions:
                    topicsArray.push(`chat_moderator_actions.${this.user_id}.${this.channel_id}`)
                    break;
                default:
                    break;
            }

            this.socket.send(`{
                "type": "LISTEN",
                "data": {
                    "topics": ["chat_moderator_actions.${this.user_id}.${this.channel_id}"],
                    "auth_token": "${this.oAuthToken}"
                }
            }`)

            this.emit("connected")
        })
    }

    private wsOnMessageHandler(message: string){
        const msg: PubSubMessage = JSON.parse(message)
        
        if (msg.type === PubSubMessageType.PING) {
            this.socket.send('{"type": "PONG"}')
        } else if (msg.type === PubSubMessageType.RECONNECT) {
            this.socket.close()
            this.socket = new WebSocketClient(this.wwsEndpoint)
        } else if (msg.type === PubSubMessageType.RESPONSE) {
            if (msg.data !== undefined && msg.data.error !== '') {
                this.emit("error", "There was some error.")
            }
        } else {
            this.emit("message", msg)
        }
    }
}