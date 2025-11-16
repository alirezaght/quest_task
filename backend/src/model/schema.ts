import { Hex } from "viem"

export type QuestType = "daily" | "social" | "secret"

export type MessagePayload = {
  wallet: string
  quest_id: string
  quest_type: QuestType
  timestamp: number  
}

export type PointsRequestBody = {
  signature: Hex
  message: MessagePayload
}

export type ReadPoint = {
  wallet: string
}

export type JobPayload = MessagePayload & {
  id: string
  status: "pending" | "success" | "failed"
  points: number
  created_at: number  
}