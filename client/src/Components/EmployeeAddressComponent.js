
import React, { useEffect, useMemo, useState } from "react";

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
    Snackbar,
    Alert,
    Grid,
    Divider,
    IconButton,
    Tooltip,
    MenuItem,
    Autocomplete
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import PinDropRoundedIcon from "@mui/icons-material/PinDropRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const API_URL = "/addresses";
const EMPLOYEE_API = "/employees";
const LOCATION_API = "/locations";

const emptyForm = {
    emp_id: "",
    line_1: "",
    line_2: "",
    line_3: "",
    country_code: "",
    state_code: "",
    city_code: "",
    pin_code: ""
};

const readList = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const EmployeeAddressComponent = () => {
    const [addresses, setAddresses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [employeeLoading, setEmployeeLoading] = useState(false);
    const [countryLoading, setCountryLoading] = useState(false);
    const [stateLoading, setStateLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);

    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showMessage = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Common API helper
    
const fetchData = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed (${response.status})`
        );
    }

    return data;
};

    // READ: Fetch all addresses
    const loadAddresses = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchData(API_URL);
            setAddresses(readList(data, "addresses"));
        } catch (err) {
            console.error("Load addresses:", err);
            setError(err.message || "Addresses could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    // Load employees and countries
    const loadDropdownData = async () => {
        setEmployeeLoading(true);
        setCountryLoading(true);

        try {
            const [employeeData, countryData] = await Promise.all([
                fetchData(EMPLOYEE_API),
                fetchData(`${LOCATION_API}/countries`)
            ]);

            setEmployees(readList(employeeData, "employees"));
            setCountries(readList(countryData, "countries"));
        } catch (err) {
            console.error("Load dropdown data:", err);
            showMessage(
                `Dropdown data could not be loaded: ${err.message}`,
                "error"
            );
        } finally {
            setEmployeeLoading(false);
            setCountryLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
        loadDropdownData();
    }, []);

    // Load states by country
    const loadStates = async (countryCode) => {
        if (countryCode === "" || countryCode == null) {
            setStates([]);
            return [];
        }

        setStateLoading(true);

        try {
            const data = await fetchData(
                `${LOCATION_API}/states?country_code=${encodeURIComponent(
                    countryCode
                )}`
            );

            const stateList = readList(data, "states");
            setStates(stateList);
            return stateList;
        } catch (err) {
            console.error("Load states:", err);
            setStates([]);
            showMessage(err.message || "States could not be loaded.", "error");
            return [];
        } finally {
            setStateLoading(false);
        }
    };

    // Load cities by state
    const loadCities = async (stateCode) => {
        if (stateCode === "" || stateCode == null) {
            setCities([]);
            return [];
        }

        setCityLoading(true);

        try {
            const data = await fetchData(
                `${LOCATION_API}/cities?state_code=${encodeURIComponent(
                    stateCode
                )}`
            );

            const cityList = readList(data, "cities");
            setCities(cityList);
            return cityList;
        } catch (err) {
            console.error("Load cities:", err);
            setCities([]);
            showMessage(err.message || "Cities could not be loaded.", "error");
            return [];
        } finally {
            setCityLoading(false);
        }
    };

    // Country selection
    const handleCountryChange = async (countryCode) => {
        setForm((previous) => ({
            ...previous,
            country_code: countryCode,
            state_code: "",
            city_code: ""
        }));

        setStates([]);
        setCities([]);

        if (countryCode === "" || countryCode == null) return;

        await loadStates(countryCode);
    };

    // State selection
    const handleStateChange = async (stateCode) => {
        setForm((previous) => ({
            ...previous,
            state_code: stateCode,
            city_code: ""
        }));

        setCities([]);

        if (stateCode === "" || stateCode == null) return;

        await loadCities(stateCode);
    };

    // Helpers
    const getFullName = (address) =>
        `${address?.first_name || ""} ${address?.last_name || ""}`.trim();

    const getCompleteAddress = (address) =>
        [
            address?.line_1,
            address?.line_2,
            address?.line_3
        ]
            .filter(Boolean)
            .join(", ");

    // Search addresses
    const filteredAddresses = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) return addresses;

        return addresses.filter((address) => {
            const fullName = getFullName(address);
            const completeAddress = getCompleteAddress(address);

            return [
                address.emp_id,
                fullName,
                completeAddress,
                address.city_name,
                address.state_name,
                address.country_name,
                address.pin_code
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(search)
            );
        });
    }, [addresses, searchText]);

    // Summary counts
    const uniqueCities = useMemo(
        () =>
            new Set(
                addresses.map((address) => address.city_name).filter(Boolean)
            ).size,
        [addresses]
    );

    const uniqueCountries = useMemo(
        () =>
            new Set(
                addresses
                    .map((address) => address.country_name)
                    .filter(Boolean)
            ).size,
        [addresses]
    );

    // Reset form
    const resetForm = () => {
        setForm({ ...emptyForm });
        setStates([]);
        setCities([]);
    };

    // Open add dialog
    const openAddForm = () => {
        setEditMode(false);
        resetForm();
        setFormOpen(true);
    };

    // Open edit dialog and load existing location options
    const openEditForm = async (address) => {
        setEditMode(true);
        setStates([]);
        setCities([]);

        setForm({
            emp_id: address.emp_id ?? "",
            line_1: address.line_1 ?? "",
            line_2: address.line_2 ?? "",
            line_3: address.line_3 ?? "",
            country_code: address.country_code ?? "",
            state_code: address.state_code ?? "",
            city_code: address.city_code ?? "",
            pin_code: address.pin_code ?? ""
        });

        setFormOpen(true);

        try {
            if (address.country_code != null) {
                const stateList = await loadStates(address.country_code);

                if (address.state_code != null) {
                    const matchingState = stateList.find(
                        (item) =>
                            String(item.code) === String(address.state_code)
                    );

                    if (matchingState) {
                        const cityList = await loadCities(address.state_code);

                        const matchingCity = cityList.find(
                            (item) =>
                                String(item.code) === String(address.city_code)
                        );

                        if (!matchingCity) {
                            setForm((previous) => ({
                                ...previous,
                                city_code: ""
                            }));
                        }
                    } else {
                        setForm((previous) => ({
                            ...previous,
                            state_code: "",
                            city_code: ""
                        }));
                        setCities([]);
                    }
                }
            }
        } catch (err) {
            console.error("Load edit location:", err);
        }
    };

    // Close add/edit dialog
    const closeForm = () => {
        if (saving) return;

        setFormOpen(false);
        resetForm();
    };

    // Handle text field changes
    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // CREATE / UPDATE
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!editMode && !String(form.emp_id).trim()) {
            showMessage("Please select an employee.", "warning");
            return;
        }

        if (!String(form.line_1).trim()) {
            showMessage("Address Line 1 is required.", "warning");
            return;
        }

        if (
            form.country_code === "" ||
            form.state_code === "" ||
            form.city_code === ""
        ) {
            showMessage(
                "Please select Country, State and City.",
                "warning"
            );
            return;
        }

        if (!String(form.pin_code).trim()) {
            showMessage("PIN Code is required.", "warning");
            return;
        }

        const payload = {
            line_1: form.line_1.trim(),
            line_2: form.line_2.trim() || null,
            line_3: form.line_3.trim() || null,
            city_code: Number(form.city_code),
            pin_code: String(form.pin_code).trim()
        };

        if (!editMode) {
            payload.emp_id = Number(form.emp_id);
        }

        try {
            setSaving(true);

            const url = editMode
                ? `${API_URL}/${encodeURIComponent(form.emp_id)}`
                : API_URL;

            const data = await fetchData(url, {
                method: editMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            setFormOpen(false);
            resetForm();

            showMessage(
                data.message ||
                (editMode
                    ? "Address updated successfully."
                    : "Address created successfully.")
            );

            setPage(0);
            await loadAddresses();
        } catch (err) {
            console.error("Save address:", err);
            showMessage(err.message || "Could not save address.", "error");
        } finally {
            setSaving(false);
        }
    };

    // DELETE
    const handleDelete = async (address) => {
        const confirmed = window.confirm(
            `Delete address for ${getFullName(address) || "this employee"} (Employee ID: ${address.emp_id})?`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            const data = await fetchData(
                `${API_URL}/${encodeURIComponent(address.emp_id)}`,
                { method: "DELETE" }
            );

            if (
                String(selectedAddress?.emp_id) === String(address.emp_id)
            ) {
                setDetailsOpen(false);
                setSelectedAddress(null);
            }

            showMessage(data.message || "Address deleted successfully.");
            await loadAddresses();
        } catch (err) {
            console.error("Delete address:", err);
            showMessage(err.message || "Delete failed.", "error");
        } finally {
            setDeleting(false);
        }
    };

    // Pagination
    const paginatedAddresses = useMemo(() => {
        return filteredAddresses.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [filteredAddresses, page, rowsPerPage]);
    

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedAddress(null);
    };


    return (
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                bgcolor: "#f7f8fc",
                minHeight: "100vh"
            }}
        >
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            color: "#172554",
                            fontSize: { xs: 25, md: 30 }
                        }}
                    >
                        Employee Addresses
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Create, view, update and delete employee addresses
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<RefreshRoundedIcon />}
                        onClick={() => {
                            loadAddresses();
                            loadDropdownData();
                        }}
                        disabled={
                            loading || employeeLoading || countryLoading
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform: "none"
                        }}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={openAddForm}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none"
                        }}
                    >
                        Add Address
                    </Button>
                </Stack>
            </Stack>

            {/* Summary cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {[
                    {
                        title: "Total Address Records",
                        value: addresses.length,
                        icon: <GroupsRoundedIcon />,
                        bg: "#e8edff",
                        color: "#3f51b5"
                    },
                    {
                        title: "Cities Covered",
                        value: uniqueCities,
                        icon: <LocationOnRoundedIcon />,
                        bg: "#e0f7f1",
                        color: "#00866a"
                    },
                    {
                        title: "Countries Covered",
                        value: uniqueCountries,
                        icon: <PublicRoundedIcon />,
                        bg: "#fff0df",
                        color: "#c56a0a"
                    }
                ].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.title}>
                        <Card
                            elevation={0}
                            sx={{
                                border: "1px solid #e8eaf2",
                                borderRadius: 3,
                                height: "100%"
                            }}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: item.bg,
                                            color: item.color,
                                            width: 52,
                                            height: 52
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>

                                    <Box>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight={800}
                                        >
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Address directory */}
            <Card
                elevation={0}
                sx={{
                    border: "1px solid #e8eaf2",
                    borderRadius: 3,
                    overflow: "hidden"
                }}
            >
                <Box sx={{ p: 2.5 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight={750}>
                                Address Directory
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Search and manage employee locations
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            placeholder="Search name, city, PIN..."
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value);
                                setPage(0);
                            }}
                            sx={{
                                width: { xs: "100%", sm: 300 },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    bgcolor: "#fff"
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
                    </Stack>
                </Box>

                <Divider />

                {loading ? (
                    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                        <CircularProgress />
                        <Typography color="text.secondary">
                            Loading addresses...
                        </Typography>
                    </Stack>
                ) : error ? (
                    <Stack
                        alignItems="center"
                        spacing={2}
                        sx={{ py: 6, px: 2 }}
                    >
                        <Typography color="error" textAlign="center">
                            {error}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={loadAddresses}
                        >
                            Try Again
                        </Button>
                    </Stack>
                ) : (
                    <>
                        <TableContainer sx={{ overflowX: "auto" }}>
                            <Table sx={{ minWidth: 1050 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f8faff" }}>
                                        {[
                                            "Employee",
                                            "Address",
                                            "City / State",
                                            "Country",
                                            "PIN Code",
                                            "Actions"
                                        ].map((title) => (
                                            <TableCell
                                                key={title}
                                                align={
                                                    title === "Actions"
                                                        ? "center"
                                                        : "left"
                                                }
                                                sx={{ fontWeight: 750 }}
                                            >
                                                {title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedAddresses.map((address) => (
                                        <TableRow
                                            key={address.emp_id}
                                            hover
                                        >
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={1.5}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: "#e8edff",
                                                            color: "#3549a4",
                                                            width: 38,
                                                            height: 38,
                                                            fontSize: 14,
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {`${address.first_name?.[0] || ""}${address.last_name?.[0] || ""}`}
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            fontWeight={650}
                                                            variant="body2"
                                                        >
                                                            {getFullName(address) ||
                                                                "Unknown"}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            ID: {address.emp_id}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            <TableCell sx={{ maxWidth: 260 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="flex-start"
                                                >
                                                    <HomeWorkRoundedIcon
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#64748b"
                                                        }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            overflowWrap:
                                                                "anywhere"
                                                        }}
                                                    >
                                                        {getCompleteAddress(
                                                            address
                                                        ) || "—"}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                >
                                                    {address.city_name || "—"}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {address.state_name || "—"}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        address.country_name ||
                                                        "Unknown"
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 1.5 }}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={0.75}
                                                    alignItems="center"
                                                >
                                                    <PinDropRoundedIcon
                                                        sx={{
                                                            fontSize: 18,
                                                            color: "#64748b"
                                                        }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                    >
                                                        {address.pin_code || "—"}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Stack
                                                    direction="row"
                                                    spacing={0.25}
                                                    justifyContent="center"
                                                >
                                                    <Tooltip title="View details">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedAddress(
                                                                    address
                                                                );
                                                                setDetailsOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <VisibilityRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Edit address">
                                                        <IconButton
                                                            color="success"
                                                            size="small"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    address
                                                                )
                                                            }
                                                        >
                                                            <EditRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Delete address">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            disabled={deleting}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    address
                                                                )
                                                            }
                                                        >
                                                            <DeleteRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {filteredAddresses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Stack
                                                    alignItems="center"
                                                    spacing={1}
                                                    sx={{ py: 6 }}
                                                >
                                                    <LocationOnRoundedIcon
                                                        sx={{
                                                            fontSize: 42,
                                                            color: "#94a3b8"
                                                        }}
                                                    />

                                                    <Typography fontWeight={650}>
                                                        No addresses found
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Add an address or try
                                                        another search.
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider />

                        <TablePagination
                            component="div"
                            count={filteredAddresses.length}
                            page={Math.min(
                                page,
                                Math.max(
                                    0,
                                    Math.ceil(
                                        filteredAddresses.length / rowsPerPage
                                    ) - 1
                                )
                            )}
                            onPageChange={(event, newPage) =>
                                setPage(newPage)
                            }
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(Number(event.target.value));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage="Rows:"
                        />
                    </>
                )}
            </Card>

            {/* Add / Edit dialog */}
            <Dialog
                open={formOpen}
                onClose={closeForm}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: "#e8edff",
                                    color: "#3549a4"
                                }}
                            >
                                {editMode ? (
                                    <EditRoundedIcon />
                                ) : (
                                    <AddRoundedIcon />
                                )}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={750}>
                                    {editMode
                                        ? "Edit Address"
                                        : "Add Employee Address"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {editMode
                                        ? "Update address information"
                                        : "Enter the employee's address details"}
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={closeForm}
                                disabled={saving}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>

                    <Divider />

                    <DialogContent sx={{ pt: 3 }}>
                        <Stack spacing={2.5}>
                            {/* Employee Autocomplete - fixed */}

                            <Autocomplete
                                options={employees}
                                value={
                                    employees.find(
                                        (employee) =>
                                            String(employee.empId) === String(form.emp_id)
                                    ) || null
                                }
                                getOptionLabel={(employee) =>
                                    employee
                                        ? `${employee.empId} - ${employee.firstName || ""} ${employee.lastName || ""}`.trim()
                                        : ""
                                }
                                isOptionEqualToValue={(option, value) =>
                                    String(option.empId) === String(value.empId)
                                }
                                onChange={(event, employee) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        emp_id: employee ? employee.empId : "",
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Employee"
                                        placeholder="Search by employee ID or name"
                                        fullWidth
                                    />
                                )}
                            />

                            <TextField
                                label="Address Line 1"
                                name="line_1"
                                value={form.line_1}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                disabled={saving}
                            />

                            <TextField
                                label="Address Line 2"
                                name="line_2"
                                value={form.line_2}
                                onChange={handleFormChange}
                                fullWidth
                                disabled={saving}
                            />

                            <TextField
                                label="Address Line 3"
                                name="line_3"
                                value={form.line_3}
                                onChange={handleFormChange}
                                fullWidth
                                disabled={saving}
                            />

                            {/* Country */}
                            <TextField
                                select
                                label="Country"
                                value={form.country_code ?? ""}
                                onChange={(event) =>
                                    handleCountryChange(event.target.value)
                                }
                                fullWidth
                                required
                                disabled={saving || countryLoading}
                                helperText="Select a country"
                            >
                                {countryLoading ? (
                                    <MenuItem disabled value="">
                                        Loading countries...
                                    </MenuItem>
                                ) : countries.length === 0 ? (
                                    <MenuItem disabled value="">
                                        No countries available
                                    </MenuItem>
                                ) : (
                                    countries.map((country) => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>

                            {/* State */}
                            <TextField
                                select
                                label="State"
                                value={form.state_code ?? ""}
                                onChange={(event) =>
                                    handleStateChange(event.target.value)
                                }
                                fullWidth
                                required
                                disabled={
                                    saving ||
                                    !form.country_code ||
                                    stateLoading
                                }
                                helperText={
                                    !form.country_code
                                        ? "First select a country"
                                        : "Select a state"
                                }
                            >
                                {stateLoading ? (
                                    <MenuItem disabled value="">
                                        Loading states...
                                    </MenuItem>
                                ) : states.length === 0 ? (
                                    <MenuItem disabled value="">
                                        No states available
                                    </MenuItem>
                                ) : (
                                    states.map((state) => (
                                        <MenuItem
                                            key={state.code}
                                            value={state.code}
                                        >
                                            {state.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>

                            {/* City */}
                            <TextField
                                select
                                label="City"
                                name="city_code"
                                value={form.city_code ?? ""}
                                onChange={handleFormChange}
                                fullWidth
                                required
                                disabled={
                                    saving ||
                                    !form.state_code ||
                                    cityLoading
                                }
                                helperText={
                                    !form.state_code
                                        ? "First select a state"
                                        : "Select a city"
                                }
                            >
                                {cityLoading ? (
                                    <MenuItem disabled value="">
                                        Loading cities...
                                    </MenuItem>
                                ) : cities.length === 0 ? (
                                    <MenuItem disabled value="">
                                        No cities available
                                    </MenuItem>
                                ) : (
                                    cities.map((city) => (
                                        <MenuItem
                                            key={city.code}
                                            value={city.code}
                                        >
                                            {city.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>

                            <TextField
                                label="PIN Code"
                                name="pin_code"
                                value={form.pin_code}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                disabled={saving}
                                inputProps={{ maxLength: 10 }}
                            />
                        </Stack>
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            onClick={closeForm}
                            disabled={saving}
                            sx={{ textTransform: "none" }}
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
                                        size={18}
                                        color="inherit"
                                    />
                                ) : editMode ? (
                                    <EditRoundedIcon />
                                ) : (
                                    <AddRoundedIcon />
                                )
                            }
                            sx={{
                                borderRadius: 2,
                                textTransform: "none"
                            }}
                        >
                            {saving
                                ? "Saving..."
                                : editMode
                                    ? "Update Address"
                                    : "Create Address"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* View address details */}
            <Dialog
                open={detailsOpen}
                onClose={closeDetails}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "#e8edff",
                                color: "#3549a4"
                            }}
                        >
                            <LocationOnRoundedIcon />
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={750}>
                                Address Details
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Complete employee location
                            </Typography>
                        </Box>

                        <IconButton onClick={closeDetails} size="small">
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    {selectedAddress && (
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    EMPLOYEE
                                </Typography>

                                <Typography fontWeight={700}>
                                    {getFullName(selectedAddress) || "Unknown"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Employee ID: {selectedAddress.emp_id}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    ADDRESS
                                </Typography>

                                <Typography sx={{ mt: 0.5 }}>
                                    {getCompleteAddress(selectedAddress) ||
                                        "—"}
                                </Typography>
                            </Box>

                            <Divider />

                            <Grid container spacing={2}>
                                {[
                                    ["City", selectedAddress.city_name],
                                    ["State", selectedAddress.state_name],
                                    ["Country", selectedAddress.country_name],
                                    ["PIN Code", selectedAddress.pin_code]
                                ].map(([label, value]) => (
                                    <Grid item xs={12} sm={6} key={label}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {label.toUpperCase()}
                                        </Typography>

                                        <Typography fontWeight={600}>
                                            {value || "—"}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        onClick={closeDetails}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: "none"
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployeeAddressComponent;