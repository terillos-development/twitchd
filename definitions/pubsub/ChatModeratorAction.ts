import { ChatModeratorActionData } from "./ChatModeratorActionData.ts";

export interface ChatModeratorAction {
  topic: string,
  message: ChatModeratorActionData
}