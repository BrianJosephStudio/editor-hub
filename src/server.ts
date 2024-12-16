require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
import express from "express";
import { router as apiRoutesV1 } from "./routes/valorant/v1/api.routes";
import { router as resourcesRoutes} from "./routes/resources/tagSystem.routes"
// import { router as apiRoutesV2 } from './routes/valorant/v2/api.routes'
import { router as authRoutes } from "./routes/oauth/oauth.api.routes";
import cors from "cors";
import path from "path";
import { router as projectManagerRoutes } from "./routes/projectManager.routes";
import { checkEnvs } from "./middleware/checkEnvs";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { clipTaggerAuthorizationFilter } from "./middleware/userAuthorization";

const app = express()

app.use(clerkMiddleware())
app.use(checkEnvs)
app.use(cors())

app.use("/", (req, _res, next) => {
  console.log("New Request:", req.url)
  next()
})

app.use("/authorization", authRoutes);
app.use("/api", apiRoutesV1)
app.use("/api/v2", clipTaggerAuthorizationFilter, apiRoutesV1)
app.use("/resources", resourcesRoutes)
app.use("/project-manager", projectManagerRoutes);

app.get("/health", (_req, res) => res.send("ok"));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "README.md"))
})

app.use(express.static(path.resolve(__dirname, "..", "public")))

const port = process.env.PORT

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
