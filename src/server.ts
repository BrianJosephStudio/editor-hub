require("dotenv").config()
import express from 'express'
import { router as apiRoutes } from './router'
import cors from 'cors'
import path from 'path'
import { router as projectManagerRoutes } from './routes/projectManager.routes'

const app = express()

app.use(cors())

app.use("/",( req, _res, next) => {
    console.log("New Request:", req.url)
    next()
})

app.use("/api", apiRoutes)
app.use("/project-manager", projectManagerRoutes)
app.get("/health",(req,res)=> res.send("ok"))
app.use(express.static(path.resolve(__dirname, "..", "public")))

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "README.md"))
})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})