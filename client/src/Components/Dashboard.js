
import React from "react";
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
    LinearProgress,
    TablePagination,
} from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailable";
import ApartmentRoundedIcon from "@mui/icons-material/Apartment";

// ================= API FUNCTIONS =================

//const API_URL = "http://localhost:5050";
const API_URL = process.env.REACT_APP_API_URL;

const fetchAPI = async (endpoint) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        throw new Error(
            `API failed: ${endpoint}, Status: ${response.status}`
        );
    }

    return response.json();
};

const getEmployees = () => fetchAPI("/employees");

const getDepartments = () => fetchAPI("/departments");

const getTodayAttendance = () => fetchAPI("/attendance/today");

const getDepartmentCounts = () =>
    fetchAPI("/dashboard/department-counts");

// ================= DASHBOARD =================

const Dashboard = () => {
    const [employees, setEmployees] = React.useState([]);
    const [departments, setDepartments] = React.useState([]);
    const [departmentCounts, setDepartmentCounts] = React.useState([]);

    const [attendance, setAttendance] = React.useState({
        totalEmployees: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLeave: 0,
    });

    const [loadingEmployees, setLoadingEmployees] =
        React.useState(true);
    const [loadingDepartments, setLoadingDepartments] =
        React.useState(true);
    const [loadingAttendance, setLoadingAttendance] =
        React.useState(true);

    const [employeeError, setEmployeeError] = React.useState("");
    const [departmentError, setDepartmentError] = React.useState("");
    const [attendanceError, setAttendanceError] = React.useState("");

    // ================= PAGINATION =================

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ================= FETCH EMPLOYEES =================

    React.useEffect(() => {
        getEmployees()
            .then((data) => {
                setEmployees(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Employee API error:", error);
                setEmployeeError("Failed to fetch employees");
            })
            .finally(() => {
                setLoadingEmployees(false);
            });
    }, []);

    // ================= FETCH DEPARTMENTS =================

    React.useEffect(() => {
        getDepartments()
            .then((data) => {
                setDepartments(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Department API error:", error);
                setDepartmentError("Failed to fetch departments");
            })
            .finally(() => {
                setLoadingDepartments(false);
            });
    }, []);

    // ================= FETCH TODAY'S ATTENDANCE =================

    React.useEffect(() => {
        getTodayAttendance()
            .then((data) => {
                setAttendance({
                    totalEmployees: Number(data.totalEmployees) || 0,
                    totalPresent: Number(data.totalPresent) || 0,
                    totalAbsent: Number(data.totalAbsent) || 0,
                    totalLeave: Number(data.totalLeave) || 0,
                });
            })
            .catch((error) => {
                console.error("Attendance API error:", error);
                setAttendanceError("Failed to fetch attendance");
            })
            .finally(() => {
                setLoadingAttendance(false);
            });
    }, []);

    // ================= FETCH DEPARTMENT COUNTS =================

    React.useEffect(() => {
        getDepartmentCounts()
            .then((data) => {
                setDepartmentCounts(
                    Array.isArray(data) ? data : []
                );
            })
            .catch((error) => {
                console.error(
                    "Department counts API error:",
                    error
                );
            });
    }, []);

    // ================= PAGINATED EMPLOYEES =================

    const paginatedEmployees = employees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // ================= SUMMARY CARDS =================

    const stats = [
        {
            title: "Total Employees",
            value: loadingEmployees ? "..." : employees.length,
            subtitle: "Across all departments",
            icon: <GroupsRoundedIcon />,
            color: "#2563EB",
            bg: "#DBEAFE",
        },
        {
            title: "Present Today",
            value: loadingAttendance
                ? "..."
                : attendance.totalPresent,
            subtitle: "Today's attendance",
            icon: <EventAvailableRoundedIcon />,
            color: "#059669",
            bg: "#D1FAE5",
        },
        {
            title: "On Leave",
            value: loadingAttendance
                ? "..."
                : attendance.totalLeave,
            subtitle: "Employees on leave today",
            icon: <PersonAddAlt1RoundedIcon />,
            color: "#D97706",
            bg: "#FEF3C7",
        },
        {
            title: "Departments",
            value: loadingDepartments
                ? "..."
                : departments.length,
            subtitle: "Departments in database",
            icon: <ApartmentRoundedIcon />,
            color: "#7C3AED",
            bg: "#EDE9FE",
        },
    ];

    // ================= DEPARTMENT GRAPH DATA =================

    const colors = [
        "#2563EB",
        "#059669",
        "#D97706",
        "#7C3AED",
        "#DB2777",
        "#0891B2",
    ];

    const maxDepartmentEmployees = Math.max(
        1,
        ...departmentCounts.map(
            (dept) => Number(dept.totalEmployees) || 0
        )
    );

    // ================= ATTENDANCE GRAPH DATA =================

    const present = Number(attendance.totalPresent) || 0;
    const absent = Number(attendance.totalAbsent) || 0;
    const leave = Number(attendance.totalLeave) || 0;

    // Total employees whose attendance has been recorded
    const attendanceTotal = present + absent + leave;

    const presentAngle = attendanceTotal
        ? (present / attendanceTotal) * 360
        : 0;

    const absentAngle = attendanceTotal
        ? (absent / attendanceTotal) * 360
        : 0;

    const absentEnd = presentAngle + absentAngle;

    const attendanceChart = attendanceTotal
        ? `conic-gradient(
            #10B981 0deg ${presentAngle}deg,
            #EF4444 ${presentAngle}deg ${absentEnd}deg,
            #F59E0B ${absentEnd}deg 360deg
        )`
        : "#E2E8F0";

    // ================= UI =================

    return (
        <Box
            sx={{
                bgcolor: "#F8FAFC",
                minHeight: "100vh",
                p: { xs: 2, md: 3 },
            }}
        >
            {/* Dashboard Header */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#0F172A"
                >
                    Dashboard
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Welcome back! Here is your employee overview.
                </Typography>
            </Box>

            {/* Summary Cards */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {stats.map((item) => (
                    <Card
                        key={item.title}
                        elevation={0}
                        sx={{
                            border: "1px solid #E2E8F0",
                            borderRadius: 3,
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow:
                                    "0 8px 24px rgba(15,23,42,0.08)",
                            },
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
                                >
                                    {item.title}
                                </Typography>

                                <Avatar
                                    sx={{
                                        bgcolor: item.bg,
                                        color: item.color,
                                        borderRadius: 2,
                                    }}
                                >
                                    {item.icon}
                                </Avatar>
                            </Stack>

                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="#0F172A"
                                sx={{ mt: 2, mb: 0.5 }}
                            >
                                {item.value}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {item.subtitle}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Attendance and Department Overview */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1.2fr 1fr",
                    },
                    gap: 2,
                    mb: 3,
                    alignItems: "stretch",
                }}
            >
                {/* TODAY'S ATTENDANCE WITH DOUGHNUT GRAPH */}

                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #E2E8F0",
                        borderRadius: 3,
                        height: "100%",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#0F172A"
                        >
                            Today's Attendance
                        </Typography>

                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{ mt: 0.5 }}
                        >
                            Employee attendance summary
                        </Typography>

                        {loadingAttendance ? (
                            <Typography sx={{ mt: 3 }}>
                                Loading attendance...
                            </Typography>
                        ) : attendanceError ? (
                            <Typography
                                color="error"
                                sx={{ mt: 3 }}
                            >
                                {attendanceError}
                            </Typography>
                        ) : (
                            <>
                                {/* Doughnut Graph */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mt: 3,
                                        mb: 3,
                                    }}
                                >
                                    <Box
                                        role="img"
                                        aria-label={`Attendance graph: ${present} present, ${absent} absent, ${leave} on leave`}
                                        sx={{
                                            width: 210,
                                            height: 210,
                                            maxWidth: "100%",
                                            flexShrink: 0,
                                            borderRadius: "50%",
                                            background: attendanceChart,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* Inner Circle */}

                                        <Box
                                            sx={{
                                                width: "65%",
                                                height: "65%",
                                                borderRadius: "50%",
                                                bgcolor: "#FFFFFF",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow:
                                                    "0 2px 12px rgba(15,23,42,0.06)",
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                fontWeight={800}
                                                color="#0F172A"
                                            >
                                                {attendanceTotal}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Recorded
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Graph Legend and Percentages */}

                                <Stack spacing={2}>
                                    {[
                                        {
                                            label: "Present",
                                            count: present,
                                            color: "#10B981",
                                        },
                                        {
                                            label: "Absent",
                                            count: absent,
                                            color: "#EF4444",
                                        },
                                        {
                                            label: "On Leave",
                                            count: leave,
                                            color: "#F59E0B",
                                        },
                                    ].map((item) => (
                                        <Stack
                                            key={item.label}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        bgcolor: item.color,
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    color="#334155"
                                                >
                                                    {item.label}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1.5}
                                            >
                                                <Typography
                                                    fontWeight={700}
                                                    color="#0F172A"
                                                >
                                                    {item.count}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        minWidth: 45,
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    {attendanceTotal
                                                        ? `${(
                                                            (item.count /
                                                                attendanceTotal) *
                                                            100
                                                        ).toFixed(1)}%`
                                                        : "0.0%"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>

                                {attendanceTotal === 0 && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        textAlign="center"
                                        sx={{ mt: 2 }}
                                    >
                                        No attendance recorded for today.
                                    </Typography>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* DEPARTMENT OVERVIEW */}

                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #E2E8F0",
                        borderRadius: 3,
                        height: "100%",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#0F172A"
                        >
                            Department Overview
                        </Typography>

                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{ mt: 0.5 }}
                        >
                            Employee distribution by department
                        </Typography>

                        {loadingDepartments ? (
                            <Typography
                                sx={{ mt: 3 }}
                                color="text.secondary"
                            >
                                Loading departments...
                            </Typography>
                        ) : departmentError ? (
                            <Typography
                                color="error"
                                sx={{ mt: 3 }}
                            >
                                {departmentError}
                            </Typography>
                        ) : departmentCounts.length === 0 ? (
                            <Typography
                                sx={{ mt: 3 }}
                                color="text.secondary"
                            >
                                No department employee counts found.
                            </Typography>
                        ) : (
                            departmentCounts.map((dept, index) => {
                                const count =
                                    Number(dept.totalEmployees) || 0;

                                const percentage =
                                    (count / maxDepartmentEmployees) * 100;

                                return (
                                    <Box
                                        key={dept.code ?? index}
                                        sx={{ mt: 2.5 }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            spacing={1}
                                            sx={{ mb: 0.8 }}
                                        >
                                            <Typography
                                                fontWeight={600}
                                                sx={{
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {dept.name}
                                            </Typography>

                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                                sx={{ flexShrink: 0 }}
                                            >
                                                {count} employees
                                            </Typography>
                                        </Stack>

                                        <LinearProgress
                                            variant="determinate"
                                            value={percentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: 5,
                                                bgcolor: "#E2E8F0",
                                                "& .MuiLinearProgress-bar": {
                                                    bgcolor:
                                                        colors[
                                                            index %
                                                                colors.length
                                                        ],
                                                    borderRadius: 5,
                                                },
                                            }}
                                        />
                                    </Box>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </Box>

            {/* RECENT EMPLOYEES TABLE */}

            <Card
                elevation={0}
                sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <CardContent sx={{ p: 3, pb: 1 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#0F172A"
                    >
                        Recent Employees
                    </Typography>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mt: 0.5 }}
                    >
                        Employees in your system
                    </Typography>
                </CardContent>

                <Box sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Employee ID
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Employee Name
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Department
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Date of Birth
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loadingEmployees ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                    >
                                        Loading employees...
                                    </TableCell>
                                </TableRow>
                            ) : employeeError ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ color: "error.main" }}
                                    >
                                        {employeeError}
                                    </TableCell>
                                </TableRow>
                            ) : employees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                    >
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedEmployees.map((emp, index) => (
                                    <TableRow
                                        key={
                                            emp.empId ??
                                            emp.emp_id ??
                                            index
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {emp.empId ?? emp.emp_id}
                                        </TableCell>

                                        <TableCell>
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "#CCFBF1",
                                                        color: "#0F766E",
                                                        width: 36,
                                                        height: 36,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {(
                                                        emp.firstName ??
                                                        emp.first_name ??
                                                        "?"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>

                                                <Typography fontWeight={600}>
                                                    {emp.firstName ??
                                                        emp.first_name}{" "}
                                                    {emp.lastName ??
                                                        emp.last_name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            {emp.departmentCode ??
                                                emp.department_code ??
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {emp.dateOfBirth ??
                                                emp.date_of_birth ??
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label="Active"
                                                color="success"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={employees.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={
                            handleChangeRowsPerPage
                        }
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Rows per page:"
                    />
                </Box>
            </Card>
        </Box>
    );
};

export default Dashboard;