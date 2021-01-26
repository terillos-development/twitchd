export interface ChatModeratorActionMessageData {
  "type":"moderation_action",
  "data": {
    "type": string,
    "moderation_action": string,
    "args": string[],
    "created_by": string,
    "created_by_user_id": string,
    "msg_id": string,
    "target_user_id": string,
    "target_user_login": string,
    "from_automod": boolean,
  }
}
