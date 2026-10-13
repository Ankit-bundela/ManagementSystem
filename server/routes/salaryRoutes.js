
const express = require("express");
const router = express.Router();
const { getConnection } = require("../datalayer/connector");

// GET: All salary records
router.get("/", async (req, res) => {
    try {
        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                s.emp_id,
                e.first_name,
                e.last_name,
                e.department_code,
                s.basic_salary,
                s.hra,
                (s.basic_salary + s.hra) AS total_salary
            FROM employee_salary s
            INNER JOIN employee e
                ON s.emp_id = e.emp_id
            ORDER BY s.emp_id
        `);

        res.json(rows);
    } catch (error) {
        console.error("Fetch Salary Error:", error);
        res.status(500).json({
            message: "Failed to fetch salary records"
        });
    }
});

// GET: Salary of one employee
router.get("/:empId", async (req, res) => {
    try {
        const connection = await getConnection();
        const { empId } = req.params;

        const [rows] = await connection.execute(`
            SELECT
                s.emp_id,
                e.first_name,
                e.last_name,
                s.basic_salary,
                s.hra,
                (s.basic_salary + s.hra) AS total_salary
            FROM employee_salary s
            INNER JOIN employee e
                ON s.emp_id = e.emp_id
            WHERE s.emp_id = ?
        `, [empId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Salary record not found"
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Get Salary Error:", error);
        res.status(500).json({
            message: "Failed to fetch salary"
        });
    }
});

// POST: Add salary for an employee
router.post("/", async (req, res) => {
    try {
        const { emp_id, basic_salary, hra } = req.body;

        if (
            emp_id == null ||
            basic_salary == null ||
            hra == null ||
            !Number.isFinite(Number(emp_id)) ||
            !Number.isFinite(Number(basic_salary)) ||
            !Number.isFinite(Number(hra)) ||
            Number(basic_salary) < 0 ||
            Number(hra) < 0
        ) {
            return res.status(400).json({
                message: "Valid emp_id, basic_salary and hra are required"
            });
        }

        const connection = await getConnection();

        await connection.execute(`
            INSERT INTO employee_salary
                (emp_id, basic_salary, hra)
            VALUES (?, ?, ?)
        `, [emp_id, basic_salary, hra]);

        res.status(201).json({
            message: "Salary added successfully"
        });
    } catch (error) {
        console.error("Add Salary Error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Salary already exists for this employee"
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                message: "Employee does not exist"
            });
        }

        res.status(500).json({
            message: "Failed to add salary"
        });
    }
});

// PUT: Update salary
router.put("/:empId", async (req, res) => {
    try {
        const { empId } = req.params;
        const { basic_salary, hra } = req.body;

        if (
            basic_salary == null ||
            hra == null ||
            !Number.isFinite(Number(basic_salary)) ||
            !Number.isFinite(Number(hra)) ||
            Number(basic_salary) < 0 ||
            Number(hra) < 0
        ) {
            return res.status(400).json({
                message: "Valid basic_salary and hra are required"
            });
        }

        const connection = await getConnection();

        const [result] = await connection.execute(`
            UPDATE employee_salary
            SET basic_salary = ?, hra = ?
            WHERE emp_id = ?
        `, [basic_salary, hra, empId]);

        if (result.affectedRows === 0) {
            const [rows] = await connection.execute(
                "SELECT emp_id FROM employee_salary WHERE emp_id = ?",
                [empId]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: "Salary record not found"
                });
            }
        }

        res.json({
            message: "Salary updated successfully"
        });
    } catch (error) {
        console.error("Update Salary Error:", error);
        res.status(500).json({
            message: "Failed to update salary"
        });
    }
});

// DELETE: Delete salary record
router.delete("/:empId", async (req, res) => {
    try {
        const connection = await getConnection();
        const { empId } = req.params;

        const [result] = await connection.execute(
            "DELETE FROM employee_salary WHERE emp_id = ?",
            [empId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Salary record not found"
            });
        }

        res.json({
            message: "Salary deleted successfully"
        });
    } catch (error) {
        console.error("Delete Salary Error:", error);
        res.status(500).json({
            message: "Failed to delete salary"
        });
    }
});

module.exports = router;