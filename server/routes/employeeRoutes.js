
const express = require('express');
const router = express.Router();
const { getConnection } = require('../datalayer/connector');
const { Employee } = require('../datalayer/entities');
const verifyToken = require("../middleware/verifyToken");

router.get('/' ,async function (request, response) {
    var connection = null;

    try {
        connection = await getConnection();

        var employees = [];

        var [rows] = await connection.execute(
            "select emp_id,first_name,last_name,gender,date_of_birth,is_indian,department_code,contact_num from employee where status = 'Active'"
        );

        rows.forEach(function (row) {
            employees.push(new Employee(
                row.emp_id,
                row.first_name,
                row.last_name,
                row.gender,
                row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : null,
                row.is_indian === 1 ? "Yes" : "No",
                row.department_code,
                row.contact_num
            ));
        });

        response.send(employees);
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});


router.get('/:id', async function (request, response) {
    var connection = null;

    try {
        connection = await getConnection();

        var [rows] = await connection.execute(
            "select emp_id,first_name,last_name,gender,date_of_birth,is_indian,department_code,contact_num from employee where emp_id = ? and status = 'Active'",
            [request.params.id]
        );

        if (rows.length === 0) {
            return response.status(404).send({ message: "Employee not found" });
        }

        var row = rows[0];

        var employee = new Employee(
            row.emp_id,
            row.first_name,
            row.last_name,
            row.gender,
            row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : null,
            row.is_indian === 1 ? "Yes" : "No",
            row.department_code,
            row.contact_num
        );

        response.send(employee);
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});


router.post('/', async function (request, response) {
    var connection = null;

    try {
        connection = await getConnection();

        if (!request.body || !request.body.firstName || !request.body.lastName) {
            return response.status(400).send({
                message: "First name and last name are required"
            });
        }

        var employee = request.body;

        var [result] = await connection.execute(
            "INSERT INTO employee (emp_id, first_name, last_name, gender, date_of_birth, is_indian, department_code, contact_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                employee.empId,
                employee.firstName,
                employee.lastName,
                employee.gender,
                employee.dateOfBirth || null,
                employee.isIndian ? 1 : 0,
                employee.departmentCode,
                employee.contactNum || null
            ]
        );

        response.status(201).send({
            message: "Employee added successfully",
            emp_id: employee.empId
        });
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});


router.put('/:id', async function (request, response) {
    var connection = null;

    try {
        connection = await getConnection();

        var employee = request.body;

        if (!employee) {
            return response.status(400).send({ message: "Employee data is required" });
        }

        var [result] = await connection.execute(
            "update employee set first_name = ?, last_name = ?, gender = ?, date_of_birth = ?, is_indian = ?, department_code = ?, contact_num = ? where emp_id = ? and status = 'Active'",
            [
                employee.firstName,
                employee.lastName,
                employee.gender,
                employee.dateOfBirth || null,
                employee.isIndian === true || employee.isIndian === "true" || employee.isIndian === "Yes" ? 1 : 0,
                employee.departmentCode,
                employee.contactNum,
                request.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return response.status(404).send({ message: "Employee not found or no changes made" });
        }

        response.send({ message: "Employee updated successfully" });
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});


router.delete('/:id', async function (request, response) {
    var connection = null;

    try {
        connection = await getConnection();

        var [result] = await connection.execute(
            "update employee set status = 'Inactive' where emp_id = ? and status = 'Active'",
            [request.params.id]
        );

        if (result.affectedRows === 0) {
            return response.status(404).send({ message: "Active employee not found" });
        }

        response.send({ message: "Employee deactivated successfully" });
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});

module.exports = router;