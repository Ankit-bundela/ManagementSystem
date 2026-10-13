
const express = require('express');

const router = express.Router();

const { getConnection } = require('../datalayer/connector');

// Dashboard Statistics API
router.get('/stats', async function (request, response)
{
    var connection = null;

    connection = await getConnection();

    var [employeeRows] = await connection.execute(
        "SELECT COUNT(*) AS totalEmployees FROM employee"
    );

    var [departmentRows] = await connection.execute(
        "SELECT COUNT(*) AS totalDepartments FROM department"
    );

    response.send({
        totalEmployees: employeeRows[0].totalEmployees,
        totalDepartments: departmentRows[0].totalDepartments
    });
});

// Department-wise Employee Count API
router.get('/department-counts', async function (request, response)
{
    var connection = null;

    connection = await getConnection();

    var [rows] = await connection.execute(`
        SELECT
            d.code AS code,
            d.name AS name,
            COUNT(e.emp_id) AS totalEmployees
        FROM department d
        LEFT JOIN employee e
            ON e.department_code = d.code
        GROUP BY d.code, d.name
        ORDER BY d.name
    `);

    response.send(rows);
});

module.exports = router;