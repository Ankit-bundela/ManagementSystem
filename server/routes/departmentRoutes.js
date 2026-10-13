
const express = require("express");
const router = express.Router();
const { getConnection } = require("../datalayer/connector");

// GET: All departments
router.get("/", async function (request, response) {
    let connection;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(
            "SELECT code, name FROM department ORDER BY code"
        );

        response.json(rows);
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Error fetching departments"
        });
    }
});

// GET: Total departments
router.get("/total", async function (request, response) {
    let connection;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(
            "SELECT COUNT(*) AS totalDepartments FROM department"
        );

        response.json(rows[0]);
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Error fetching department count"
        });
    }
});

// GET: Department-wise employee counts
router.get("/employee-counts", async function (request, response) {
    let connection;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                d.code,
                d.name,
                COUNT(e.emp_id) AS totalEmployees
            FROM department d
            LEFT JOIN employee e
                ON d.code = e.department_code
            GROUP BY d.code, d.name
            ORDER BY d.code
        `);

        response.json(rows);
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Error fetching department employee counts"
        });
    }
});

// GET: Department by code
// Example: GET /departments/101
router.get("/:code", async function (request, response) {
    let connection;

    try {
        const code = Number(request.params.code);

        if (!Number.isInteger(code) || code <= 0) {
            return response.status(400).json({
                message: "Invalid department code"
            });
        }

        connection = await getConnection();

        const [rows] = await connection.execute(
            "SELECT code, name FROM department WHERE code = ?",
            [code]
        );

        if (rows.length === 0) {
            return response.status(404).json({
                message: "Department not found"
            });
        }

        response.json(rows[0]);
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Error fetching department"
        });
    }
});

// POST: Create department
// Example body: { "code": 101, "name": "IT" }
router.post("/", async function (request, response) {
    let connection;

    try {
        const { code, name } = request.body;

        const departmentCode = Number(code);
        const departmentName =
            typeof name === "string" ? name.trim() : "";

        if (
            code === undefined ||
            code === null ||
            code === "" ||
            !Number.isInteger(departmentCode) ||
            departmentCode <= 0
        ) {
            return response.status(400).json({
                message: "Please provide a valid department code"
            });
        }

        if (!departmentName) {
            return response.status(400).json({
                message: "Department name is required"
            });
        }

        connection = await getConnection();

        const [existing] = await connection.execute(
            "SELECT code FROM department WHERE code = ?",
            [departmentCode]
        );

        if (existing.length > 0) {
            return response.status(409).json({
                message: "Department code already exists"
            });
        }

        await connection.execute(
            "INSERT INTO department (code, name) VALUES (?, ?)",
            [departmentCode, departmentName]
        );

        response.status(201).json({
            message: "Department created successfully",
            department: {
                code: departmentCode,
                name: departmentName
            }
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return response.status(409).json({
                message: "Department code already exists"
            });
        }

        response.status(500).json({
            message: "Error creating department"
        });
    }
});

// PUT: Update department
// Example: PUT /departments/101
// Body: { "name": "Information Technology" }
router.put("/:code", async function (request, response) {
    let connection;

    try {
        const code = Number(request.params.code);
        const { name } = request.body;

        const departmentName =
            typeof name === "string" ? name.trim() : "";

        if (!Number.isInteger(code) || code <= 0) {
            return response.status(400).json({
                message: "Invalid department code"
            });
        }

        if (!departmentName) {
            return response.status(400).json({
                message: "Department name is required"
            });
        }

        connection = await getConnection();

        const [existing] = await connection.execute(
            "SELECT code FROM department WHERE code = ?",
            [code]
        );

        if (existing.length === 0) {
            return response.status(404).json({
                message: "Department not found"
            });
        }

        await connection.execute(
            "UPDATE department SET name = ? WHERE code = ?",
            [departmentName, code]
        );

        response.json({
            message: "Department updated successfully",
            department: {
                code,
                name: departmentName
            }
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Error updating department"
        });
    }
});

// DELETE: Delete department
// Example: DELETE /departments/101

router.delete("/:code", async (req, res) => {
    let connection;

    try {
        const { code } = req.params;

        connection = await getConnection();

        // Check whether department exists
        const [departmentRows] = await connection.execute(
            "SELECT code, name FROM department WHERE code = ?",
            [code]
        );

        if (departmentRows.length === 0) {
            return res.status(404).json({
                message: "Department not found."
            });
        }

        // Check whether employees are assigned
        const [employeeRows] = await connection.execute(
            `SELECT COUNT(*) AS totalEmployees
             FROM employee
             WHERE department_code = ?`,
            [code]
        );

        const totalEmployees = Number(
            employeeRows[0].totalEmployees
        );

        if (totalEmployees > 0) {
            return res.status(409).json({
                message: `Cannot delete ${departmentRows[0].name}. ${totalEmployees} employee(s) are assigned to this department. Transfer them to another department first.`,
                totalEmployees
            });
        }

        // Delete only when no employees are assigned
        await connection.execute(
            "DELETE FROM department WHERE code = ?",
            [code]
        );

        return res.status(200).json({
            message: "Department deleted successfully."
        });

    } catch (error) {
        console.error("Delete department error:", error);

        return res.status(500).json({
            message: "Failed to delete department."
        });
    } 
});
module.exports = router;