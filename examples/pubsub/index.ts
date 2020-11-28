import { PubSub } from "../../mod.ts"
import { dotEnvLoad } from "../../deps.ts"
import { Topics } from "../../definitions/pubsub/Topics.ts"
import { ChatModeratorAction } from "../../definitions/pubsub/ChatModeratorAction.ts"

dotEnvLoad({
    dotEnvPath: '/home/richard/Desktop/workspace/twitchd/.env'
})

    const oAuthToken = Deno.env.get("O_AUTH_TOKEN") || ""
    const channelId = Deno.env.get("CHANNEL_ID") || ""
    const userId = Deno.env.get("USER_ID") || ""

const chatModerator = new PubSub()
chatModerator.event.on("connected", () => {
    console.log("Connected")
    chatModerator.subscribeChatModerationActions(oAuthToken, userId, channelId)
})

chatModerator.event.on(Topics.CHAT_MODERATOR_ACTIONS, (action: ChatModeratorAction) => {
    console.log('Oh no. something is happened: ', action)
})
chatModerator.event.on("error", function (error: string) { console.log(error) })