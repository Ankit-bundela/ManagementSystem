const mysql = require("mysql2/promise");

async function getConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || "hr_db"
        });

        return connection;
    } catch (err) {
        console.error("Database connection error:", err.message);
        throw err;
    }
}

module.exports = { getConnection };