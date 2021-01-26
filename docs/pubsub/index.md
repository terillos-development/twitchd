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
    channel_id: Id of the Channel where the events happened,
    from_id: Id of the user who has dispached the event,
    target_id: Id of the user who has targeted the event,
    type: type of action (ban/unban/timeout/untimeout/mod/unmod),
    timeout_time: time in seconds of the timeout (only visible on type timeout),
    reason: String of the reason (only on types ban and timeout if supplied)
}
```
