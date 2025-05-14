import { z } from "zod"
import type { Request, Response, NextFunction } from "express"

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnail: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
})

export const videoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  videoUrl: z.string().url("Invalid video URL"),
  courseId: z.string().uuid("Invalid course ID"),
})

export const validateCourse = (req: Request, res: Response, next: NextFunction) => {
  try {
    courseSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(400).json({ message: "Invalid input" })
  }
}

export const validateVideo = (req: Request, res: Response, next: NextFunction) => {
  try {
    videoSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(400).json({ message: "Invalid input" })
  }
}
