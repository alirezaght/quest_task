import { getPendingJobs, updateJob } from "../services/queueService"
import { writePoints } from "../services/contractService"
import logger from "../config/logger"

async function run() {  
  const jobs = getPendingJobs()
  logger.info(`Processing ${jobs.length} jobs`)
  for (const job of jobs) {
    try {
      const tx = await writePoints(job.wallet, job.points)
      updateJob(job.id, { status: "success", tx: tx })
      logger.info(`Job ${job.id} processed successfully -> ${tx}`)
    } catch (err: any) {
      updateJob(job.id, { status: "failed", error: err.message })
      logger.error(`Job ${job.id} failed: ${err.message}`)
    }
  }
}

setInterval(run, 60000)
logger.info("Job worker started")
run()