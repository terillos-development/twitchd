import {MessageType} from "../definitions/pubsub/MessageType.ts";
import {ChatModeratorActionData} from "../definitions/pubsub/ChatModeratorActionData.ts";
import {ChatModeratorActionTypes} from "../definitions/pubsub/ChatModeratorActionTypes.ts";
import {ChatModeratorActionMessageData} from "../definitions/pubsub/ChatModeratorActionMessageData.ts";

export class ChatModeratorActionsHandler {
  static format(message: MessageType): ChatModeratorActionData {
    const data: ChatModeratorActionMessageData = JSON.parse(message.data.message)
    const channelId: string = message.data.topic.split('.')[2]
    console.log(data.data)

    let returnData: ChatModeratorActionData = {
      channel_id: channelId,
      from_id: data.data.created_by_user_id,
      target_id: data.data.target_user_id,
      type: <ChatModeratorActionTypes>data.data.moderation_action
    }

    if (returnData.type === ChatModeratorActionTypes.BAN) {
      returnData.reason = data.data.args[1]
    }

    if (returnData.type === ChatModeratorActionTypes.TIMEOUT) {
      returnData.timeout_time = <number><unknown>data.data.args[1]
      returnData.reason = data.data.args[2]
    }

    return returnData
  }
}
