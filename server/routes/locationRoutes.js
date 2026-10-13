
const express = require("express");
const router = express.Router();
const { getConnection } = require("../datalayer/connector");

// GET: All countries
router.get("/countries", async (req, res) => {
    try {
        const connection = await getConnection();
        const [countries] = await connection.query(
            "SELECT code, name FROM country ORDER BY name"
        );

        res.json({ countries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: States by country_code
router.get("/states", async (req, res) => {
    try {
        const { country_code } = req.query;

        if (country_code == null) {
            return res.status(400).json({
                message: "country_code is required"
            });
        }

        const connection = await getConnection();
        const [states] = await connection.query(
            `SELECT code, name, country_code
             FROM state
             WHERE country_code = ?
             ORDER BY name`,
            [country_code]
        );

        res.json({ states });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Cities by state_code
router.get("/cities", async (req, res) => {
    try {
        const { state_code } = req.query;

        if (state_code == null) {
            return res.status(400).json({
                message: "state_code is required"
            });
        }

        const connection = await getConnection();
        const [cities] = await connection.query(
            `SELECT code, name, state_code
             FROM city
             WHERE state_code = ?
             ORDER BY name`,
            [state_code]
        );

        res.json({ cities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;