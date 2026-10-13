
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Collapse,
  Divider,
} from "@mui/material";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const useStyles = makeStyles(() => ({
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "28px 0",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    background: "linear-gradient(125deg, #10275e, #1d4ed8 65%, #60a5fa)",
    padding: "34px",
    color: "#fff",
    marginBottom: "28px",
    boxShadow: "0 16px 35px rgba(37,99,235,.16)",
    "@media(max-width:600px)": {
      padding: "22px",
    },
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 12px",
    borderRadius: 30,
    background: "rgba(255,255,255,.12)",
    border: "1px solid rgba(255,255,255,.2)",
    color: "#dbeafe",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.7,
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: "clamp(28px, 3vw, 42px) !important",
    fontWeight: "800 !important",
    letterSpacing: "-1px",
    lineHeight: "1.2 !important",
    maxWidth: 580,
  },

  heroText: {
    color: "#dbeafe",
    lineHeight: "1.9 !important",
    fontSize: "14px !important",
    maxWidth: 570,
    marginTop: "15px !important",
  },

  sectionTitle: {
    fontSize: "22px !important",
    color: "#172554",
    fontWeight: "800 !important",
    letterSpacing: "-.5px",
  },

  sectionText: {
    fontSize: "13px !important",
    color: "#8490a5",
    marginTop: "6px !important",
    marginBottom: "20px !important",
  },

  featureCard: {
    height: "100%",
    borderRadius: "16px !important",
    border: "1px solid #e6ebf4",
    boxShadow: "0 3px 12px rgba(15,23,42,.025) !important",
    transition: "all .22s ease !important",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      borderColor: "#bfdbfe",
      boxShadow: "0 12px 28px rgba(37,99,235,.10) !important",
    },
  },

  selectedCard: {
    border: "1px solid #60a5fa !important",
    boxShadow: "0 0 0 3px #dbeafe, 0 10px 25px rgba(37,99,235,.08) !important",
  },

  techCard: {
    border: "1px solid #e6ebf4",
    borderRadius: "17px !important",
    boxShadow: "0 3px 12px rgba(15,23,42,.025) !important",
    height: "100%",
  },

  techChip: {
    margin: "0 7px 9px 0 !important",
    borderRadius: "9px !important",
    background: "#eff6ff !important",
    color: "#1d4ed8 !important",
    border: "1px solid #dbeafe !important",
    fontWeight: "650 !important",
  },

  actionButton: {
    textTransform: "none !important",
    borderRadius: "10px !important",
    fontWeight: "700 !important",
    padding: "9px 16px !important",
  },
}));

const features = [
  {
    title: "Employee Records",
    description: "Manage employee profiles and contact information.",
    detail:
      "Maintain employee IDs, names, gender, date of birth, department assignments and contact numbers in an organized employee directory.",
    icon: <GroupsRoundedIcon />,
    color: "#2563eb",
    bg: "#eff6ff",
    route: "/employee",
  },
  {
    title: "Departments",
    description: "Organize departments and employee assignments.",
    detail:
      "View department information, organize employee assignments and review department-level employee counts.",
    icon: <ApartmentRoundedIcon />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    route: "/departments",
  },
  {
    title: "Attendance",
    description: "Track present, absent and leave records.",
    detail:
      "Manage daily attendance records and use attendance summaries to understand employee attendance patterns.",
    icon: <EventAvailableRoundedIcon />,
    color: "#059669",
    bg: "#ecfdf5",
    route: "/attendance",
  },
  {
    title: "Payroll",
    description: "Keep salary information organized.",
    detail:
      "Access employee salary records through the payroll module and keep salary information in one place.",
    icon: <PaymentsRoundedIcon />,
    color: "#d97706",
    bg: "#fffbeb",
    route: "/salary",
  },
  {
    title: "Address Book",
    description: "Maintain employee address details.",
    detail:
      "Manage employee address records and keep associated location information connected with employee data.",
    icon: <LocationOnRoundedIcon />,
    color: "#db2777",
    bg: "#fdf2f8",
    route: "/address",
  },
  {
    title: "Inactive Users",
    description: "View inactive employee records separately.",
    detail:
      "Review employee records marked as inactive without mixing them with the regular employee listing.",
    icon: <SecurityRoundedIcon />,
    color: "#dc2626",
    bg: "#fef2f2",
    route: "/inactiveUsers",
  },
];

const techGroups = [
  {
    category: "All",
    items: ["React.js", "Material UI", "JavaScript", "Node.js", "Express.js", "MySQL", "REST APIs"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Material UI", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    category: "Database",
    items: ["MySQL"],
  },
];

export default function About() {
  const classes = useStyles();

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [techFilter, setTechFilter] = useState("All");
  const [showOverview, setShowOverview] = useState(false);

  const activeTechGroup =
    techGroups.find((group) => group.category === techFilter) || techGroups[0];

  const handleOpenFeature = (feature) => {
    setSelectedFeature((current) =>
      current?.title === feature.title ? null : feature
    );
  };

  const handleNavigate = (path) => {
    // Navigation to the relevant module
    window.location.href = path;
  };

  return (
    <Box className={classes.page}>
      <Container maxWidth="xl">
        {/* Breadcrumb */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#94a3b8",
            mb: 2.5,
            fontSize: 13,
          }}
        >
          <DashboardRoundedIcon sx={{ fontSize: 17 }} />
          Dashboard
          <span>/</span>
          <Typography
            component="span"
            sx={{ color: "#2563eb", fontSize: 13, fontWeight: 700 }}
          >
            About
          </Typography>
        </Box>

        {/* Hero */}
        <Box className={classes.hero}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box className={classes.eyebrow}>
                <BusinessRoundedIcon sx={{ fontSize: 16 }} />
                EMPLOYEE MANAGEMENT SYSTEM
              </Box>

              <Typography className={classes.heroTitle}>
                One workspace. A better way to manage people.
              </Typography>

              <Typography className={classes.heroText}>
                Bring employee information, departments, attendance, payroll
                and addresses together in one organized application.
              </Typography>

              <Box sx={{ display: "flex", gap: 1.2, mt: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  className={classes.actionButton}
                  onClick={() => handleNavigate("/dashboard")}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    background: "#fff",
                    color: "#1d4ed8",
                    "&:hover": { background: "#eff6ff" },
                  }}
                >
                  Explore Dashboard
                </Button>

                <Button
                  variant="outlined"
                  className={classes.actionButton}
                  onClick={() => setShowOverview((value) => !value)}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,.5)",
                    "&:hover": {
                      borderColor: "#fff",
                      background: "rgba(255,255,255,.08)",
                    },
                  }}
                  endIcon={
                    <ExpandMoreRoundedIcon
                      sx={{
                        transform: showOverview ? "rotate(180deg)" : "none",
                        transition: ".2s",
                      }}
                    />
                  }
                >
                  {showOverview ? "Hide overview" : "Project overview"}
                </Button>
              </Box>

              <Collapse in={showOverview}>
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,255,255,.10)",
                    border: "1px solid rgba(255,255,255,.17)",
                    maxWidth: 550,
                  }}
                >
                  <Typography sx={{ color: "#fff", fontSize: 13, lineHeight: 1.9 }}>
                    This application uses React for its interface, Express.js
                    for backend APIs and MySQL for storing structured employee
                    data. Individual modules help organize routine HR tasks.
                  </Typography>
                </Box>
              </Collapse>
            </Grid>

            {/* Interactive preview */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: "18px",
                  p: 2.5,
                  color: "#172554",
                  boxShadow: "0 20px 50px rgba(15,23,42,.2)",
                  transform: { md: "rotate(-1deg)" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mb: 2.5,
                  }}
                >
                  <Avatar sx={{ bgcolor: "#dbeafe", color: "#2563eb" }}>
                    <BusinessRoundedIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                      Workspace overview
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      Employee operations
                    </Typography>
                  </Box>
                  <Chip
                    label="Workspace"
                    size="small"
                    sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700 }}
                  />
                </Box>

                <Grid container spacing={1.2}>
                  {[
                    { label: "Employees", icon: <GroupsRoundedIcon />, color: "#2563eb", bg: "#eff6ff" },
                    { label: "Departments", icon: <ApartmentRoundedIcon />, color: "#7c3aed", bg: "#f5f3ff" },
                    { label: "Attendance", icon: <EventAvailableRoundedIcon />, color: "#059669", bg: "#ecfdf5" },
                    { label: "Payroll", icon: <PaymentsRoundedIcon />, color: "#d97706", bg: "#fffbeb" },
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Box
                        sx={{
                          p: 1.7,
                          borderRadius: 2.5,
                          background: item.bg,
                          border: "1px solid #edf1f7",
                          transition: ".2s",
                          "&:hover": { transform: "translateY(-3px)" },
                        }}
                      >
                        <Box sx={{ color: item.color, mb: 1 }}>
                          {item.icon}
                        </Box>
                        <Typography sx={{ fontWeight: 750, fontSize: 12 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 10, mt: 0.4 }}>
                          Management module
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    background: "#f8fafc",
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 19 }} />
                  <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                    Employee information, organized in one place
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Interactive modules */}
        <Box sx={{ mb: 4 }}>
          <Typography className={classes.sectionTitle}>
            Explore the platform
          </Typography>

          <Typography className={classes.sectionText}>
            Select a module to see what it does and open its page.
          </Typography>

          <Grid container spacing={2}>
            {features.map((feature) => {
              const selected = selectedFeature?.title === feature.title;

              return (
                <Grid item xs={12} sm={6} lg={4} key={feature.title}>
                  <Card
                    onClick={() => handleOpenFeature(feature)}
                    className={`${classes.featureCard} ${
                      selected ? classes.selectedCard : ""
                    }`}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 47,
                            height: 47,
                            borderRadius: "13px",
                            color: feature.color,
                            bgcolor: feature.bg,
                          }}
                        >
                          {feature.icon}
                        </Avatar>

                        <ArrowForwardRoundedIcon
                          sx={{
                            color: selected ? "#2563eb" : "#cbd5e1",
                            transform: selected ? "rotate(90deg)" : "none",
                            transition: ".2s",
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#1e293b",
                          mb: 0.8,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#7b879b",
                          fontSize: 12.5,
                          lineHeight: 1.8,
                        }}
                      >
                        {feature.description}
                      </Typography>

                      <Collapse in={selected}>
                        <Divider sx={{ my: 1.8, borderColor: "#edf1f7" }} />

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#475569",
                            lineHeight: 1.9,
                            mb: 2,
                          }}
                        >
                          {feature.detail}
                        </Typography>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNavigate(feature.route);
                          }}
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            boxShadow: "none",
                          }}
                        >
                          Open module
                        </Button>
                      </Collapse>

                      {!selected && (
                        <Typography
                          sx={{
                            color: feature.color,
                            fontSize: 12,
                            fontWeight: 700,
                            mt: 2,
                          }}
                        >
                          View details →
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Technology stack with interactive filter */}
        <Card className={classes.techCard}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography className={classes.sectionTitle}>
              Technology stack
            </Typography>

            <Typography className={classes.sectionText}>
              Filter the technologies by application layer.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
              {techGroups.map((group) => (
                <Chip
                  key={group.category}
                  label={group.category}
                  clickable
                  onClick={() => setTechFilter(group.category)}
                  color={techFilter === group.category ? "primary" : "default"}
                  variant={techFilter === group.category ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 700,
                    borderRadius: "9px",
                    px: 0.5,
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 2.5, borderColor: "#edf1f7" }} />

            <Grid container spacing={2}>
              {activeTechGroup.items.map((tech) => {
                const isFrontend = ["React.js", "Material UI", "JavaScript"].includes(tech);
                const isDatabase = tech === "MySQL";

                return (
                  <Grid item xs={6} sm={4} md={3} key={tech}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.3,
                        p: 1.7,
                        border: "1px solid #e8edf5",
                        borderRadius: 2.5,
                        background: "#fbfdff",
                        transition: ".2s",
                        "&:hover": {
                          borderColor: "#93c5fd",
                          background: "#f0f7ff",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: isFrontend
                            ? "#eff6ff"
                            : isDatabase
                            ? "#fff7ed"
                            : "#ecfdf5",
                          color: isFrontend
                            ? "#2563eb"
                            : isDatabase
                            ? "#ea580c"
                            : "#059669",
                        }}
                      >
                        {isFrontend ? (
                          <CodeRoundedIcon fontSize="small" />
                        ) : isDatabase ? (
                          <StorageRoundedIcon fontSize="small" />
                        ) : (
                          <ApiRoundedIcon fontSize="small" />
                        )}
                      </Avatar>

                      <Typography
                        sx={{
                          color: "#334155",
                          fontSize: 12,
                          fontWeight: 750,
                        }}
                      >
                        {tech}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: "center", pt: 3, color: "#94a3b8" }}>
          <Divider sx={{ mb: 2, borderColor: "#e5eaf2" }} />
          <Typography sx={{ fontSize: 12 }}>
            <BusinessRoundedIcon
              sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
            />
            Thinking Machines · Employee Management System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}