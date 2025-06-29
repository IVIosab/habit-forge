import express, { Request, Response } from "express"
import router from "./routes/index.js"
import { logger } from "./middlewares/logging.middleware.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { auth } from "./utils/auth.js"
import { toNodeHandler } from "better-auth/node"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT || 3000
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true
  })
)
app.use(cookieParser())
app.use(logger)

app.all("/api/auth/{*any}", toNodeHandler(auth))

//use these after the auth middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api", router)

app.get("/api", (req: Request, res: Response) => {
  res.send("Welcome to HabitForge API!")
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
