
const express = require('express');
const router = express.Router();
const { getConnection } = require('../datalayer/connector');

// Helper: Validate attendance status
function isValidStatus(status) {
    return ['P', 'A', 'L'].includes(status);
}

// Helper: Validate date format and actual calendar date
function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
}

// GET /attendance - All attendance records
router.get('/', async function (request, response) {
    try {
        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                emp_id,
                DATE_FORMAT(date_of_attendance, '%Y-%m-%d')
                    AS date_of_attendance,
                status
            FROM employee_attendance
            ORDER BY date_of_attendance DESC, emp_id
        `);

        response.status(200).send(rows);
    } catch (error) {
        console.error('Get Attendance Error:', error);

        response.status(500).send({
            message: 'Failed to fetch attendance records'
        });
    }
});

// GET /attendance/today - Today's attendance counts
router.get('/today', async function (request, response) {
    try {
        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                CURDATE() AS date,
                COUNT(CASE WHEN status = 'P' THEN 1 END)
                    AS totalPresent,
                COUNT(CASE WHEN status = 'A' THEN 1 END)
                    AS totalAbsent,
                COUNT(CASE WHEN status = 'L' THEN 1 END)
                    AS totalLeave
            FROM employee_attendance
            WHERE date_of_attendance = CURDATE()
        `);

        const [employeeRows] = await connection.execute(`
            SELECT COUNT(*) AS totalEmployees
            FROM employee
        `);

        response.status(200).send({
            date: rows[0].date,
            totalEmployees: employeeRows[0].totalEmployees,
            totalPresent: rows[0].totalPresent,
            totalAbsent: rows[0].totalAbsent,
            totalLeave: rows[0].totalLeave
        });
    } catch (error) {
        console.error('Today Attendance Error:', error);

        response.status(500).send({
            message: 'Failed to fetch today attendance'
        });
    }
});

// GET /attendance/summary?mth=10&yr=2026
router.get('/summary', async function (request, response) {
    try {
        const currentDate = new Date();

        const mth = request.query.mth === undefined
            ? currentDate.getMonth() + 1
            : Number(request.query.mth);

        const yr = request.query.yr === undefined
            ? currentDate.getFullYear()
            : Number(request.query.yr);

        if (
            !Number.isInteger(mth) ||
            mth < 1 ||
            mth > 12 ||
            !Number.isInteger(yr) ||
            yr < 1 ||
            yr > 9999
        ) {
            return response.status(400).send({
                message: 'Invalid month or year'
            });
        }

        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                emp_id,
                mth,
                yr,
                total_present AS totalPresent,
                total_absent AS totalAbsent,
                total_leave AS totalLeave
            FROM employee_attendance_summary
            WHERE mth = ? AND yr = ?
            ORDER BY emp_id
        `, [mth, yr]);

        response.status(200).send(rows);
    } catch (error) {
        console.error('Attendance Summary Error:', error);

        response.status(500).send({
            message: 'Failed to fetch attendance summary'
        });
    }
});

// GET /attendance/:empId/:date - One attendance record
router.get('/:empId/:date', async function (request, response) {
    try {
        const empId = Number(request.params.empId);
        const date = request.params.date;

        if (!Number.isInteger(empId) || empId < 1 || !isValidDate(date)) {
            return response.status(400).send({
                message: 'Invalid employee ID or date'
            });
        }

        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT
                emp_id,
                DATE_FORMAT(date_of_attendance, '%Y-%m-%d')
                    AS date_of_attendance,
                status
            FROM employee_attendance
            WHERE emp_id = ?
              AND date_of_attendance = ?
        `, [empId, date]);

        if (rows.length === 0) {
            return response.status(404).send({
                message: 'Attendance record not found'
            });
        }

        response.status(200).send(rows[0]);
    } catch (error) {
        console.error('Get Single Attendance Error:', error);

        response.status(500).send({
            message: 'Failed to fetch attendance record'
        });
    }
});

// POST /attendance - Create attendance
router.post('/', async function (request, response) {
    try {
        const { emp_id, date_of_attendance, status } = request.body;

        const empId = Number(emp_id);
        const attendanceStatus =
            typeof status === 'string' ? status.toUpperCase() : status;

        if (
            !Number.isInteger(empId) ||
            empId < 1 ||
            !isValidDate(date_of_attendance) ||
            !isValidStatus(attendanceStatus)
        ) {
            return response.status(400).send({
                message: 'Valid emp_id, date_of_attendance and status (P/A/L) are required'
            });
        }

        const connection = await getConnection();

        await connection.execute(`
            INSERT INTO employee_attendance
                (emp_id, date_of_attendance, status)
            VALUES (?, ?, ?)
        `, [empId, date_of_attendance, attendanceStatus]);

        // Database trigger automatically updates the summary.
        response.status(201).send({
            message: 'Attendance created successfully',
            emp_id: empId,
            date_of_attendance,
            status: attendanceStatus
        });
    } catch (error) {
        console.error('Create Attendance Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).send({
                message: 'Attendance already exists for this employee and date'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return response.status(400).send({
                message: 'Employee does not exist'
            });
        }

        response.status(500).send({
            message: 'Failed to create attendance'
        });
    }
});

// PUT /attendance/:empId/:date - Update attendance status
router.put('/:empId/:date', async function (request, response) {
    try {
        const empId = Number(request.params.empId);
        const date = request.params.date;

        const status =
            typeof request.body.status === 'string'
                ? request.body.status.toUpperCase()
                : request.body.status;

        if (
            !Number.isInteger(empId) ||
            empId < 1 ||
            !isValidDate(date) ||
            !isValidStatus(status)
        ) {
            return response.status(400).send({
                message: 'Valid employee ID, date and status (P/A/L) are required'
            });
        }

        const connection = await getConnection();

        const [result] = await connection.execute(`
            UPDATE employee_attendance
            SET status = ?
            WHERE emp_id = ?
              AND date_of_attendance = ?
        `, [status, empId, date]);

        if (result.affectedRows === 0) {
            const [rows] = await connection.execute(`
                SELECT emp_id
                FROM employee_attendance
                WHERE emp_id = ?
                  AND date_of_attendance = ?
            `, [empId, date]);

            if (rows.length === 0) {
                return response.status(404).send({
                    message: 'Attendance record not found'
                });
            }
        }

        // Database trigger automatically adjusts the summary.
        response.status(200).send({
            message: 'Attendance updated successfully',
            emp_id: empId,
            date_of_attendance: date,
            status
        });
    } catch (error) {
        console.error('Update Attendance Error:', error);

        response.status(500).send({
            message: 'Failed to update attendance'
        });
    }
});

// DELETE /attendance/:empId/:date - Delete attendance
router.delete('/:empId/:date', async function (request, response) {
    try {
        const empId = Number(request.params.empId);
        const date = request.params.date;

        if (!Number.isInteger(empId) || empId < 1 || !isValidDate(date)) {
            return response.status(400).send({
                message: 'Invalid employee ID or date'
            });
        }

        const connection = await getConnection();

        const [result] = await connection.execute(`
            DELETE FROM employee_attendance
            WHERE emp_id = ?
              AND date_of_attendance = ?
        `, [empId, date]);

        if (result.affectedRows === 0) {
            return response.status(404).send({
                message: 'Attendance record not found'
            });
        }

        // Database trigger automatically adjusts the summary.
        response.status(200).send({
            message: 'Attendance deleted successfully',
            emp_id: empId,
            date_of_attendance: date
        });
    } catch (error) {
        console.error('Delete Attendance Error:', error);

        response.status(500).send({
            message: 'Failed to delete attendance'
        });
    }
});

module.exports = router;