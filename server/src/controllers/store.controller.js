import pool from "../config/db.js";

function getPagination(query = {}) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const rawLimit = Math.max(Number.parseInt(query.limit, 10) || 10, 1);
    const limit = Math.min(rawLimit, 100);
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function resolveSort(query = {}) {
    const sortBy = query.sortBy || "rating";
    const order = String(query.order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

    const allowedSortColumns = {
        rating: '"averageRating"',
        name: "s.name",
        email: "s.email",
        address: "s.address",
        createdAt: "s.created_at"
    };

    const sortColumn = allowedSortColumns[sortBy] || '"averageRating"';

    return { sortColumn, order };
}

export async function getStores(req, res) {
    try {
        const userId = req.user.id;
        const { page, limit, offset } = getPagination(req.query);
        const { sortColumn, order } = resolveSort(req.query);

        const search = String(req.query.search || "").trim();
        const filters = [];
        const filterValues = [];

        if (search) {
            filters.push(`(s.name ILIKE $${filterValues.length + 1} OR s.address ILIKE $${filterValues.length + 2})`);
            filterValues.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const totalResult = await pool.query(
            `SELECT COUNT(*)::int AS total
             FROM stores s
             ${whereClause}`,
            filterValues
        );

        const storesResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating",
                MAX(CASE WHEN r.user_id = $1 THEN r.rating END) AS "userRating"
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             ${whereClause}
             GROUP BY s.id, s.name, s.email, s.address
             ORDER BY ${sortColumn} ${order}
             LIMIT $${filterValues.length + 2}
             OFFSET $${filterValues.length + 3}`,
            [userId, ...filterValues, limit, offset]
        );

        res.status(200).json({
            success: true,
            data: storesResult.rows.map((store) => ({
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                averageRating: Number(store.averageRating),
                userRating: store.userRating === null ? null : Number(store.userRating)
            })),
            pagination: {
                page,
                limit,
                total: totalResult.rows[0].total,
                totalPages: Math.ceil(totalResult.rows[0].total / limit)
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
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "averageRating",
                MAX(CASE WHEN r.user_id = $2 THEN r.rating END) AS "userRating"
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.id = $1
             GROUP BY s.id, s.name, s.email, s.address`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const store = result.rows[0];

        res.status(200).json({
            success: true,
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                averageRating: Number(store.averageRating),
                userRating: store.userRating === null ? null : Number(store.userRating)
            }
        });
    } catch (error) {
        console.error("getStoreById error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
