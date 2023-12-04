import express from "express"
import { Express } from "express"
import dotenv from "dotenv"
import { db } from "./config/connect"
import routes from "./routes"
import cors from "cors"

dotenv.config()
const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "*",
  })
)

routes(app)
const port: number = parseInt(process.env.PORT || "") || 3000

db.then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})

export default app
module.exports = app
