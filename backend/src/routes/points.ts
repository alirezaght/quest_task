import { Router } from "express"
import { handlePointRequest } from "../controller/addQuestPointController"
import { handleReadPoint } from "../controller/readQuestPointController"
import { validateBody, validateQuery } from "../middleware/requestValidate"
import { PointsRequestSchema } from "./payloadSchema"
import { z } from "zod"

const ReadPointSchema = z.object({
  wallet: z.string().startsWith("0x").length(42)
})

const router = Router()

router.post("/", validateBody(PointsRequestSchema), handlePointRequest)

router.get("/", validateQuery(ReadPointSchema), handleReadPoint)

export default router