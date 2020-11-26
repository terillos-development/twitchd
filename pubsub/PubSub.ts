import {WebSocketClient} from "../deps.ts"

export class PubSub {
    readonly wwsEndpoint: string = "wss://pubsub-edge.twitch.tv"
    socket: WebSocketClient

    constructor() {
        this.socket = new WebSocketClient(this.wwsEndpoint)
        this.socket.on("message", this.wsOnMessageHandler)
    }

    private wsOnMessageHandler(message: string){
        console.log(message)
    }
}