import { Request, Response } from "express";
import { PointsRequestBody } from "../model/schema";
import { recoverAddress } from "../services/signatureService";
import { addJob } from "../services/queueService";
import { validateTimestamp } from "../services/validationService";
import { ValidateFactory } from "../validators/validateFactory";


export async function handlePointRequest(req: Request<{}, {}, PointsRequestBody>, res: Response) {
    const { signature, message } = req.body
    const recovered = await recoverAddress(message, signature)
    if (recovered.toLowerCase() !== message.wallet.toLowerCase()) return res.status(400).json({ error: "invalid signature" })
    if (!validateTimestamp(message.timestamp)) return res.status(400).json({ error: "expired signature" })
    const validator = ValidateFactory.getValidator(message.quest_type)
    if (!(await validator.validate(message.quest_id))) return res.status(400).json({ error: "invalid quest" })
    // Queue the job to be submitted on chain
    // Idompotency on wallet + quest_id is handled in addJob
    addJob(message, await validator.getPoint(message.quest_id))

    res.json({ queued: true })
}