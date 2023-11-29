import express from "express"
import { Express } from "express"
import dotenv from "dotenv"
import { db } from "./config/connect"

dotenv.config()
const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port: Number = parseInt(process.env.PORT || "") || 3000

db.then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})
