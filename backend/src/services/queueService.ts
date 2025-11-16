import fs, { stat } from "fs"
import path from "path"
import { JobPayload, MessagePayload } from "../model/schema"
import { v4 as uuid } from "uuid"
import { Hex } from "viem"
import logger from "../config/logger"

const file = path.join(__dirname, "../db/queue.json")

function ensureQueueFile() {
  const dir = path.dirname(file)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2))
  }
}

export function addJob(job: MessagePayload, points: number) {
  ensureQueueFile()
  const data = JSON.parse(fs.readFileSync(file, "utf8"))
  const existIndex = data.findIndex((j: MessagePayload) => j.quest_id === job.quest_id && j.wallet === job.wallet)
  if (existIndex >= 0) {
    logger.info("Already queued points for this quest and wallet")
    return
  }
  const id = uuid()
  data.push({
    ...job,
    id,
    status: "pending",
    points,
    created_at: Date.now(),    
  })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  logger.info(`Job added to queue id: ${id}`)
}

export function getPendingJobs(): JobPayload[] {
  ensureQueueFile()
  const data = JSON.parse(fs.readFileSync(file, "utf8"))
  return data.filter((j: any) => j.status === "pending")
}

export function updateJob(id: string, update: {status: string, tx?: Hex, error?: string}) {
  ensureQueueFile()
  const data = JSON.parse(fs.readFileSync(file, "utf8"))
  const idx = data.findIndex((x: any) => x.id === id)
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...update }
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
    logger.info(`Job ${id} updated with status: ${update.status}, tx: ${update.tx}, error: ${update.error}`)
  } else {
    logger.error(`Job with id ${id} not found for update`)
  }
}