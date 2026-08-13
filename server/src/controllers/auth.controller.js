import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

const sanitizeUser = (user = {}) => {
    if (!user || typeof user !== "object") return {};
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export async function authregister(req,res){
    try{
        const {name,email,password,role,address} = req.body;

        const existingUser = await pool.query("select * from users where email = $1",
            [email.toLowerCase()]
        )

        if(existingUser.rows.length > 0){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const User = await pool.query(
            `INSERT INTO users (name,email,password,address,role)
             values ($1,$2,$3,$4,$5) 
             RETURNING id,name,email,address,role`,
             [
               name,email.toLowerCase(),hashedPassword,address,role
             ]
        )

        const token  = jwt.sign({
            id:User.rows[0].id,
            email:User.rows[0].email,
        }, process.env.JWT_SECRET, 
        { 
            expiresIn: '1D' 
        });

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user:User.rows[0]
    
        })
    }
    catch(error){
        console.log("register error:",error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export async function authlogin(req,res){
    try{
        const {email,password} = req.body || {};

        const existingUser = await pool.query("select * from users where email = $1",
            [email.toLowerCase()]
        )

        if(existingUser.rows.length === 0){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.rows[0].password);

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const safeUser = sanitizeUser(existingUser.rows[0]);

        const token  = jwt.sign({
            id:existingUser.rows[0].id,
            email:existingUser.rows[0].email,
        }, process.env.JWT_SECRET,
        { 
            expiresIn: '1D' 
        });

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser
        })
    }
    catch(error){
        console.log("login error:",error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export async function logout(req,res){
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({
            success: false,
            message: "User is not logged in"
        })
    }

    res.clearCookie("token");

    // Uses redis for token blacklisting where storing the blacklisted tokens on Redis instead of local database to reduce the load on server.
    redis.set(token, "blacklisted", "EX", 60*60);


    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })

}

export async function authGetMe(req,res){
    const user  = await pool.query("select * from users where id = $1",[req.user.id]);

    if(user.rows.length === 0){
        return res.status(404).json({
            message:"User not found"
        })
    }

    res.status(200).json({
        message:"User fetched successfully",
        user: sanitizeUser(user.rows[0])
        }
    );

}


export async function changePassword (req, res){
    try {
        const { currentPassword, newPassword } = req.body;

        const result = await pool.query(
            `SELECT password
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result.rows[0];


        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }

        
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        
        await pool.query(
            `UPDATE users
             SET password = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [newPasswordHash, req.user.userId]
        );

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
