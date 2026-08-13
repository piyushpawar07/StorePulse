import bcrypt from "bcrypt";
import pool from "../config/db.js";
import {
    getPagination,
    getSort
} from "../validators/AdminValidators.js";

const allowedRoles = ["ADMIN", "USER", "STORE_OWNER"];

export async function getDashboard(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                (SELECT COUNT(*)::int FROM users) AS "totalUsers",
                (SELECT COUNT(*)::int FROM stores) AS "totalStores",
                (SELECT COUNT(*)::int FROM ratings) AS "totalRatings"`
        );

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error("getDashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function createUser(req, res) {
    try {
        const { name, email, password, address, role } = req.body || {};

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role`,
            [name.trim(), normalizedEmail, hashedPassword, address.trim(), role]
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("createUser error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getUsers(req, res) {
    try {
        const { page, limit, offset } = getPagination(req.query);
        const allowedSortColumns = {
            name: "name",
            email: "email",
            address: "address",
            role: "role",
            createdAt: "created_at"
        };
        const { sortColumn, order } = getSort(req.query, allowedSortColumns);

        const filters = [];
        const values = [];

        for (const field of ["name", "email", "address", "role"]) {
            if (req.query[field]) {
                values.push(field === "role" ? String(req.query[field]).toUpperCase() : `%${String(req.query[field]).trim()}%`);
                filters.push(field === "role" ? `${field} = $${values.length}` : `${field} ILIKE $${values.length}`);
            }
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const totalResult = await pool.query(
            `SELECT COUNT(*)::int AS total
             FROM users
             ${whereClause}`,
            values
        );

        const usersResult = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             ${whereClause}
             ORDER BY ${sortColumn} ${order}
             LIMIT $${values.length + 1}
             OFFSET $${values.length + 2}`,
            [...values, limit, offset]
        );

        const total = totalResult.rows[0].total;

        res.status(200).json({
            success: true,
            data: usersResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("getUsers error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const userResult = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = userResult.rows[0];

        const storeResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating"
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.owner_id = $1
             GROUP BY s.id, s.name
             ORDER BY s.created_at DESC
             LIMIT 1`,
            [id]
        );

        if (storeResult.rows.length > 0) {
            user.store = storeResult.rows[0];
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("getUserById error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function createStore(req, res) {
    try {
        const { name, email, address, ownerId } = req.body || {};

        const ownerResult = await pool.query(
            `SELECT id, role
             FROM users
             WHERE id = $1`,
            [ownerId]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        if (ownerResult.rows[0].role !== "STORE_OWNER") {
            return res.status(400).json({
                success: false,
                message: "Owner must be a STORE_OWNER"
            });
        }

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, address, owner_id AS "ownerId"`,
            [name.trim(), email.trim().toLowerCase(), address.trim(), ownerId]
        );

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            store: result.rows[0]
        });
    } catch (error) {
        console.error("createStore error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getStores(req, res) {
    try {
        const { page, limit, offset } = getPagination(req.query);
        const allowedSortColumns = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "\"averageRating\"",
            createdAt: "s.created_at"
        };
        const { sortColumn, order } = getSort(req.query, allowedSortColumns);

        const filters = [];
        const values = [];

        for (const field of ["name", "email", "address"]) {
            if (req.query[field]) {
                values.push(`%${String(req.query[field]).trim()}%`);
                filters.push(`s.${field} ILIKE $${values.length}`);
            }
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const totalResult = await pool.query(
            `SELECT COUNT(*)::int AS total
             FROM stores s
             ${whereClause}`,
            values
        );

        const storesResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating"
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             ${whereClause}
             GROUP BY s.id, s.name, s.email, s.address, s.created_at
             ORDER BY ${sortColumn} ${order}
             LIMIT $${values.length + 1}
             OFFSET $${values.length + 2}`,
            [...values, limit, offset]
        );

        const total = totalResult.rows[0].total;

        res.status(200).json({
            success: true,
            data: storesResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("getStores error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getStoreById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email
                ) AS owner,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating",
                COUNT(r.id)::int AS "totalRatings"
             FROM stores s
             JOIN users u ON u.id = s.owner_id
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.id = $1
             GROUP BY s.id, s.name, s.email, s.address, u.id, u.name, u.email`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        res.status(200).json({
            success: true,
            store: result.rows[0]
        });
    } catch (error) {
        console.error("getStoreById error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
