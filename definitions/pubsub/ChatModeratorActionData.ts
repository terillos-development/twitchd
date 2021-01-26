import {ChatModeratorActionTypes} from "./ChatModeratorActionTypes.ts";

export interface ChatModeratorActionData {
  type: ChatModeratorActionTypes | undefined,
  channel_id: string,
  from_id: string,
  target_id: string,
  timeout_time?: number,
  reason?: string,
}
