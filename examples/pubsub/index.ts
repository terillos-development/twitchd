import { PubSub } from "../../mod.ts"
import { load } from "../../deps_example.ts"
import { Topics } from "../../definitions/pubsub/Topics.ts"
import { ChatModeratorAction } from "../../definitions/pubsub/ChatModeratorAction.ts"

// Edit pass to the .env file
await load("/home/richard/Desktop/workspace/twitchd/.env")

const oAuthToken = Deno.env.get("O_AUTH_TOKEN") || ""
const channelId = Deno.env.get("CHANNEL_ID") || ""
const userId = Deno.env.get("USER_ID") || ""

const chatModerator = new PubSub()
chatModerator.on("connected", () => {
    console.log("Connected")
    chatModerator.subscribeChatModerationActions(oAuthToken, userId, channelId)
})

chatModerator.on(Topics.CHAT_MODERATOR_ACTIONS, (action: ChatModeratorAction) => {
    console.log('Oh no. something is happened: ', action)
})
chatModerator.on("error", (error: string) => console.log(error))
chatModerator.on("pong", () => console.log('PONG received'))
