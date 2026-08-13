import pool from "../config/db.js";

export function authorizeRoles(...roles) {
    return async function (req, res, next) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const result = await pool.query(
                `SELECT id, role
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            req.user = {
                ...req.user,
                id: result.rows[0].id,
                role: result.rows[0].role
            };

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            next();
        } catch (error) {
            console.error("authorizeRoles error:", error);

            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
}
