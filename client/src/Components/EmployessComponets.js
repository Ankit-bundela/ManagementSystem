import React, { useState, useEffect, useCallback } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    Avatar,
    TextField,
    InputAdornment,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Autocomplete
} from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

//const API_URL = "http://localhost:5050/employees";
//const DEPARTMENT_API_URL = "http://localhost:5050/departments";
const API_URL = `${process.env.REACT_APP_API_URL}/employees`;
const DEPARTMENT_API_URL = `${process.env.REACT_APP_API_URL}/departments`;


const initialFormData = {
    empId: "",
    firstName: "",
    lastName: "",
    gender: "M",
    dateOfBirth: "",
    isIndian: "true",
    departmentCode: "",
    contactNum: ""
};

// Common API helper
const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.message || `Request failed with status ${response.status}`
        );
    }

    return result;
};

// Fetch employees
const fetchEmployees = async () => {
    const data = await apiRequest(API_URL);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.employees)) return data.employees;
    if (Array.isArray(data.data)) return data.data;

    return [];
};

// Fetch departments
const fetchDepartments = async () => {
    const data = await apiRequest(DEPARTMENT_API_URL);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.departments)) return data.departments;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.result)) return data.result;

    return [];
};

const EmployeeComponents = () => {
    const [employees, setEmployees] = useState([]);
    const [departmentsList, setDepartmentsList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [departmentsLoading, setDepartmentsLoading] = useState(false);

    const [error, setError] = useState("");
    const [departmentError, setDepartmentError] = useState("");

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({ ...initialFormData });
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Support camelCase and snake_case employee fields
    const getValue = (obj, camelCase, snakeCase) =>
        obj?.[camelCase] ?? obj?.[snakeCase];

    // Department API fields: { code: 101, name: "Computer Science" }
    const getDepartmentCode = (item) =>
        item?.code ??
        item?.departmentCode ??
        item?.department_code ??
        item?.deptCode ??
        item?.dept_code ??
        item?.DEPARTMENT_CODE;

    const getDepartmentName = (item) =>
        item?.name ??
        item?.departmentName ??
        item?.department_name ??
        item?.deptName ??
        item?.dept_name ??
        item?.DEPARTMENT_NAME ??
        "";

    const getEmployeeId = (employee) =>
        getValue(employee, "empId", "emp_id");

    const getFullName = (employee) =>
        `${getValue(employee, "firstName", "first_name") ?? ""} ${
            getValue(employee, "lastName", "last_name") ?? ""
        }`.trim();

    const getInitials = (employee) => {
        const name = getFullName(employee);

        return (
            name
                .split(/\s+/)
                .filter(Boolean)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "E"
        );
    };

    const isIndianValue = (value) =>
        value === true ||
        value === 1 ||
        value === "1" ||
        String(value).toLowerCase() === "true" ||
        String(value).toLowerCase() === "yes";

    const getNationality = (value) => {
        if (isIndianValue(value)) return "Indian";

        if (
            value === false ||
            value === 0 ||
            value === "0" ||
            String(value).toLowerCase() === "false" ||
            String(value).toLowerCase() === "no"
        ) {
            return "Other";
        }

        return value ?? "—";
    };

    const formatDate = (value) => {
        if (!value) return "—";

        const dateString = String(value);

        const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
            ? new Date(`${dateString}T00:00:00Z`)
            : new Date(value);

        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    };

    // Load employees
    const loadEmployees = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await fetchEmployees();
            setEmployees(data);

            const lastPage = Math.max(
                0,
                Math.ceil(data.length / rowsPerPage) - 1
            );

            setPage((currentPage) => Math.min(currentPage, lastPage));
        } catch (err) {
            setError(
                err.message ||
                    "Unable to load employees. Check the backend server."
            );
        } finally {
            setLoading(false);
        }
    }, [rowsPerPage]);

    // Load departments
    const loadDepartments = useCallback(async () => {
        setDepartmentsLoading(true);
        setDepartmentError("");

        try {
            const data = await fetchDepartments();

            console.log("Departments API response:", data);

            const validDepartments = data.filter((item) => {
                const code = getDepartmentCode(item);
                return code !== null && code !== undefined;
            });

            setDepartmentsList(validDepartments);

            if (validDepartments.length === 0) {
                setDepartmentError(
                    "No usable department codes found in the API response."
                );
            }
        } catch (err) {
            console.error("Department API error:", err);
            setDepartmentsList([]);
            setDepartmentError(
                err.message || "Unable to load departments."
            );
        } finally {
            setDepartmentsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEmployees();
        loadDepartments();
    }, [loadEmployees, loadDepartments]);

    // Currently selected department for Autocomplete
    const selectedDepartment =
        departmentsList.find(
            (item) =>
                String(getDepartmentCode(item)) ===
                String(formData.departmentCode)
        ) || null;

    // Department filter options
    const departmentOptions = [
        ...new Set(
            employees
                .map((employee) =>
                    getValue(employee, "departmentCode", "department_code")
                )
                .filter((code) => code !== null && code !== undefined)
                .map(String)
        )
    ];

    // Filter employees
    const filteredEmployees = employees.filter((employee) => {
        const fullName = getFullName(employee).toLowerCase();
        const empId = getEmployeeId(employee);
        const contact = getValue(employee, "contactNum", "contact_num");

        const departmentCode = getValue(
            employee,
            "departmentCode",
            "department_code"
        );

        const searchText = search.trim().toLowerCase();

        const matchesSearch = [
            fullName,
            empId,
            employee.gender,
            contact,
            departmentCode
        ].some((value) =>
            String(value ?? "").toLowerCase().includes(searchText)
        );

        const matchesDepartment =
            department === "All" ||
            String(departmentCode) === department;

        return matchesSearch && matchesDepartment;
    });

    const maleCount = employees.filter((employee) =>
        ["m", "male"].includes(
            String(employee.gender ?? "").toLowerCase()
        )
    ).length;

    const femaleCount = employees.filter((employee) =>
        ["f", "female"].includes(
            String(employee.gender ?? "").toLowerCase()
        )
    ).length;

    const stats = [
        {
            title: "Total Employees",
            value: employees.length,
            subtitle: "Employee records",
            icon: <GroupsRoundedIcon />,
            color: "#2563EB",
            bg: "#DBEAFE"
        },
        {
            title: "Male Employees",
            value: maleCount,
            subtitle: "Male employee records",
            icon: <MaleRoundedIcon />,
            color: "#0284C7",
            bg: "#E0F2FE"
        },
        {
            title: "Female Employees",
            value: femaleCount,
            subtitle: "Female employee records",
            icon: <FemaleRoundedIcon />,
            color: "#DB2777",
            bg: "#FCE7F3"
        },
        {
            title: "Departments",
            value: departmentsList.length,
            subtitle: "Available departments",
            icon: <ApartmentRoundedIcon />,
            color: "#7C3AED",
            bg: "#EDE9FE"
        }
    ];

    // Open Add dialog
    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setFormData({ ...initialFormData });
        setFormError("");
        setDialogOpen(true);

        if (departmentsList.length === 0 && !departmentsLoading) {
            loadDepartments();
        }
    };

    // Open Edit dialog
    const handleEditEmployee = (employee) => {
        const indianValue = getValue(
            employee,
            "isIndian",
            "is_indian"
        );

        const rawDate = getValue(
            employee,
            "dateOfBirth",
            "date_of_birth"
        );

        setEditingEmployee(employee);

        setFormData({
            empId: String(getEmployeeId(employee) ?? ""),
            firstName:
                getValue(employee, "firstName", "first_name") ?? "",
            lastName:
                getValue(employee, "lastName", "last_name") ?? "",
            gender: String(employee.gender ?? "M")
                .toUpperCase()
                .startsWith("F")
                ? "F"
                : "M",
            dateOfBirth: rawDate ? String(rawDate).slice(0, 10) : "",
            isIndian: isIndianValue(indianValue) ? "true" : "false",
            departmentCode: String(
                getValue(
                    employee,
                    "departmentCode",
                    "department_code"
                ) ?? ""
            ),
            contactNum:
                getValue(employee, "contactNum", "contact_num") ?? ""
        });

        setFormError("");
        setDialogOpen(true);

        if (departmentsList.length === 0 && !departmentsLoading) {
            loadDepartments();
        }
    };

    const handleCloseDialog = () => {
        if (saving) return;

        setDialogOpen(false);
        setFormError("");
        setEditingEmployee(null);
        setFormData({ ...initialFormData });
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Validate form and prepare payload
    const getValidatedPayload = () => {
        const empId = Number(formData.empId);
        const departmentCode = Number(formData.departmentCode);

        if (!Number.isSafeInteger(empId) || empId <= 0) {
            throw new Error("Please enter a valid Employee ID.");
        }

        if (!formData.firstName.trim()) {
            throw new Error("Please enter the first name.");
        }

        if (!formData.lastName.trim()) {
            throw new Error("Please enter the last name.");
        }

        if (
            !Number.isSafeInteger(departmentCode) ||
            departmentCode <= 0
        ) {
            throw new Error("Please select a valid department.");
        }

        const departmentExists = departmentsList.some(
            (item) =>
                String(getDepartmentCode(item)) ===
                String(departmentCode)
        );

        if (!departmentExists) {
            throw new Error(
                "Please select a department from the dropdown."
            );
        }

        if (!formData.dateOfBirth) {
            throw new Error("Please select the date of birth.");
        }

        const dob = new Date(`${formData.dateOfBirth}T00:00:00`);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (dob > today) {
            throw new Error("Date of birth cannot be in the future.");
        }

        if (!String(formData.contactNum).trim()) {
            throw new Error("Please enter the contact number.");
        }

        return {
            empId,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            isIndian: formData.isIndian === "true",
            departmentCode,
            contactNum: String(formData.contactNum).trim()
        };
    };

    // Add Employee
    const handleSubmitEmployee = async (event) => {
        event.preventDefault();

        if (saving) return;

        setSaving(true);
        setFormError("");

        try {
            const payload = getValidatedPayload();

            const result = await apiRequest(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            setDialogOpen(false);
            setEditingEmployee(null);
            setFormData({ ...initialFormData });
            setPage(0);

            setSuccessMessage(
                result.message || "Employee added successfully!"
            );

            await loadEmployees();
        } catch (err) {
            setFormError(err.message || "Failed to add employee.");
        } finally {
            setSaving(false);
        }
    };

    // Update Employee
    const handleUpdateEmployee = async (event) => {
        event.preventDefault();

        if (!editingEmployee || saving) return;

        setSaving(true);
        setFormError("");

        try {
            const payload = getValidatedPayload();
            const { empId, ...updatePayload } = payload;
            const existingId = getEmployeeId(editingEmployee);

            const result = await apiRequest(
                `${API_URL}/${encodeURIComponent(existingId)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatePayload)
                }
            );

            setDialogOpen(false);
            setEditingEmployee(null);
            setFormData({ ...initialFormData });

            setSuccessMessage(
                result.message || "Employee updated successfully!"
            );

            await loadEmployees();
        } catch (err) {
            setFormError(err.message || "Failed to update employee.");
        } finally {
            setSaving(false);
        }
    };

    // Delete confirmation
    const handleDeleteClick = (employee) => {
        setDeletingEmployee(employee);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        if (deleting) return;

        setDeleteDialogOpen(false);
        setDeletingEmployee(null);
    };

    // Delete employee
    const handleDeleteEmployee = async () => {
        if (!deletingEmployee || deleting) return;

        const empId = getEmployeeId(deletingEmployee);
        setDeleting(true);

        try {
            const result = await apiRequest(
                `${API_URL}/${encodeURIComponent(empId)}`,
                { method: "DELETE" }
            );

            setDeleteDialogOpen(false);
            setDeletingEmployee(null);

            setSuccessMessage(
                result.message || "Employee deleted successfully!"
            );

            await loadEmployees();
        } catch (err) {
            setErrorMessage(
                err.message || "Unable to delete employee."
            );
        } finally {
            setDeleting(false);
        }
    };

    const tableCellStyle = {
        fontSize: 13,
        color: "#475569",
        borderBottom: "1px solid #F1F5F9",
        py: 1.8,
        whiteSpace: "nowrap"
    };

    const headerCellStyle = {
        fontSize: 12,
        fontWeight: 700,
        color: "#334155",
        bgcolor: "#F1F5F9",
        py: 1.8,
        whiteSpace: "nowrap"
    };

    const currentPage = Math.min(
        page,
        Math.max(
            0,
            Math.ceil(filteredEmployees.length / rowsPerPage) - 1
        )
    );

    return (
        <Box
            sx={{
                bgcolor: "#F8FAFC",
                minHeight: "100vh",
                p: { xs: 2, md: 3 }
            }}
        >
            {/* Page Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#0F172A",
                            letterSpacing: "-0.5px"
                        }}
                    >
                        Employee Management
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5, fontSize: 14 }}
                    >
                        Manage employee profiles and department information.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={handleAddEmployee}
                    sx={{
                        bgcolor: "#2563EB",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.2,
                        py: 1.1,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#1D4ED8" }
                    }}
                >
                    Add Employee
                </Button>
            </Stack>

            {/* Summary Cards */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                {stats.map((item) => (
                    <Card
                        key={item.title}
                        elevation={0}
                        sx={{
                            border: "1px solid #E2E8F0",
                            borderRadius: 3,
                            "&:hover": {
                                boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography
                                    color="text.secondary"
                                    fontWeight={600}
                                    sx={{ fontSize: 13 }}
                                >
                                    {item.title}
                                </Typography>

                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: item.bg,
                                        color: item.color,
                                        borderRadius: 2
                                    }}
                                >
                                    {item.icon}
                                </Avatar>
                            </Stack>

                            <Typography
                                variant="h4"
                                sx={{
                                    mt: 2,
                                    mb: 0.5,
                                    fontWeight: 800,
                                    color: "#0F172A"
                                }}
                            >
                                {loading ? "—" : item.value}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {item.subtitle}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Employee Directory */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    overflow: "hidden"
                }}
            >
                <CardContent sx={{ p: 3, pb: 2 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1.5}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: "#0F172A" }}
                            >
                                Employee Directory
                            </Typography>

                            <Typography
                                color="text.secondary"
                                variant="body2"
                                sx={{ mt: 0.5 }}
                            >
                                Browse and search employee records.
                            </Typography>
                        </Box>

                        <Chip
                            icon={<BadgeRoundedIcon />}
                            label={`${filteredEmployees.length} Employees`}
                            sx={{
                                bgcolor: "#DBEAFE",
                                color: "#1D4ED8",
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        />
                    </Stack>
                </CardContent>

                {/* Search and Department Filter */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #E2E8F0"
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Search name, ID, phone..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(0);
                        }}
                        sx={{
                            flex: "1 1 250px",
                            maxWidth: { sm: 360 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                bgcolor: "#FFFFFF",
                                fontSize: 13
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: "#94A3B8" }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        select
                        size="small"
                        label="Department"
                        value={department}
                        onChange={(event) => {
                            setDepartment(event.target.value);
                            setPage(0);
                        }}
                        sx={{
                            minWidth: 200,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                bgcolor: "#FFFFFF",
                                fontSize: 13
                            }
                        }}
                    >
                        <MenuItem value="All">All Departments</MenuItem>

                        {departmentOptions.map((code) => {
                            const matchingDepartment = departmentsList.find(
                                (item) =>
                                    String(getDepartmentCode(item)) === code
                            );

                            return (
                                <MenuItem key={code} value={code}>
                                    {matchingDepartment
                                        ? `${code} - ${getDepartmentName(matchingDepartment)}`
                                        : `Department ${code}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            loadEmployees();
                            loadDepartments();
                        }}
                        disabled={loading || departmentsLoading}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                        Refresh
                    </Button>
                </Box>

                {error && (
                    <Box sx={{ px: 3, py: 2 }}>
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={loadEmployees}
                                >
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Box>
                )}

                {/* Employee Table */}
                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {[
                                    "EMPLOYEE",
                                    "EMPLOYEE ID",
                                    "GENDER",
                                    "NATIONALITY",
                                    "DEPARTMENT",
                                    "DATE OF BIRTH",
                                    "CONTACT NUMBER",
                                    "ACTIONS"
                                ].map((heading) => (
                                    <TableCell
                                        key={heading}
                                        sx={headerCellStyle}
                                    >
                                        {heading}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <CircularProgress size={30} />
                                        <Typography
                                            color="text.secondary"
                                            sx={{ mt: 1.5 }}
                                        >
                                            Loading employee records...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees
                                    .slice(
                                        currentPage * rowsPerPage,
                                        currentPage * rowsPerPage + rowsPerPage
                                    )
                                    .map((employee, index) => {
                                        const empId = getEmployeeId(employee);

                                        const departmentCode = getValue(
                                            employee,
                                            "departmentCode",
                                            "department_code"
                                        );

                                        const dateOfBirth = getValue(
                                            employee,
                                            "dateOfBirth",
                                            "date_of_birth"
                                        );

                                        const contactNum = getValue(
                                            employee,
                                            "contactNum",
                                            "contact_num"
                                        );

                                        const gender = String(
                                            employee.gender ?? "—"
                                        );

                                        const isFemale = ["f", "female"].includes(
                                            gender.toLowerCase()
                                        );

                                        const matchingDepartment =
                                            departmentsList.find(
                                                (item) =>
                                                    String(
                                                        getDepartmentCode(item)
                                                    ) === String(departmentCode)
                                            );

                                        const departmentLabel = matchingDepartment
                                            ? `${getDepartmentCode(matchingDepartment)} - ${getDepartmentName(matchingDepartment)}`
                                            : `Department ${departmentCode ?? "—"}`;

                                        return (
                                            <TableRow
                                                hover
                                                key={empId ?? index}
                                                sx={{
                                                    "&:hover": {
                                                        bgcolor: "#F8FAFC"
                                                    },
                                                    "&:last-child td": {
                                                        borderBottom: 0
                                                    }
                                                }}
                                            >
                                                <TableCell sx={tableCellStyle}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1.5}
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: "#CCFBF1",
                                                                color: "#0F766E",
                                                                width: 38,
                                                                height: 38,
                                                                fontSize: 13,
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {getInitials(employee)}
                                                        </Avatar>

                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                    color: "#0F172A"
                                                                }}
                                                            >
                                                                {getFullName(employee) ||
                                                                    "Unnamed Employee"}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 11,
                                                                    color: "#64748B",
                                                                    mt: 0.3
                                                                }}
                                                            >
                                                                Employee profile
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    <Chip
                                                        size="small"
                                                        label={`#${empId ?? "—"}`}
                                                        sx={{
                                                            bgcolor: "#F1F5F9",
                                                            color: "#475569",
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    <Chip
                                                        size="small"
                                                        label={gender}
                                                        sx={{
                                                            bgcolor: isFemale
                                                                ? "#FCE7F3"
                                                                : "#DBEAFE",
                                                            color: isFemale
                                                                ? "#BE185D"
                                                                : "#1D4ED8",
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={0.8}
                                                        alignItems="center"
                                                    >
                                                        <PublicRoundedIcon
                                                            sx={{
                                                                fontSize: 17,
                                                                color: "#94A3B8"
                                                            }}
                                                        />
                                                        {getNationality(
                                                            getValue(
                                                                employee,
                                                                "isIndian",
                                                                "is_indian"
                                                            )
                                                        )}
                                                    </Stack>
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    <Chip
                                                        size="small"
                                                        label={departmentLabel}
                                                        sx={{
                                                            bgcolor: "#EDE9FE",
                                                            color: "#6D28D9",
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    {formatDate(dateOfBirth)}
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    {contactNum ?? "—"}
                                                </TableCell>

                                                <TableCell sx={tableCellStyle}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        justifyContent="center"
                                                    >
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<EditRoundedIcon />}
                                                            onClick={() =>
                                                                handleEditEmployee(employee)
                                                            }
                                                            sx={{
                                                                textTransform: "none",
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={
                                                                <DeleteOutlineRoundedIcon />
                                                            }
                                                            onClick={() =>
                                                                handleDeleteClick(employee)
                                                            }
                                                            sx={{
                                                                textTransform: "none",
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredEmployees.length}
                    page={currentPage}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    labelRowsPerPage="Rows per page:"
                />
            </Card>

            {/* Add / Update Employee Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: "#0F172A",
                        borderBottom: "1px solid #E2E8F0"
                    }}
                >
                    {editingEmployee ? "Update Employee" : "Add New Employee"}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {editingEmployee
                            ? "Update the employee details below."
                            : "Enter the employee details below."}
                    </Typography>
                </DialogTitle>

                <Box
                    component="form"
                    onSubmit={
                        editingEmployee
                            ? handleUpdateEmployee
                            : handleSubmitEmployee
                    }
                >
                    <DialogContent sx={{ pt: 3 }}>
                        {formError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {formError}
                            </Alert>
                        )}

                        {departmentError && (
                            <Alert
                                severity="warning"
                                sx={{ mb: 2 }}
                                action={
                                    <Button
                                        color="inherit"
                                        size="small"
                                        onClick={loadDepartments}
                                    >
                                        Retry
                                    </Button>
                                }
                            >
                                {departmentError}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr"
                                },
                                gap: 2
                            }}
                        >
                            <TextField
                                label="Employee ID"
                                name="empId"
                                type="number"
                                value={formData.empId}
                                onChange={handleFormChange}
                                required
                                disabled={Boolean(editingEmployee)}
                                fullWidth
                                slotProps={{
                                    htmlInput: { min: 1, step: 1 }
                                }}
                            />

                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                required
                                fullWidth
                            />

                            <TextField
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleFormChange}
                                required
                                fullWidth
                            >
                                <MenuItem value="M">Male (M)</MenuItem>
                                <MenuItem value="F">Female (F)</MenuItem>
                            </TextField>

                            <TextField
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleFormChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        max: new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                }}
                                required
                                fullWidth
                            />

                            <TextField
                                select
                                label="Nationality"
                                name="isIndian"
                                value={formData.isIndian}
                                onChange={handleFormChange}
                                required
                                fullWidth
                            >
                                <MenuItem value="true">Indian</MenuItem>
                                <MenuItem value="false">Other</MenuItem>
                            </TextField>

                            {/* Department Autocomplete - FIXED */}
                            <Box
                                sx={{
                                    gridColumn: { xs: "1", sm: "1 / -1" }
                                }}
                            >
                                <Autocomplete
                                    options={departmentsList}
                                    value={selectedDepartment}
                                    loading={departmentsLoading}
                                    disabled={departmentsLoading}
                                    getOptionLabel={(option) => {
                                        const code = getDepartmentCode(option);
                                        const name = getDepartmentName(option);

                                        return name
                                            ? `${code} - ${name}`
                                            : `Department ${code}`;
                                    }}
                                    isOptionEqualToValue={(option, value) =>
                                        String(getDepartmentCode(option)) ===
                                        String(getDepartmentCode(value))
                                    }
                                    onChange={(_, selected) => {
                                        setFormData((previous) => ({
                                            ...previous,
                                            departmentCode: selected
                                                ? String(
                                                      getDepartmentCode(selected)
                                                  )
                                                : ""
                                        }));
                                    }}
                                    noOptionsText={
                                        departmentsLoading
                                            ? "Loading departments..."
                                            : "No departments found"
                                    }
                                    renderInput={(params) => {
                                        // Safe fallbacks prevent undefined errors.
                                        const inputParams =
                                            params.InputProps ?? {};

                                        const nativeInputProps =
                                            params.inputProps ?? {};

                                        return (
                                            <TextField
                                                {...params}
                                                label="Select Department"
                                                placeholder="Search department code or name"
                                                required={
                                                    !formData.departmentCode
                                                }
                                                error={Boolean(departmentError)}
                                                helperText={
                                                    departmentError ||
                                                    "Select the employee's department."
                                                }
                                                InputProps={{
                                                    ...inputParams,
                                                    endAdornment: (
                                                        <>
                                                            {departmentsLoading && (
                                                                <CircularProgress
                                                                    size={18}
                                                                    color="inherit"
                                                                    sx={{ mr: 1 }}
                                                                />
                                                            )}

                                                            {inputParams.endAdornment ??
                                                                null}
                                                        </>
                                                    )
                                                }}
                                                inputProps={{
                                                    ...nativeInputProps
                                                }}
                                            />
                                        );
                                    }}
                                    fullWidth
                                />
                            </Box>

                            <TextField
                                label="Contact Number"
                                name="contactNum"
                                type="tel"
                                value={formData.contactNum}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{
                                    gridColumn: { xs: "1", sm: "1 / -1" }
                                }}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={saving}
                            sx={{
                                color: "#475569",
                                textTransform: "none"
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving || departmentsLoading}
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : editingEmployee ? (
                                    <EditRoundedIcon />
                                ) : (
                                    <AddRoundedIcon />
                                )
                            }
                            sx={{
                                bgcolor: "#2563EB",
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2.5,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#1D4ED8" }
                            }}
                        >
                            {saving
                                ? editingEmployee
                                    ? "Updating..."
                                    : "Saving..."
                                : editingEmployee
                                  ? "Update Employee"
                                  : "Save Employee"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#991B1B" }}>
                    Delete Employee?
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
                        Are you sure you want to delete{" "}
                        <strong>
                            {deletingEmployee
                                ? getFullName(deletingEmployee)
                                : "this employee"}
                        </strong>
                        ?
                    </Typography>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        If the employee has related salary, address or
                        attendance records, the backend may reject deletion
                        because of foreign-key constraints.
                    </Alert>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        disabled={deleting}
                        sx={{
                            textTransform: "none",
                            color: "#475569"
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteEmployee}
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={16}
                                    color="inherit"
                                />
                            ) : (
                                <DeleteOutlineRoundedIcon />
                            )
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            boxShadow: "none"
                        }}
                    >
                        {deleting ? "Deleting..." : "Yes, Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Notification */}
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccessMessage("")}
                >
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Error Notification */}
            <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={4000}
                onClose={() => setErrorMessage("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setErrorMessage("")}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployeeComponents;
