import { Request, Response } from "express";
import { getAddress } from "viem";
import { readPoints } from "../services/contractService";
import { ReadPoint } from "../model/schema";
import logger from "../config/logger";


export async function handleReadPoint(req: Request<{}, {}, {}, ReadPoint>, res: Response) {
    const { wallet } = req.query
    const checksummedWallet = getAddress(wallet)
    const points = await readPoints(checksummedWallet)
    logger.info(`Read points for wallet ${checksummedWallet}: ${points.toString()}`)
    res.json({ wallet: checksummedWallet, points: points.toString() })
}