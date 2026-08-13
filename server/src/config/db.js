import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export async function testDatabaseConnection() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected successfully!");
        console.log("Database time:", result.rows[0].now);
    } catch (error) {
        console.error("PostgreSQL connection failed!");
        console.error(error.message);
    }
}



export default pool;