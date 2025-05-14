import type { Request, Response } from "express"
import prisma from "../lib/prisma"
import type { AuthRequest, CourseInput } from "../types"

export const createCourse = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthRequest).user
    const { title, description, thumbnail, price }: CourseInput = req.body

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        price,
        authorId: user!.id,
      },
    })

    return res.status(201).json({
      message: "Course created successfully",
      course,
    })
  } catch (error) {
    console.error("Create course error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const getAllCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return res.status(200).json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        videos: true,
      },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    return res.status(200).json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = (req as AuthRequest).user
    const { title, description, thumbnail, price }: CourseInput = req.body

    // Check if course exists and belongs to the user
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (existingCourse.authorId !== user!.id && user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this course" })
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        thumbnail,
        price,
      },
    })

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    })
  } catch (error) {
    console.error("Update course error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = (req as AuthRequest).user

    // Check if course exists and belongs to the user
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (existingCourse.authorId !== user!.id && user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this course" })
    }

    // Delete all videos associated with the course
    await prisma.video.deleteMany({
      where: { courseId: id },
    })

    // Delete the course
    await prisma.course.delete({
      where: { id },
    })

    return res.status(200).json({
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("Delete course error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}
