import express from "express"
import cors from "cors"
import { config } from "./config"
import authRoutes from "./routes/auth"
import courseRoutes from "./routes/course"
import videoRoutes from "./routes/video"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/videos", videoRoutes)

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
