import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import storeRouter from "./routes/store.routes.js";
import ratingRouter from "./routes/rating.routes.js";
import ownerRouter from "./routes/owner.routes.js";


import path from 'path'
import { fileURLToPath } from "url";

const app = express()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("./public"));

app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/stores", storeRouter)
app.use("/api/ratings", ratingRouter)
app.use("/api/owner", ownerRouter)


// app.use(express.static(path.join(__dirname, "..", "public", "dist")));


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "public", "dist", "index.html"));
// });

// wildcard api
app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"));
})

export default app;
