import express from "express"
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from "../controllers/course"
import { authenticate, authorizeAdmin } from "../middleware/auth"
import { validateCourse } from "../validators/course"

const router = express.Router()

router.post("/", authenticate, authorizeAdmin, validateCourse, createCourse)
router.get("/", getAllCourses)
router.get("/:id", getCourseById)
router.put("/:id", authenticate, validateCourse, updateCourse)
router.delete("/:id", authenticate, deleteCourse)

export default router
