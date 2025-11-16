import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"

export const validateBody = (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }
    req.body = result.data
    next()
  }

export const validateQuery = (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }
    req.query = result.data as any
    next()
  }