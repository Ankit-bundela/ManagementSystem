
const express = require('express');
const router = express.Router();

const { getConnection } = require('../datalayer/connector');

// GET: Fetch all employee addresses
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();

        const sql = `
            SELECT
                ea.emp_id,
                e.first_name,
                e.last_name,
                ea.line_1,
                ea.line_2,
                ea.line_3,
                ea.city_code,
                c.name AS city_name,
                s.name AS state_name,
                co.name AS country_name,
                ea.pin_code
            FROM employee_address ea
            JOIN employee e ON ea.emp_id = e.emp_id
            JOIN city c ON ea.city_code = c.code
            JOIN state s ON c.state_code = s.code
            JOIN country co ON s.country_code = co.code
            ORDER BY ea.emp_id DESC
        `;

        const [addresses] = await connection.query(sql);

        res.status(200).json({
            message: 'Employee addresses fetched successfully',
            count: addresses.length,
            addresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch employee addresses',
            error: error.message
        });
    }
});


// GET: Fetch one employee address by emp_id
router.get('/:emp_id', async (req, res) => {
    try {
        const { emp_id } = req.params;
        const connection = await getConnection();

        const sql = `
            SELECT
                ea.emp_id,
                e.first_name,
                e.last_name,
                ea.line_1,
                ea.line_2,
                ea.line_3,
                ea.city_code,
                c.name AS city_name,
                s.name AS state_name,
                co.name AS country_name,
                ea.pin_code
            FROM employee_address ea
            JOIN employee e ON ea.emp_id = e.emp_id
            JOIN city c ON ea.city_code = c.code
            JOIN state s ON c.state_code = s.code
            JOIN country co ON s.country_code = co.code
            WHERE ea.emp_id = ?
        `;

        const [addresses] = await connection.query(sql, [emp_id]);

        if (addresses.length === 0) {
            return res.status(404).json({
                message: 'Employee address not found'
            });
        }

        res.status(200).json({
            message: 'Employee address fetched successfully',
            address: addresses[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch employee address',
            error: error.message
        });
    }
});


// POST: Create employee address
router.post('/', async (req, res) => {
    try {
        const {
            emp_id,
            line_1,
            line_2,
            line_3,
            city_code,
            pin_code
        } = req.body;

        if (
            emp_id == null ||
            city_code == null ||
            !line_1?.trim() ||
            !pin_code?.toString().trim()
        ) {
            return res.status(400).json({
                message: 'emp_id, line_1, city_code and pin_code are required'
            });
        }

        const connection = await getConnection();

        const sql = `
            INSERT INTO employee_address
                (emp_id, line_1, line_2, line_3, city_code, pin_code)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await connection.query(sql, [
            emp_id,
            line_1.trim(),
            line_2 ?? null,
            line_3 ?? null,
            city_code,
            pin_code
        ]);

        res.status(201).json({
            message: 'Employee address created successfully',
            emp_id
        });
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'An address already exists for this employee'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                message: 'Invalid emp_id or city_code. Check employee and city records.'
            });
        }

        res.status(500).json({
            message: 'Failed to create employee address',
            error: error.message
        });
    }
});


// PUT: Update an employee address
router.put('/:emp_id', async (req, res) => {
    try {
        const { emp_id } = req.params;
        const {
            line_1,
            line_2,
            line_3,
            city_code,
            pin_code
        } = req.body;

        if (
            city_code == null ||
            !line_1?.trim() ||
            !pin_code?.toString().trim()
        ) {
            return res.status(400).json({
                message: 'line_1, city_code and pin_code are required'
            });
        }

        const connection = await getConnection();

        const [existing] = await connection.query(
            'SELECT emp_id FROM employee_address WHERE emp_id = ?',
            [emp_id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Employee address not found'
            });
        }

        const sql = `
            UPDATE employee_address
            SET
                line_1 = ?,
                line_2 = ?,
                line_3 = ?,
                city_code = ?,
                pin_code = ?
            WHERE emp_id = ?
        `;

        await connection.query(sql, [
            line_1.trim(),
            line_2 ?? null,
            line_3 ?? null,
            city_code,
            pin_code,
            emp_id
        ]);

        res.status(200).json({
            message: 'Employee address updated successfully',
            emp_id
        });
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                message: 'Invalid city_code. Check the city table.'
            });
        }

        res.status(500).json({
            message: 'Failed to update employee address',
            error: error.message
        });
    }
});


// DELETE: Delete one employee address
router.delete('/:emp_id', async (req, res) => {
    try {
        const { emp_id } = req.params;
        const connection = await getConnection();

        const [result] = await connection.query(
            'DELETE FROM employee_address WHERE emp_id = ?',
            [emp_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Employee address not found'
            });
        }

        res.status(200).json({
            message: 'Employee address deleted successfully',
            emp_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete employee address',
            error: error.message
        });
    }
});

module.exports = router;