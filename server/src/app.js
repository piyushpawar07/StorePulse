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

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/stores", storeRouter)
app.use("/api/ratings", ratingRouter)
app.use("/api/owner", ownerRouter)

// Serve frontend static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "public", "dist")));

// Catch-all: send index.html for any non-API route (client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dist", "index.html"));
});

export default app;
