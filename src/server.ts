require("dotenv").config()
import express from 'express'
import { router } from './router'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use("/",(
    request,
    _response,
    next
) => {
    console.log("New Request:")
    console.log(request.url)
    next()
})
app.use("/api", router)
app.get("/health",(req,res)=> res.send("ok"))
app.use(express.static(path.resolve(__dirname, "..", "public")))

const port = process.env.PORT

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})