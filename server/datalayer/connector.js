
const mysql = require("mysql2/promise");

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
            const caCertificate = process.env.DB_CA_CERT;

            if (!caCertificate) {
                throw new Error(
                    "DB_CA_CERT is missing in environment variables."
                );
            }

            config.ssl = {
                ca: caCertificate.replace(/\\n/g, "\n")
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
