
import React, { useState, useEffect, useCallback } from "react";

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,
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
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Autocomplete
} from "@mui/material";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const API_URL = "/salary";
const EMPLOYEE_API_URL = "/employees";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);

const initialForm = {
    emp_id: "",
    basic_salary: "",
    hra: ""
};

const SalaryComponent = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Employees for Autocomplete
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [employeesError, setEmployeesError] = useState("");

    // Add / Update dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(initialForm);

    // Delete confirmation dialog
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedSalary, setSelectedSalary] = useState(null);

    // Snackbar notification
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Fetch all salary records
    const fetchSalaries = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch salary records"
                );
            }

            if (!Array.isArray(data)) {
                throw new Error("Invalid salary data received from server");
            }

            const formattedData = data.map((item) => {
                const empId = item.emp_id ?? item.empId;
                const firstName = item.first_name ?? item.firstName ?? "";
                const lastName = item.last_name ?? item.lastName ?? "";
                const basicSalary = Number(
                    item.basic_salary ?? item.basicSalary
                ) || 0;
                const hra = Number(item.hra) || 0;

                return {
                    id: empId,
                    name:
                        `${firstName} ${lastName}`.trim() ||
                        `Employee ${empId}`,
                    department:
                        item.department_name ??
                        item.departmentName ??
                        item.department_code ??
                        item.departmentCode ??
                        "Not Assigned",
                    basic: basicSalary,
                    allowance: hra,
                    totalSalary:
                        item.total_salary != null
                            ? Number(item.total_salary)
                            : item.totalSalary != null
                                ? Number(item.totalSalary)
                                : basicSalary + hra
                };
            });

            setSalaries(formattedData);
        } catch (err) {
            console.error("Salary API Error:", err);
            setError(err.message || "Unable to load salary records");
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    }, []);

    // Fetch employees for Autocomplete
    const fetchEmployees = useCallback(async () => {
        try {
            setEmployeesLoading(true);
            setEmployeesError("");

            const response = await fetch(EMPLOYEE_API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch employees"
                );
            }

            // Supports an array or common API response formats
            const employeeList = Array.isArray(data)
                ? data
                : Array.isArray(data.employees)
                    ? data.employees
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.data?.employees)
                            ? data.data.employees
                            : [];

            const validEmployees = employeeList.filter(
                (employee) =>
                    employee &&
                    (employee.empId != null || employee.emp_id != null)
            );

            setEmployees(validEmployees);

            if (validEmployees.length === 0) {
                setEmployeesError("No employees found.");
            }
        } catch (err) {
            console.error("Employees API Error:", err);
            setEmployeesError(
                err.message || "Unable to load employees"
            );
        } finally {
            setEmployeesLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalaries();
        fetchEmployees();
    }, [fetchSalaries, fetchEmployees]);

    // Get employee ID from either camelCase or snake_case response
    const getEmployeeId = (employee) =>
        employee?.empId ?? employee?.emp_id;

    // Employee label displayed in Autocomplete
    const getEmployeeLabel = (employee) => {
        if (!employee) return "";

        const empId = getEmployeeId(employee);
        const firstName =
            employee.firstName ?? employee.first_name ?? "";
        const lastName =
            employee.lastName ?? employee.last_name ?? "";

        return `${empId} - ${firstName} ${lastName}`.trim();
    };

    // Open Add dialog
    const handleAdd = () => {
        setEditMode(false);
        setFormData(initialForm);
        setOpenDialog(true);

        if (employees.length === 0 && !employeesLoading) {
            fetchEmployees();
        }
    };

    // Open Update dialog
    const handleEdit = (item) => {
        setEditMode(true);

        setFormData({
            emp_id: String(item.id),
            basic_salary: String(item.basic),
            hra: String(item.allowance)
        });

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        if (saving) return;

        setOpenDialog(false);
        setFormData(initialForm);
    };

    // Handle salary form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Add / Update salary
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) return;

        const empId = Number(formData.emp_id);
        const basicSalary = Number(formData.basic_salary);
        const hra = Number(formData.hra);

        if (
            !Number.isSafeInteger(empId) ||
            empId <= 0 ||
            formData.basic_salary.trim() === "" ||
            formData.hra.trim() === "" ||
            !Number.isFinite(basicSalary) ||
            !Number.isFinite(hra) ||
            basicSalary < 0 ||
            hra < 0
        ) {
            showNotification(
                "Select an employee and enter valid salary and HRA values.",
                "error"
            );
            return;
        }

        // On Add, verify that the selected employee exists in the loaded list
        if (
            !editMode &&
            !employees.some(
                (employee) =>
                    String(getEmployeeId(employee)) === String(empId)
            )
        ) {
            showNotification(
                "Please select a valid employee from the list.",
                "error"
            );
            return;
        }

        try {
            setSaving(true);

            const url = editMode
                ? `${API_URL}/${formData.emp_id}`
                : API_URL;

            const method = editMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...(editMode ? {} : { emp_id: empId }),
                    basic_salary: basicSalary,
                    hra
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to ${editMode ? "update" : "add"} salary`
                );
            }

            setOpenDialog(false);
            setFormData(initialForm);

            showNotification(
                result.message ||
                `Salary ${editMode ? "updated" : "added"} successfully`,
                "success"
            );

            setPage(0);
            await fetchSalaries(false);
        } catch (err) {
            console.error("Save Salary Error:", err);
            showNotification(
                err.message || "Unable to save salary",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // Open Delete confirmation
    const handleDeleteClick = (item) => {
        setSelectedSalary(item);
        setDeleteDialog(true);
    };

    const handleCloseDelete = () => {
        if (deleting) return;

        setDeleteDialog(false);
        setSelectedSalary(null);
    };

    // Delete salary
    const handleDelete = async () => {
        if (!selectedSalary || deleting) return;

        try {
            setDeleting(true);

            const response = await fetch(
                `${API_URL}/${selectedSalary.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete salary"
                );
            }

            setDeleteDialog(false);
            setSelectedSalary(null);

            showNotification(
                result.message || "Salary deleted successfully",
                "success"
            );

            setPage((currentPage) => {
                const remainingCount = salaries.length - 1;
                const lastPage = Math.max(
                    0,
                    Math.ceil(remainingCount / rowsPerPage) - 1
                );

                return Math.min(currentPage, lastPage);
            });

            await fetchSalaries(false);
        } catch (err) {
            console.error("Delete Salary Error:", err);
            showNotification(
                err.message || "Unable to delete salary",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    // Search and department filter
    const filtered = salaries.filter((item) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            String(item.id).includes(searchText);

        const matchesDepartment =
            department === "All" ||
            String(item.department) === department;

        return matchesSearch && matchesDepartment;
    });

    const payroll = salaries.reduce(
        (sum, item) => sum + item.totalSalary,
        0
    );

    const averageSalary =
        salaries.length > 0
            ? Math.round(payroll / salaries.length)
            : 0;

    const departments = [
        ...new Set(salaries.map((item) => String(item.department)))
    ];

    const stats = [
        {
            label: "Total Monthly Payroll",
            value: money(payroll),
            note: "Basic salary + HRA",
            icon: <PaymentsRoundedIcon />,
            color: "#2563eb",
            bg: "#eff6ff"
        },
        {
            label: "Employees",
            value: salaries.length,
            note: "Salary records",
            icon: <GroupsRoundedIcon />,
            color: "#7c3aed",
            bg: "#f5f3ff"
        },
        {
            label: "Pending Payments",
            value: "N/A",
            note: "Payment status not stored",
            icon: <PendingActionsRoundedIcon />,
            color: "#d97706",
            bg: "#fffbeb"
        },
        {
            label: "Average Salary",
            value: money(averageSalary),
            note: "Average basic + HRA",
            icon: <AccountBalanceWalletRoundedIcon />,
            color: "#059669",
            bg: "#ecfdf5"
        }
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f7fb",
                p: { xs: 2, md: 4 }
            }}
        >
            {/* Page Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                mb={4}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#172554",
                            fontSize: { xs: 26, md: 32 }
                        }}
                    >
                        Salary Management
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        Manage employee salary records and compensation.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={handleAdd}
                    sx={{
                        bgcolor: "#2563eb",
                        borderRadius: "10px",
                        px: 2.5,
                        py: 1.3,
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "none",
                        alignSelf: { xs: "flex-start", sm: "center" },
                        "&:hover": {
                            bgcolor: "#1d4ed8",
                            boxShadow: "none"
                        }
                    }}
                >
                    Add Salary
                </Button>
            </Stack>

            {/* Summary Cards */}
            <Grid container spacing={2.5} mb={4}>
                {stats.map((item) => (
                    <Grid item xs={12} sm={6} lg={3} key={item.label}>
                        <Card
                            elevation={0}
                            sx={{
                                height: "100%",
                                border: "1px solid #e5eaf2",
                                borderRadius: "16px",
                                boxShadow: "0 4px 16px rgba(15,23,42,0.03)"
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontWeight={600}
                                        >
                                            {item.label}
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                            color="#172554"
                                            mt={1.5}
                                        >
                                            {item.value}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {item.note}
                                        </Typography>
                                    </Box>

                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: item.bg,
                                            color: item.color,
                                            borderRadius: "13px"
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Salary Table */}
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #e5eaf2",
                    borderRadius: "16px",
                    overflow: "hidden"
                }}
            >
                {/* Table Header and Filters */}
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#172554"
                        >
                            Employee Salary Records
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            View and manage employee compensation.
                        </Typography>
                    </Box>

                    <TextField
                        size="small"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(0);
                        }}
                        sx={{
                            minWidth: { xs: "100%", sm: 210 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "9px",
                                bgcolor: "#f8fafc"
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon color="action" />
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
                            minWidth: 170,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "9px"
                            }
                        }}
                    >
                        <MenuItem value="All">All Departments</MenuItem>

                        {departments.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Loading */}
                {loading && (
                    <Stack alignItems="center" spacing={2} sx={{ py: 7 }}>
                        <CircularProgress />
                        <Typography color="text.secondary">
                            Loading salary records...
                        </Typography>
                    </Stack>
                )}

                {/* Fetch Error */}
                {!loading && error && (
                    <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
                        <Typography color="error" fontWeight={700}>
                            {error}
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="outlined"
                            onClick={() => fetchSalaries()}
                        >
                            Retry
                        </Button>
                    </Box>
                )}

                {/* Data Table */}
                {!loading && !error && (
                    <>
                        <TableContainer sx={{ overflowX: "auto" }}>
                            <Table sx={{ minWidth: 950 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                        {[
                                            "EMPLOYEE",
                                            "DEPARTMENT",
                                            "BASIC SALARY",
                                            "HRA",
                                            "DEDUCTIONS",
                                            "TOTAL SALARY",
                                            "ACTIONS"
                                        ].map((heading) => (
                                            <TableCell
                                                key={heading}
                                                sx={{
                                                    color: "#64748b",
                                                    fontWeight: 800,
                                                    fontSize: 11,
                                                    whiteSpace: "nowrap",
                                                    py: 2
                                                }}
                                            >
                                                {heading}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filtered
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((item) => (
                                            <TableRow
                                                hover
                                                key={item.id}
                                                sx={{
                                                    "&:last-child td": {
                                                        borderBottom: 0
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ py: 2 }}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1.5}
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: "#dbeafe",
                                                                color: "#1d4ed8",
                                                                width: 38,
                                                                height: 38,
                                                                fontSize: 13,
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {item.name
                                                                .split(" ")
                                                                .map((part) => part[0])
                                                                .join("")
                                                                .slice(0, 2)}
                                                        </Avatar>

                                                        <Box>
                                                            <Typography
                                                                fontWeight={700}
                                                                fontSize={13}
                                                            >
                                                                {item.name}
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                EMP-{item.id}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        color: "#475569",
                                                        fontSize: 13
                                                    }}
                                                >
                                                    {item.department}
                                                </TableCell>

                                                <TableCell sx={{ fontSize: 13 }}>
                                                    {money(item.basic)}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        color: "#059669",
                                                        fontSize: 13
                                                    }}
                                                >
                                                    +{money(item.allowance)}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        color: "#dc2626",
                                                        fontSize: 13
                                                    }}
                                                >
                                                    {money(0)}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: "#172554",
                                                        fontSize: 13
                                                    }}
                                                >
                                                    {money(item.totalSalary)}
                                                </TableCell>

                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        spacing={0.5}
                                                    >
                                                        <Tooltip title="Update salary">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    handleEdit(item)
                                                                }
                                                                sx={{
                                                                    color: "#2563eb",
                                                                    bgcolor: "#eff6ff",
                                                                    "&:hover": {
                                                                        bgcolor: "#dbeafe"
                                                                    }
                                                                }}
                                                            >
                                                                <EditRoundedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete salary">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDeleteClick(item)
                                                                }
                                                                sx={{
                                                                    color: "#dc2626",
                                                                    bgcolor: "#fef2f2",
                                                                    "&:hover": {
                                                                        bgcolor: "#fee2e2"
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteRoundedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                align="center"
                                                sx={{ py: 6 }}
                                            >
                                                <Typography
                                                    fontWeight={700}
                                                    color="text.secondary"
                                                >
                                                    No salary records found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={Math.min(
                                page,
                                Math.max(
                                    0,
                                    Math.ceil(filtered.length / rowsPerPage) - 1
                                )
                            )}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(Number(event.target.value));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </>
                )}
            </Paper>

            {/* Add / Update Salary Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: "#172554"
                        }}
                    >
                        {editMode ? "Update Salary" : "Add Salary"}
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={2.5} sx={{ pt: 1 }}>
                            {/* Employee Autocomplete */}
                            {editMode ? (
                                <TextField
                                    label="Employee ID"
                                    name="emp_id"
                                    value={formData.emp_id}
                                    disabled
                                    fullWidth
                                    helperText="Employee ID cannot be changed."
                                />
                            ) : (
                                <Autocomplete
                                    options={employees}
                                    value={
                                        employees.find(
                                            (employee) =>
                                                String(getEmployeeId(employee)) ===
                                                String(formData.emp_id)
                                        ) || null
                                    }
                                    loading={employeesLoading}
                                    getOptionLabel={getEmployeeLabel}
                                    isOptionEqualToValue={(option, value) =>
                                        String(getEmployeeId(option)) ===
                                        String(getEmployeeId(value))
                                    }
                                    onChange={(event, employee) => {
                                        setFormData((previous) => ({
                                            ...previous,
                                            emp_id: employee
                                                ? String(getEmployeeId(employee))
                                                : ""
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Employee"
                                            placeholder="Search employee ID or name"
                                            required={!formData.emp_id}
                                            error={Boolean(employeesError)}
                                            helperText={employeesError}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {employeesLoading && (
                                                            <CircularProgress
                                                                size={18}
                                                                color="inherit"
                                                            />
                                                        )}
                                                        {params.InputProps?.endAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                    noOptionsText={
                                        employeesLoading
                                            ? "Loading employees..."
                                            : "No employees found"
                                    }
                                    fullWidth
                                />
                            )}

                            <TextField
                                label="Basic Salary"
                                name="basic_salary"
                                type="number"
                                value={formData.basic_salary}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                inputProps={{ min: 0, step: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                label="HRA"
                                name="hra"
                                type="number"
                                value={formData.hra}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                inputProps={{ min: 0, step: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    bgcolor: "#f8fafc",
                                    borderRadius: 2
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Salary (Basic + HRA)
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color="#172554"
                                    mt={0.5}
                                >
                                    {money(
                                        Number(formData.basic_salary || 0) +
                                        Number(formData.hra || 0)
                                    )}
                                </Typography>
                            </Paper>
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5 }}>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={saving}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving || (!editMode && employeesLoading)}
                            startIcon={
                                saving ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : editMode ? (
                                    <EditRoundedIcon />
                                ) : (
                                    <AddRoundedIcon />
                                )
                            }
                            sx={{
                                bgcolor: "#2563eb",
                                textTransform: "none",
                                fontWeight: 700
                            }}
                        >
                            {saving
                                ? "Saving..."
                                : editMode
                                    ? "Update Salary"
                                    : "Add Salary"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog}
                onClose={handleCloseDelete}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#172554" }}>
                    Delete Salary
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to delete the salary record for{" "}
                        <strong>{selectedSalary?.name}</strong> (EMP-
                        {selectedSalary?.id})? This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={handleCloseDelete}
                        disabled={deleting}
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <DeleteRoundedIcon />
                            )
                        }
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success / Error Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3500}
                onClose={(event, reason) => {
                    if (reason === "clickaway") return;

                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() =>
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SalaryComponent;