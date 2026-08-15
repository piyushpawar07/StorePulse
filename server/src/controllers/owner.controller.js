import pool from "../config/db.js";

export async function getOwnerDashboard(req, res) {
    try {
        const ownerId = req.user.id;

        const storeResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating",
                COUNT(r.id)::int AS "totalRatings"
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.owner_id = $1
             GROUP BY s.id, s.name, s.email, s.address
             ORDER BY s.created_at ASC`,
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const stores = storeResult.rows.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            address: s.address,
            averageRating: Number(s.averageRating),
            totalRatings: Number(s.totalRatings)
        }));

        res.status(200).json({
            success: true,
            data: {
                store: stores[0],
                averageRating: stores[0].averageRating,
                totalRatings: stores[0].totalRatings,
                stores
            }
        });
    } catch (error) {
        console.error("getOwnerDashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getOwnerRatings(req, res) {
    try {
        const ownerId = req.user.id;

        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE owner_id = $1`,
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const ratingsResult = await pool.query(
            `SELECT
                r.id AS "ratingId",
                u.id AS "userId",
                u.name AS "userName",
                u.email AS "userEmail",
                s.id AS "storeId",
                s.name AS "storeName",
                r.rating,
                r.created_at AS "createdAt"
             FROM ratings r
             JOIN users u ON u.id = r.user_id
             JOIN stores s ON s.id = r.store_id
             WHERE s.owner_id = $1
             ORDER BY r.created_at DESC`,
            [ownerId]
        );

        res.status(200).json({
            success: true,
            data: ratingsResult.rows.map((rating) => ({
                ratingId: rating.ratingId,
                user: {
                    id: rating.userId,
                    name: rating.userName,
                    email: rating.userEmail
                },
                store: {
                    id: rating.storeId,
                    name: rating.storeName
                },
                rating: rating.rating,
                createdAt: rating.createdAt
            }))
        });
    } catch (error) {
        console.error("getOwnerRatings error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
