export interface PubSubConstructor {
    oAuthToken: string,
    topics: topic[],
    user_id?: number,
    channel_id?: number,
}

export enum topic {
    "channel-bits-events-v1",
    "channel-bits-events-v2",
    "channel-bits-badge-unlocks",
    "channel-points-channel-v1",
    "channel-subscribe-events-v1",
    "chat_moderator_actions",
    "whispers",
}