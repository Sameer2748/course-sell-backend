import express from "express"
import { login, register } from "../controllers/auth"
import { validateLogin, validateRegister } from "../validators/auth"

const router = express.Router()

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)

export default router
