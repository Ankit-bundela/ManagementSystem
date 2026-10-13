
class Employee {
    constructor(
        empId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        isIndian,
        departmentCode,
        contactNum
    ) {
        this.empId = empId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.isIndian = isIndian;
        this.departmentCode = departmentCode;
        this.contactNum = contactNum;
    }

    getId() {
        return this.empId;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getGender() {
        return this.gender;
    }

    getDateOfBirth() {
        return this.dateOfBirth;
    }

    getIsIndian() {
        return this.isIndian;
    }

    getDepartmentCode() {
        return this.departmentCode;
    }

    getContactNum() {
        return this.contactNum;
    }
}

module.exports = { Employee };