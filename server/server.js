import app from "./src/app.js";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import {testDatabaseConnection} from "./src/config/db.js";


dotenv.config();
testDatabaseConnection();

app.get("/api/health/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "PostgreSQL connection successful",
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "PostgreSQL connection failed"
        });
    }
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})