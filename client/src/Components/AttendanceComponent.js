import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    CircularProgress,
    Alert,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton,
    Tooltip
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { makeStyles } from "@mui/styles";

// React proxy configured hai to relative URL use karo.

const API_URL = `${process.env.REACT_APP_API_URL}/attendance`;

const useStyles = makeStyles(() => ({
    root: {
        padding: "32px",
        minHeight: "100vh",
        background: "#f5f7fb",
        "@media (max-width:600px)": {
            padding: "16px"
        }
    },

    title: {
        fontWeight: "800 !important",
        color: "#172554",
        letterSpacing: "-0.5px"
    },

    statCard: {
        height: "100%",
        borderRadius: "16px !important",
        border: "1px solid #e8edf5",
        boxShadow: "0 4px 18px rgba(15,23,42,0.035) !important",
        transition: "transform 0.2s ease",
        "&:hover": {
            transform: "translateY(-3px)"
        }
    },

    tablePaper: {
        borderRadius: "16px !important",
        border: "1px solid #e8edf5",
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(15,23,42,0.035) !important"
    },

    toolbar: {
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        "@media (max-width:650px)": {
            flexDirection: "column",
            alignItems: "stretch"
        }
    },

    search: {
        width: "280px",
        "& .MuiOutlinedInput-root": {
            background: "#f8fafc",
            borderRadius: "10px"
        },
        "@media (max-width:650px)": {
            width: "100%"
        }
    },

    tableHead: {
        background: "#f8fafc"
    },

    headCell: {
        fontWeight: "800 !important",
        color: "#64748b !important",
        fontSize: "12px !important",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
        padding: "16px 20px !important"
    },

    bodyCell: {
        color: "#334155 !important",
        padding: "16px 20px !important",
        fontSize: "14px !important"
    },

    tableRow: {
        "&:hover": {
            background: "#f8fbff !important"
        }
    },

    empty: {
        padding: "48px !important",
        color: "#64748b !important"
    }
}));

const AttendanceComponent = () => {
    const classes = useStyles();

    const [attendance, setAttendance] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Delete confirmation dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [formData, setFormData] = useState({
        emp_id: "",
        date_of_attendance: "",
        status: "P"
    });

    // Fetch attendance records
    

    const loadAttendance = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch attendance records");
            }

            const data = await response.json();

            setAttendance(Array.isArray(data) ? data : []);
            setError("");
        } catch (err) {
            console.error("Attendance API Error:", err);
            setError("Attendance records load nahi ho paaye.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    // Local date without UTC conversion
    const getLocalDate = () => {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    };

    // Open Add dialog
    const openAddDialog = () => {
        setEditMode(false);
        setError("");
        setSuccess("");

        setFormData({
            emp_id: "",
            date_of_attendance: getLocalDate(),
            status: "P"
        });

        setOpenDialog(true);
    };

    // Open Update dialog
    const openEditDialog = (record) => {
        setEditMode(true);
        setError("");
        setSuccess("");

        setFormData({
            emp_id: record.emp_id,
            date_of_attendance: String(
                record.date_of_attendance
            ).slice(0, 10),
            status: String(record.status ?? "").toUpperCase()
        });

        setOpenDialog(true);
    };

    // Handle form changes
    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Add / Update attendance
    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const empId = Number(formData.emp_id);
        const date = formData.date_of_attendance;
        const status = formData.status;

        if (!Number.isInteger(empId) || empId <= 0) {
            setError("Valid Employee ID enter karo.");
            return;
        }

        if (!date || !["P", "A", "L"].includes(status)) {
            setError("Date aur valid attendance status select karo.");
            return;
        }

        const payload = {
            emp_id: empId,
            date_of_attendance: date,
            status
        };

        const url = editMode
            ? `${API_URL}/${empId}/${date}`
            : API_URL;

        try {
            setSaving(true);

            const response = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(
                    editMode ? { status } : payload
                )
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message || "Attendance save nahi hui."
                );
            }

            setOpenDialog(false);

            setSuccess(
                editMode
                    ? "Attendance updated successfully."
                    : "Attendance added successfully."
            );

            setPage(0);
            await loadAttendance();
        } catch (err) {
            console.error("Save Attendance Error:", err);
            setError(err.message || "Attendance save nahi hui.");
        } finally {
            setSaving(false);
        }
    };

    // Open Delete confirmation dialog
    const openDeleteDialog = (record) => {
        if (deleting) return;

        setSelectedRecord(record);
        setError("");
        setSuccess("");
        setDeleteDialogOpen(true);
    };

    // Close Delete confirmation dialog
    const closeDeleteDialog = () => {
        if (deleting) return;

        setDeleteDialogOpen(false);
        setSelectedRecord(null);
    };

    // Delete attendance after confirmation
    const handleDelete = async () => {
        // Prevent duplicate requests
        if (!selectedRecord || deleting) return;

        const date = String(
            selectedRecord.date_of_attendance
        ).slice(0, 10);

        try {
            // Spinner immediately starts
            setDeleting(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `${API_URL}/${selectedRecord.emp_id}/${date}`,
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
                    result.message || "Attendance delete nahi hui."
                );
            }

            // Close dialog after successful deletion
            setDeleteDialogOpen(false);
            setSelectedRecord(null);

            setSuccess("Attendance deleted successfully.");

            // Refresh table data
            await loadAttendance();

            // Correct page if the last row on a page was deleted
            setPage((currentPage) => {
                const remainingCount = attendance.length - 1;
                const lastPage = Math.max(
                    0,
                    Math.ceil(remainingCount / rowsPerPage) - 1
                );

                return Math.min(currentPage, lastPage);
            });
        } catch (err) {
            console.error("Delete Attendance Error:", err);
            setError(err.message || "Attendance delete nahi hui.");
        } finally {
            // Spinner stops after request completes
            setDeleting(false);
        }
    };

    // Status display
    const getStatus = (status) => {
        const value = String(status ?? "").toUpperCase();

        if (value === "P" || value === "PRESENT") {
            return { label: "Present", color: "success" };
        }

        if (value === "A" || value === "ABSENT") {
            return { label: "Absent", color: "error" };
        }

        if (value === "L" || value === "LEAVE") {
            return { label: "On Leave", color: "warning" };
        }

        return { label: value || "N/A", color: "default" };
    };

    // Format date without timezone shifting
    const formatDate = (value) => {
        if (!value) return "—";

        const dateString = String(value).slice(0, 10);
        const parts = dateString.split("-");

        if (parts.length !== 3) return dateString;

        const month = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            1
        ).toLocaleString("en-IN", {
            month: "short"
        });

        return `${parts[2]} ${month} ${parts[0]}`;
    };

    // Search
    const filteredAttendance = attendance.filter((record) =>
        Object.values(record).some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.toLowerCase())
        )
    );

    // Statistics
    const presentCount = attendance.filter((record) =>
        ["P", "PRESENT"].includes(
            String(record.status ?? "").toUpperCase()
        )
    ).length;

    const absentCount = attendance.filter((record) =>
        ["A", "ABSENT"].includes(
            String(record.status ?? "").toUpperCase()
        )
    ).length;

    const leaveCount = attendance.filter((record) =>
        ["L", "LEAVE"].includes(
            String(record.status ?? "").toUpperCase()
        )
    ).length;

    const stats = [
        {
            label: "Total Records",
            value: attendance.length,
            icon: <GroupsRoundedIcon />,
            color: "#2563eb",
            background: "#eff6ff"
        },
        {
            label: "Present",
            value: presentCount,
            icon: <CheckCircleRoundedIcon />,
            color: "#16a34a",
            background: "#f0fdf4"
        },
        {
            label: "Absent",
            value: absentCount,
            icon: <CancelRoundedIcon />,
            color: "#dc2626",
            background: "#fef2f2"
        },
        {
            label: "On Leave",
            value: leaveCount,
            icon: <EventBusyRoundedIcon />,
            color: "#d97706",
            background: "#fffbeb"
        }
    ];

    return (
        <Box className={classes.root}>
            {/* Page Header */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        width: 52,
                        height: 52,
                        bgcolor: "#dbeafe",
                        color: "#1d4ed8",
                        borderRadius: "14px"
                    }}
                >
                    <CalendarMonthRoundedIcon fontSize="large" />
                </Avatar>

                <Box>
                    <Typography variant="h4" className={classes.title}>
                        Attendance Management
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Monitor employee attendance records in one place.
                    </Typography>
                </Box>
            </Stack>

            {/* Notifications */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}

            {/* Dashboard Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Card className={classes.statCard}>
                            <CardContent sx={{ p: "22px !important" }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontWeight={600}
                                        >
                                            {stat.label}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight={800}
                                            sx={{ color: "#172554", mt: 1 }}
                                        >
                                            {loading ? "—" : stat.value}
                                        </Typography>
                                    </Box>

                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: stat.background,
                                            color: stat.color,
                                            borderRadius: "13px"
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Attendance Table */}
            <Paper elevation={0} className={classes.tablePaper}>
                <Box className={classes.toolbar}>
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ color: "#172554" }}
                        >
                            Attendance Records
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {filteredAttendance.length} records found
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        <TextField
                            className={classes.search}
                            size="small"
                            placeholder="Search employee or status..."
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
                                )
                            }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<AddRoundedIcon />}
                            onClick={openAddDialog}
                            sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 700,
                                px: 2,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Add Attendance
                        </Button>
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.headCell}>
                                    EMPLOYEE ID
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    ATTENDANCE DATE
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    STATUS
                                </TableCell>

                                <TableCell className={classes.headCell}>
                                    ACTIONS
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        className={classes.empty}
                                    >
                                        <CircularProgress size={28} />

                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Loading attendance...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredAttendance.length > 0 ? (
                                filteredAttendance
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((record, index) => {
                                        const status = getStatus(record.status);

                                        return (
                                            <TableRow
                                                key={`${record.emp_id}-${record.date_of_attendance}-${index}`}
                                                hover
                                                className={classes.tableRow}
                                            >
                                                <TableCell className={classes.bodyCell}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1.5}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 34,
                                                                height: 34,
                                                                bgcolor: "#eff6ff",
                                                                color: "#1d4ed8",
                                                                fontSize: 13,
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {String(
                                                                record.emp_id ?? "?"
                                                            ).slice(-2)}
                                                        </Avatar>

                                                        <Typography
                                                            fontWeight={700}
                                                            fontSize={14}
                                                        >
                                                            EMP-{record.emp_id}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell className={classes.bodyCell}>
                                                    {formatDate(
                                                        record.date_of_attendance
                                                    )}
                                                </TableCell>

                                                <TableCell className={classes.bodyCell}>
                                                    <Chip
                                                        label={status.label}
                                                        color={status.color}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            minWidth: 88,
                                                            borderRadius: "7px"
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell className={classes.bodyCell}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={0.5}
                                                    >
                                                        <Tooltip title="Edit attendance">
                                                            <span>
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    disabled={deleting}
                                                                    onClick={() =>
                                                                        openEditDialog(record)
                                                                    }
                                                                >
                                                                    <EditRoundedIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>

                                                        <Tooltip title="Delete attendance">
                                                            <span>
                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    disabled={deleting}
                                                                    onClick={() =>
                                                                        openDeleteDialog(record)
                                                                    }
                                                                >
                                                                    <DeleteRoundedIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        className={classes.empty}
                                    >
                                        <SearchRoundedIcon
                                            sx={{
                                                fontSize: 36,
                                                mb: 1,
                                                color: "#94a3b8"
                                            }}
                                        />

                                        <Typography fontWeight={700}>
                                            No attendance records found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Search term change karke try karo.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredAttendance.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Paper>

            {/* Add / Update Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => {
                    if (!saving) setOpenDialog(false);
                }}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={handleSave}>
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: "#172554"
                        }}
                    >
                        {editMode
                            ? "Update Attendance"
                            : "Add Attendance"}
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={2.5} sx={{ pt: 1 }}>
                            <TextField
                                label="Employee ID"
                                name="emp_id"
                                type="number"
                                value={formData.emp_id}
                                onChange={handleFormChange}
                                disabled={editMode || saving}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Attendance Date"
                                name="date_of_attendance"
                                type="date"
                                value={formData.date_of_attendance}
                                onChange={handleFormChange}
                                disabled={editMode || saving}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                select
                                label="Attendance Status"
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                disabled={saving}
                                fullWidth
                                required
                            >
                                <MenuItem value="P">Present</MenuItem>
                                <MenuItem value="A">Absent</MenuItem>
                                <MenuItem value="L">On Leave</MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => {
                                if (!saving) setOpenDialog(false);
                            }}
                            disabled={saving}
                            color="inherit"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : editMode ? (
                                    <EditRoundedIcon />
                                ) : (
                                    <AddRoundedIcon />
                                )
                            }
                        >
                            {saving
                                ? "Saving..."
                                : editMode
                                    ? "Update"
                                    : "Save"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                fullWidth
                maxWidth="xs"
                disableEscapeKeyDown={deleting}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: "#172554"
                    }}
                >
                    Delete Attendance?
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        Are you Sure  EMP-{selectedRecord?.emp_id}  attendance
                        ({String(
                            selectedRecord?.date_of_attendance ?? ""
                        ).slice(0, 10)}) you want to delete?
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "#dc2626" }}
                    >

                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        color="inherit"
                        disabled={deleting}
                        onClick={closeDeleteDialog}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        disabled={deleting || !selectedRecord}
                        onClick={handleDelete}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={17}
                                    color="inherit"
                                />
                            ) : (
                                <DeleteRoundedIcon />
                            )
                        }
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AttendanceComponent;
