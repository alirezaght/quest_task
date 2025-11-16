import express from "express"
import bodyParser from "body-parser"
import { env } from "./config/env"
import points from "./routes/points"
import logger from "./config/logger"

const app = express()

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url })
  next()
})

app.use(bodyParser.json())

app.use("/points", points)

app.listen(env.port, () => {
  logger.info(`Server running on ${env.port}`)
})