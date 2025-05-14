import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config"
import type { UserPayload, AuthRequest } from "../types"
import { UserRole } from "@prisma/client"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload
    ;(req as AuthRequest).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as AuthRequest).user

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}
