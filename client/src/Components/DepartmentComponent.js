
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    InputAdornment,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    Paper,
    Chip,
    LinearProgress,
    Avatar,
    Stack,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const useStyles = makeStyles(() => ({
    root: {
        padding: "32px",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
        "@media (max-width:600px)": {
            padding: "16px",
        },
    },

    header: {
        marginBottom: "32px",
    },

    title: {
        fontWeight: "800 !important",
        color: "#172554",
    },

    subtitle: {
        marginTop: "8px",
        color: "#64748b",
    },

    summaryCard: {
        height: "100%",
        borderRadius: "12px !important",
        boxShadow: "0 4px 20px #0f172a0d !important",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px #0f172a14 !important",
        },
    },

    cardContent: {
        padding: "24px !important",
    },

    departmentAvatar: {
        width: "52px !important",
        height: "52px !important",
    },

    departmentIcon: {
        backgroundColor: "#e0e7ff !important",
        color: "#4338ca !important",
    },

    employeeIcon: {
        backgroundColor: "#dcfce7 !important",
        color: "#15803d !important",
    },

    activeIcon: {
        backgroundColor: "#fef3c7 !important",
        color: "#b45309 !important",
    },

    cardLabel: {
        color: "#64748b",
    },

    cardNumber: {
        fontWeight: "800 !important",
        color: "#172554",
    },

    tablePaper: {
        borderRadius: "12px !important",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
    },

    tableToolbar: {
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        "@media (max-width:600px)": {
            flexDirection: "column",
            alignItems: "stretch",
        },
    },

    sectionTitle: {
        fontWeight: "800 !important",
    },

    searchField: {
        width: "280px",
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#ffffff",
        },
        "@media (max-width:600px)": {
            width: "100%",
        },
    },

    tableHead: {
        backgroundColor: "#f8fafc",
    },

    headCell: {
        fontWeight: "800 !important",
        color: "#334155",
        whiteSpace: "nowrap",
    },

    codeChip: {
        fontWeight: "700 !important",
        backgroundColor: "#eef2ff !important",
        color: "#4338ca !important",
    },

    nameAvatar: {
        width: "38px !important",
        height: "38px !important",
        backgroundColor: "#e0f2fe !important",
        color: "#0369a1 !important",
        fontSize: "15px !important",
        fontWeight: "700 !important",
    },

    departmentName: {
        fontWeight: "600 !important",
        color: "#1e293b",
    },

    employeeCount: {
        fontWeight: "700 !important",
    },

    progressContainer: {
        minWidth: "150px",
    },

    progressBar: {
        height: "7px !important",
        borderRadius: "5px",
        backgroundColor: "#e5e7eb !important",
        "& .MuiLinearProgress-bar": {
            borderRadius: "5px",
            backgroundColor: "#6366f1",
        },
    },

    tableRow: {
        "&:hover": {
            backgroundColor: "#f8fafc !important",
        },
        "&:last-child td": {
            borderBottom: 0,
        },
    },

    emptyMessage: {
        padding: "40px !important",
        color: "#64748b",
    },
}));

const DepartmentComponent = () => {
    const classes = useStyles();

    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
    });

    const [deleteCode, setDeleteCode] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // READ: Fetch departments and employee counts
    const fetchDepartments = async () => {
        const response = await fetch("/departments/employee-counts", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch departments.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid department data received.");
        }

        setDepartments(data);
    };

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoading(true);
                await fetchDepartments();
            } catch (err) {
                setError(err.message || "Unable to load departments.");
            } finally {
                setLoading(false);
            }
        };

        loadDepartments();
    }, []);

    // CREATE: Open add dialog
    const openAddDialog = () => {
        setEditingDepartment(null);
        setFormData({
            code: "",
            name: "",
        });
        setError("");
        setDialogOpen(true);
    };

    // UPDATE: Open edit dialog
    const openEditDialog = (department) => {
        setEditingDepartment(department);
        setFormData({
            code: String(department.code),
            name: department.name || "",
        });
        setError("");
        setDialogOpen(true);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // CREATE / UPDATE: Save department
    const handleSave = async (event) => {
        event.preventDefault();
        setError("");

        const name = formData.name.trim();
        const code = Number(formData.code);

        if (!name) {
            setError("Please enter a department name.");
            return;
        }

        if (
            !editingDepartment &&
            (!formData.code.trim() ||
                !Number.isSafeInteger(code) ||
                code <= 0)
        ) {
            setError("Department code must be a positive integer.");
            return;
        }

        const url = editingDepartment
            ? `/departments/${encodeURIComponent(editingDepartment.code)}`
            : "/departments";

        const method = editingDepartment ? "PUT" : "POST";

        const body = editingDepartment
            ? { name }
            : { code, name };

        try {
            setSaving(true);

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(body),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Unable to save department."
                );
            }

            await fetchDepartments();

            setDialogOpen(false);
            setEditingDepartment(null);
            setPage(0);

            setNotice(
                editingDepartment
                    ? "Department updated successfully."
                    : "Department added successfully."
            );
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    // DELETE: Remove department
    const handleDelete = async () => {
        if (deleteCode === null) return;

        try {
            setDeleting(true);
            setError("");

            const response = await fetch(
                `/departments/${encodeURIComponent(deleteCode)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Unable to delete department."
                );
            }

            await fetchDepartments();

            setDeleteCode(null);
            setNotice("Department deleted successfully.");
        } catch (err) {
            setDeleteCode(null);
            setError(err.message || "Unable to delete department.");
        } finally {
            setDeleting(false);
        }
    };

    const filteredDepartments = departments.filter((department) =>
        `${department.code} ${department.name}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalEmployees = departments.reduce(
        (total, department) =>
            total + Number(department.totalEmployees || 0),
        0
    );

    const activeDepartments = departments.filter(
        (department) => Number(department.totalEmployees || 0) > 0
    ).length;

    const maxEmployees = Math.max(
        ...departments.map((department) =>
            Number(department.totalEmployees || 0)
        ),
        1
    );

    return (
        <Box className={classes.root}>
            {/* Header */}
            <Box className={classes.header}>
                <Typography variant="h4" className={classes.title}>
                    Department Management
                </Typography>

                <Typography className={classes.subtitle}>
                    Manage departments and monitor employee distribution.
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.summaryCard}>
                        <CardContent className={classes.cardContent}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Avatar
                                    className={`${classes.departmentAvatar} ${classes.departmentIcon}`}
                                >
                                    <ApartmentRoundedIcon />
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        className={classes.cardLabel}
                                    >
                                        Total Departments
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        className={classes.cardNumber}
                                    >
                                        {departments.length}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.summaryCard}>
                        <CardContent className={classes.cardContent}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Avatar
                                    className={`${classes.departmentAvatar} ${classes.employeeIcon}`}
                                >
                                    <GroupsRoundedIcon />
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        className={classes.cardLabel}
                                    >
                                        Total Employees
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        className={classes.cardNumber}
                                    >
                                        {totalEmployees}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.summaryCard}>
                        <CardContent className={classes.cardContent}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Avatar
                                    className={`${classes.departmentAvatar} ${classes.activeIcon}`}
                                >
                                    <ApartmentRoundedIcon />
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        className={classes.cardLabel}
                                    >
                                        Active Departments
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        className={classes.cardNumber}
                                    >
                                        {activeDepartments}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Department Table */}
            <Paper elevation={0} className={classes.tablePaper}>
                <Box className={classes.tableToolbar}>
                    <Box>
                        <Typography
                            variant="h6"
                            className={classes.sectionTitle}
                        >
                            All Departments
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Department-wise employee overview
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{
                            flexWrap: "wrap",
                            rowGap: 1,
                        }}
                    >
                        <TextField
                            className={classes.searchField}
                            size="small"
                            placeholder="Search department..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(0);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<AddRoundedIcon />}
                            onClick={openAddDialog}
                            sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                whiteSpace: "nowrap",
                                minHeight: "40px",
                            }}
                        >
                            Add Department
                        </Button>
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.headCell}>
                                    CODE
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    DEPARTMENT NAME
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    EMPLOYEES
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    EMPLOYEE DISTRIBUTION
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    STATUS
                                </TableCell>

                                <TableCell
                                    className={classes.headCell}
                                    align="center"
                                >
                                    ACTIONS
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress
                                            size={28}
                                            sx={{ my: 3 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {filteredDepartments
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((department) => {
                                            const count = Number(
                                                department.totalEmployees || 0
                                            );

                                            const progress =
                                                (count / maxEmployees) * 100;

                                            return (
                                                <TableRow
                                                    key={department.code}
                                                    hover
                                                    className={classes.tableRow}
                                                >
                                                    <TableCell>
                                                        <Chip
                                                            label={department.code}
                                                            size="small"
                                                            className={classes.codeChip}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={1.5}
                                                        >
                                                            <Avatar
                                                                className={classes.nameAvatar}
                                                            >
                                                                {department.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </Avatar>

                                                            <Typography
                                                                className={classes.departmentName}
                                                            >
                                                                {department.name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography
                                                            className={classes.employeeCount}
                                                        >
                                                            {count}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Stack
                                                            spacing={0.8}
                                                            className={classes.progressContainer}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {Math.round(progress)}%
                                                            </Typography>

                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={progress}
                                                                className={classes.progressBar}
                                                            />
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            label={
                                                                count > 0
                                                                    ? "Active"
                                                                    : "No Employees"
                                                            }
                                                            size="small"
                                                            color={
                                                                count > 0
                                                                    ? "success"
                                                                    : "default"
                                                            }
                                                            variant="outlined"
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Stack
                                                            direction="row"
                                                            spacing={0.5}
                                                            justifyContent="center"
                                                        >
                                                            <Tooltip title="Edit Department">
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        openEditDialog(
                                                                            department
                                                                        )
                                                                    }
                                                                    aria-label="Edit department"
                                                                >
                                                                    <EditRoundedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete Department">
                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        setDeleteCode(
                                                                            department.code
                                                                        )
                                                                    }
                                                                    aria-label="Delete department"
                                                                >
                                                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                    {filteredDepartments.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                align="center"
                                                className={classes.emptyMessage}
                                            >
                                                No departments found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredDepartments.length}
                    page={Math.min(
                        page,
                        Math.max(
                            0,
                            Math.ceil(filteredDepartments.length / rowsPerPage) - 1
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
            </Paper>

            {/* Add / Edit Department Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    if (!saving) {
                        setDialogOpen(false);
                        setError("");
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <Box component="form" onSubmit={handleSave}>
                    <DialogTitle>
                        {editingDepartment
                            ? "Edit Department"
                            : "Add Department"}
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                label="Department Code"
                                name="code"
                                value={formData.code}
                                onChange={handleFormChange}
                                fullWidth
                                required
                                disabled={Boolean(editingDepartment) || saving}
                                type="number"
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                }}
                            />

                            <TextField
                                label="Department Name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                fullWidth
                                required
                                disabled={saving}
                                inputProps={{
                                    maxLength: 100,
                                }}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                                setError("");
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingDepartment
                                    ? "Update"
                                    : "Add Department"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteCode !== null}
                onClose={() => {
                    if (!deleting) setDeleteCode(null);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Delete Department</DialogTitle>

                <DialogContent>
                    Are you sure you want to delete department code{" "}
                    <strong>{deleteCode}</strong>?
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setDeleteCode(null)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar
                open={Boolean(notice)}
                autoHideDuration={3000}
                onClose={() => setNotice("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={() => setNotice("")}
                    severity="success"
                    variant="filled"
                >
                    {notice}
                </Alert>
            </Snackbar>

            {/* Fetch / Delete Errors */}
            <Snackbar
                open={Boolean(error) && !dialogOpen}
                autoHideDuration={5000}
                onClose={() => setError("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={() => setError("")}
                    severity="error"
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DepartmentComponent;