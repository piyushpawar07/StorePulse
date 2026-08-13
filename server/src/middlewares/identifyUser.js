import redis from "../config/cache.js";
import jwt from "jsonwebtoken";

export async function authUser(req,res,next){
    try{
        const token = req.cookies.token;
        if(!token){  
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        // Check if the token is blacklisted
        const isBlacklisted = await redis.get(token);
        if(isBlacklisted){
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log("authUser error:",error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}