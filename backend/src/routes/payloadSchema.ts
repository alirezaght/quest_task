import { z } from "zod"

export const MessagePayloadSchema = z.object({
  wallet: z.string().startsWith("0x").length(42),
  quest_id: z.string(),
  quest_type: z.string(),
  timestamp: z.number(),
})

export const PointsRequestSchema = z.object({
  signature: z.string().startsWith("0x"),
  message: MessagePayloadSchema
})