import type { Request, Response } from "express"
import prisma from "../lib/prisma"
import type { AuthRequest, VideoInput } from "../types"
import { uploadToS3 } from "../lib/s3"

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" })
    }

    const videoUrl = await uploadToS3(req.file)

    return res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl,
    })
  } catch (error) {
    console.error("Upload video error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const createVideo = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthRequest).user
    const { title, description, videoUrl, courseId }: VideoInput = req.body

    // Check if course exists and belongs to the user
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.authorId !== user!.id && user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to add videos to this course" })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        courseId,
      },
    })

    return res.status(201).json({
      message: "Video created successfully",
      video,
    })
  } catch (error) {
    console.error("Create video error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const getVideosByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params

    const videos = await prisma.video.findMany({
      where: { courseId },
    })

    return res.status(200).json({ videos })
  } catch (error) {
    console.error("Get videos error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    })

    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    return res.status(200).json({ video })
  } catch (error) {
    console.error("Get video error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = (req as AuthRequest).user
    const { title, description }: Partial<VideoInput> = req.body

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
      include: {
        course: true,
      },
    })

    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" })
    }

    // Check if user is authorized to update the video
    if (existingVideo.course.authorId !== user!.id && user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this video" })
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
      },
    })

    return res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    })
  } catch (error) {
    console.error("Update video error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = (req as AuthRequest).user

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
      include: {
        course: true,
      },
    })

    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" })
    }

    // Check if user is authorized to delete the video
    if (existingVideo.course.authorId !== user!.id && user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this video" })
    }

    await prisma.video.delete({
      where: { id },
    })

    return res.status(200).json({
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("Delete video error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}
