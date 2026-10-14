
const mysql = require("mysql2/promise");
const fs = require("fs");

async function getConnection() {
    try {
        const config = {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || "hr_db"
        };

        if (process.env.DB_HOST) {
            config.ssl = {
                ca: fs.readFileSync("/etc/secrets/ca.pem", "utf8")
            };
        }

        return await mysql.createConnection(config);

    } catch (err) {
        console.error(
            "Database connection error:",
            err.code || "",
            err.message
        );
        throw err;
    }
}

module.exports = { getConnection };
