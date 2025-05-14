import type { UserRole } from "@prisma/client"

export interface UserPayload {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthRequest extends Request {
  user?: UserPayload
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
  role?: UserRole
}

export interface CourseInput {
  title: string
  description: string
  thumbnail?: string
  price: number
}

export interface VideoInput {
  title: string
  description: string
  videoUrl: string
  courseId: string
}
