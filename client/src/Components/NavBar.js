
import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import InfoIcon from '@mui/icons-material/Info';

import { makeStyles } from "@mui/styles";
import { useNavigate, useLocation } from "react-router-dom";

// --------------------------------------------------
// Styles
// --------------------------------------------------
const myStyles = makeStyles(() => ({
  navNew: {
    backgroundColor: "#ffffff !important",
    backgroundImage: "none !important",
    color: "#334155",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.07)",
    borderBottom: "1px solid #e9edf5",
  },

  toolbar: {
    minHeight: "70px !important",
    padding: "0 28px !important",
    display: "flex",
    alignItems: "center",
  },

  menuButton: {
    color: "#475569",
    marginRight: "12px !important",
    borderRadius: "10px !important",
    "&:hover": {
      backgroundColor: "#eff6ff",
      color: "#2563eb",
    },
  },

  brandIcon: {
    width: "40px",
    height: "40px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },

  title: {
    color: "#1e3a8a",
    fontSize: "19px !important",
    fontWeight: "bold !important",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "11px !important",
    marginTop: "2px !important",
  },

  spacer: {
    flexGrow: 1,
  },

  actionButton: {
    color: "#64748b",
    marginLeft: "5px !important",
    borderRadius: "10px !important",
    "&:hover": {
      backgroundColor: "#eff6ff",
      color: "#2563eb",
    },
  },
}));

// --------------------------------------------------
// NavBar Component
// --------------------------------------------------
const NavBar = () => {
  const stylesMy = myStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);
    navigate("/login", { replace: true });
  };

  // --------------------------------------------------
  // Menu Items
  // --------------------------------------------------
  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardRoundedIcon />,
      path: "/dashboard",
    },
    {
      label: "Employees",
      icon: <GroupsRoundedIcon />,
      path: "/employee",
    },
    {
      label: "Activity of user",
      icon: <NoAccountsIcon />,
      path: "/inactiveUsers",
    },
    {
      label: "Departments",
      icon: <ApartmentRoundedIcon />,
      path: "/departments",
    },
    {
      label: "Attendance",
      icon: <CalendarMonthRoundedIcon />,
      path: "/attendance",
    },
    {
      label: "Payroll",
      icon: <CalendarMonthRoundedIcon />,
      path: "/salary",
    },
    {
      label: "Address",
      icon: <LocationSearchingIcon />,
      path: "/address",
    },
    {
      label: "About",
      icon: <InfoIcon/>,
      path: "/about",
    },
  ];

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------
  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className={stylesMy.navNew}
      >
        <Toolbar className={stylesMy.toolbar}>
          <Tooltip title="Open menu">
            <IconButton
              className={stylesMy.menuButton}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Tooltip>

          <Box className={stylesMy.brandIcon}>
            <BusinessRoundedIcon />
          </Box>

          <Box>
            <Typography className={stylesMy.title}>
              Employee Manage
            </Typography>

            <Typography className={stylesMy.subtitle}>
              Employee Management System
            </Typography>
          </Box>

          <Box className={stylesMy.spacer} />

          <Tooltip title="Search">
            <IconButton
              className={stylesMy.actionButton}
              aria-label="Search"
            >
              <SearchRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton
              className={stylesMy.actionButton}
              aria-label="Notifications"
            >
              <NotificationsNoneRoundedIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              my: 2,
              borderColor: "#e2e8f0",
            }}
          />

          <Tooltip title="Profile">
            <IconButton
              className={stylesMy.actionButton}
              aria-label="Profile"
            >
              <AccountCircleRoundedIcon
                sx={{
                  fontSize: 31,
                  color: "#2563eb",
                }}
              />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            borderRadius: "0 14px 14px 0",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2.5,
          }}
        >
          <BusinessRoundedIcon
            sx={{
              color: "#2563eb",
              mr: 1,
            }}
          />

          <Typography
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            Thinking Machines
          </Typography>

          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Main Menu Heading */}
        <Typography
          sx={{
            px: 2.5,
            pt: 3,
            pb: 1,
            color: "#94a3b8",
            fontSize: 11,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          MAIN MENU
        </Typography>

        {/* Navigation Items */}
        <List sx={{ px: 1.5, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const selected =
              location.pathname.toLowerCase() ===
              item.path.toLowerCase();

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: "9px",
                    mb: 0.5,
                    py: 1.2,

                    "&.Mui-selected": {
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#dbeafe",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: selected ? "#2563eb" : "#64748b",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: selected ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Logout Section */}
        <Divider />

        <List sx={{ px: 1.5, py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "9px",
                py: 1.2,
                color: "#dc2626",

                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "#dc2626",
                }}
              >
                <LogoutRoundedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;