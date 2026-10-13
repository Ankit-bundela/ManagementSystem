const express = require("express");
const router = express.Router();
const { getConnection } = require("../datalayer/connector");

router.get("/", async (request, response) => {
    let connection = null;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT *
             FROM employee
             WHERE status = ?`,
            ["Inactive"]
        );

        return response.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error("Inactive Users API Error:", error);

        return response.status(500).json({
            success: false,
            message: "Failed to fetch inactive users",
            error: error.message
        });

    } 
});

module.exports = router;
