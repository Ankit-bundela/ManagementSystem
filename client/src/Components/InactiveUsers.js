import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Stack,
    Chip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
} from "@mui/material";

import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

const API_URL =
    process.env.NODE_ENV === "development"
        ? ""
        : "https://employee-management-api-ikdn.onrender.com";


const InactiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch inactive users from backend
    useEffect(() => {
        const fetchInactiveUsers = async () => {
            try {
                setLoading(true);
                setError("");



                const response = await fetch(`${API_URL}/inactiveUsers`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });


                if (!response.ok) {
                    throw new Error("Failed to fetch inactive users");
                }

                const result = await response.json();

                if (result.success === false) {
                    throw new Error(
                        result.message || "Failed to fetch inactive users"
                    );
                }

                // Supports both { success, data: [] } and direct array
                const userData = Array.isArray(result)
                    ? result
                    : result.data;

                if (!Array.isArray(userData)) {
                    throw new Error("Invalid API response format");
                }

                setUsers(userData);
            } catch (err) {
                console.error("Inactive Users API Error:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchInactiveUsers();
    }, []);

    // Search by ID, name, department or contact
    const filteredUsers = users.filter((user) => {
        const firstName =
            user.firstName ?? user.first_name ?? "";

        const lastName =
            user.lastName ?? user.last_name ?? "";

        const empId =
            user.empId ?? user.emp_id ?? "";

        const department =
            user.departmentCode ??
            user.department_code ??
            "";

        const contact =
            user.contactNum ??
            user.contact_num ??
            user.ContactNum ??
            "";

        const searchableText = [
            empId,
            firstName,
            lastName,
            department,
            contact,
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(search.toLowerCase());
    });

    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    return (
        <Box
            sx={{
                bgcolor: "#F8FAFC",
                minHeight: "100vh",
                p: { xs: 2, md: 3 },
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Avatar
                        sx={{
                            bgcolor: "#FEE2E2",
                            color: "#DC2626",
                            width: 52,
                            height: 52,
                            borderRadius: 3,
                        }}
                    >
                        <PersonOffRoundedIcon />
                    </Avatar>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="#0F172A"
                        >
                            Inactive Users
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View all inactive employees in your system.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Summary Card */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    mb: 3,
                    maxWidth: 350,
                }}
            >
                <CardContent sx={{ p: 2.5 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography
                                color="text.secondary"
                                fontWeight={600}
                            >
                                Total Inactive Users
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="#0F172A"
                                sx={{ mt: 1 }}
                            >
                                {loading ? "..." : users.length}
                            </Typography>
                        </Box>

                        <Avatar
                            sx={{
                                bgcolor: "#FEE2E2",
                                color: "#DC2626",
                                borderRadius: 2,
                                width: 48,
                                height: 48,
                            }}
                        >
                            <GroupsRoundedIcon />
                        </Avatar>
                    </Stack>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <CardContent
                    sx={{
                        p: 3,
                        pb: 2,
                    }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#0F172A"
                            >
                                Inactive Employee List
                            </Typography>

                            <Typography
                                color="text.secondary"
                                variant="body2"
                                sx={{ mt: 0.5 }}
                            >
                                Employee information and status
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            placeholder="Search employees..."
                            value={search}
                            onChange={handleSearch}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 280,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    bgcolor: "#FFFFFF",
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon
                                                color="action"
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Stack>
                </CardContent>

                {error && (
                    <Box sx={{ px: 3, pb: 2 }}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Box>
                )}

                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: 850 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                                {[
                                    "Employee ID",
                                    "Employee Name",
                                    "Gender",
                                    "Date of Birth",
                                    "Department",
                                    "Contact Number",
                                    "Status",
                                ].map((heading) => (
                                    <TableCell
                                        key={heading}
                                        sx={{
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                        }}
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
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <CircularProgress size={30} />

                                        <Typography
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            Loading inactive users...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        Failed to load inactive users.
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 5 }}
                                    >
                                        <PersonOffRoundedIcon
                                            sx={{
                                                fontSize: 42,
                                                color: "#94A3B8",
                                            }}
                                        />

                                        <Typography
                                            fontWeight={600}
                                            sx={{ mt: 1 }}
                                        >
                                            {search
                                                ? "No matching users found."
                                                : "No inactive users found."}
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            {search
                                                ? "Try another search term."
                                                : "All employees are currently active."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user, index) => {
                                    const firstName =
                                        user.firstName ??
                                        user.first_name ??
                                        "";

                                    const lastName =
                                        user.lastName ??
                                        user.last_name ??
                                        "";

                                    const empId =
                                        user.empId ?? user.emp_id;

                                    const gender =
                                        user.gender ?? "-";

                                    const dob =
                                        user.dateOfBirth ??
                                        user.date_of_birth ??
                                        "-";

                                    const department =
                                        user.departmentCode ??
                                        user.department_code ??
                                        user.department_code ??
                                        "-";

                                    const contact =
                                        user.contactNum ??
                                        user.contact_num ??
                                        user.ContactNum ??
                                        "-";

                                    return (
                                        <TableRow
                                            key={empId ?? index}
                                            hover
                                        >
                                            <TableCell>
                                                <Typography fontWeight={600}>
                                                    {empId ?? "-"}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    alignItems="center"
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: "#DBEAFE",
                                                            color: "#1D4ED8",
                                                            width: 36,
                                                            height: 36,
                                                            fontSize: 14,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {firstName
                                                            .charAt(0)
                                                            .toUpperCase() || "?"}
                                                    </Avatar>

                                                    <Typography fontWeight={600}>
                                                        {`${firstName} ${lastName}`.trim() || "-"}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                {gender}
                                            </TableCell>

                                            <TableCell>
                                                {dob
                                                    ? String(dob).slice(0, 10)
                                                    : "-"}
                                            </TableCell>

                                            <TableCell>
                                                {department}
                                            </TableCell>

                                            <TableCell>
                                                {contact}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label="Inactive"
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 600,
                                                    }}
                                                />
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
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Rows per page:"
                />
            </Card>
        </Box>
    );
};

export default InactiveUsers;
