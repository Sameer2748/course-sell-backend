import express from "express"
import multer from "multer"
import {
  uploadVideo,
  createVideo,
  getVideosByCourse,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "../controllers/video"
import { authenticate } from "../middleware/auth"
import { validateVideo } from "../validators/course"

const router = express.Router()

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
})

router.post("/upload", authenticate, upload.single("video"), uploadVideo)
router.post("/", authenticate, validateVideo, createVideo)
router.get("/course/:courseId", getVideosByCourse)
router.get("/:id", getVideoById)
router.put("/:id", authenticate, updateVideo)
router.delete("/:id", authenticate, deleteVideo)

export default router
