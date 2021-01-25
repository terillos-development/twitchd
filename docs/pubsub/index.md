# PubSub Docs
The PubSub can return multiple events. To achive this it uses an event emitter.
So you should listen on events.

| Event | Description
| --- | --- |
| `connected` | Emits when the client has connected to the PubSub Api-Endpoint |
| `error` | Emits when an error occours on the PubSub API. It returns also an `error` property. |
| `closed` | Emits when the connection has been closed to the PubSub Endpoint. |
| `pong` | Emits when the PubSub Endpoint has received the ping. |
| `message` | Emits when a message has been received from the PubSub Endpoint. See by the corresponding function for more info.|

On a `message`-Event it generally returns the following object:
```
{
    topic: String of the topic,
    data: Data of the message,
} 
```
See more below at the corresponding function.

## subscribeChatModerationActions()
Get all Moderation-Events from a specific channel.

### Required Scopes
`channel:moderate`

### Parameters

| Parameter | Description |
| --- | --- |
| oAuthToken | Token of the User which has the required scopes and permission for the channel. |
| userId | Id of the user which belongs to the Token and should have the permission for moderating the channel |
| channelId | Id of the channel which should be monitored |

### Event Data

```
{
    topic: chat_moderator_actions.<user ID>.<channel ID>,
    data: {
        type: same as topic
        moderation_action: type of action (ban, mute etc.)
        args: command with arguments
        created_by: name of the user who has issued the action
        created_by_user_id: id of the user who has issued the action
        msg_id: id of the message
        target_user_id: id of the user who has been punished
        target_user_login: name of the user who has been punished
        from_automod: defines if it has been an automatic action from twitch
    }
}
```
