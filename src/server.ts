require("dotenv").config()
import express from 'express'
import { router } from './router'
import cors from 'cors'
import path from 'path'

const app = express()

app.use(cors())
app.use("/api", router)
app.use(express.static(path.resolve(__dirname, "..", "public")))

const port = process.env.PORT

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})