import { topic } from "../../definitions/pubsub/topics.ts"
import {PubSub} from "../../mod.ts"
import {dotEnvLoad} from "../../deps.ts"
import { PubSubMessage } from "../../definitions/pubsub/PubSubMessage.ts"

dotEnvLoad({
    dotEnvPath: '/home/richard/Desktop/workspace/twitchd/.env'
})

const ws = new PubSub({
    oAuthToken: Deno.env.get("O_AUTH_TOKEN") || "",
    topics: [topic.chat_moderator_actions],
    channel_id: parseInt(Deno.env.get("CHANNEL_ID") || ""),
    user_id: parseInt(Deno.env.get("USER_ID") || "")
})

ws.on("connected", () => console.log("connected"))
ws.on("error", (error: string) => console.log(error))
ws.on("message", (message: PubSubMessage) => {
    console.log('There is a new Message', message.data?.message)
})