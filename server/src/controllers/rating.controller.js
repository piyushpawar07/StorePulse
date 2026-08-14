import pool from "../config/db.js";

export async function createRating(req, res) {
    try {
        const userId = req.user.id;
        const { storeId, rating } = req.body || {};

        const numericStoreId = Number(storeId);
        const numericRating = Number(rating);

        if (!Number.isInteger(numericStoreId) || numericStoreId < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid storeId is required"
            });
        }

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const storeResult = await pool.query(
            `SELECT id
             FROM stores
             WHERE id = $1`,
            [numericStoreId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const existingRating = await pool.query(
            `SELECT id
             FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [userId, numericStoreId]
        );

        if (existingRating.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already rated this store"
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating, created_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW())
             RETURNING id, store_id AS "storeId", rating`,
            [userId, numericStoreId, numericRating]
        );

        res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });
    } catch (error) {
        console.error("createRating error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "You have already rated this store"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function updateRating(req, res) {
    try {
        const userId = req.user.id;
        const { storeId } = req.params;
        const { rating } = req.body || {};

        const numericStoreId = Number(storeId);
        const numericRating = Number(rating);

        if (!Number.isInteger(numericStoreId) || numericStoreId < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid storeId is required"
            });
        }

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const existingRating = await pool.query(
            `SELECT id, rating
             FROM ratings
             WHERE user_id = $1 AND store_id = $2`,
            [userId, numericStoreId]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1, updated_at = NOW()
             WHERE user_id = $2 AND store_id = $3
             RETURNING store_id AS "storeId", rating`,
            [numericRating, userId, numericStoreId]
        );

        res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            rating: result.rows[0]
        });
    } catch (error) {
        console.error("updateRating error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
