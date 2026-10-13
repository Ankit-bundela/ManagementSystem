
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { makeStyles } from "@mui/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import NavBar from "./Components/NavBar";
import EmplyeesComponets from "./Components/EmployessComponets";
import Dashboard from "./Components/Dashboard";
import DepartmentComponent from "./Components/DepartmentComponent";
import AttendanceComponent from "./Components/AttendanceComponent";
import SalaryComponent from "./Components/SalaryComponent";
import EmployeeAddressComponent from "./Components/EmployeeAddressComponent";
import Login from "./Components/Login";
import Register from "./Components/Register";
import InactiveUsers from "./Components/InactiveUsers";
import About from "./Components/About";

// --------------------------------------------------
// Theme
// --------------------------------------------------
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.3px",
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "14px",
    },
    body2: {
      fontSize: "13px",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  palette: {
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
});

// --------------------------------------------------
// Styles
// --------------------------------------------------
const useStyles = makeStyles(() => ({
  mainContent: {
    paddingTop: "90px",
    paddingLeft: "25px",
    paddingRight: "25px",
    fontFamily: '"Roboto", "Arial", sans-serif',
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    boxSizing: "border-box",

    "@media (max-width: 600px)": {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },

  authContent: {
    padding: 0,
    margin: 0,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#FFFFFF",
    fontFamily: '"Roboto", "Arial", sans-serif',
    boxSizing: "border-box",
  },
}));

// --------------------------------------------------
// Get Token
// --------------------------------------------------
function getToken() {
  const token = localStorage.getItem("token");

  if (
    !token ||
    token === "undefined" ||
    token === "null" ||
    token.trim() === ""
  ) {
    return null;
  }

  return token;
}

// --------------------------------------------------
// Protected Route
// --------------------------------------------------
function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// --------------------------------------------------
// Public Route
// --------------------------------------------------
function PublicRoute({ children }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// --------------------------------------------------
// Application Layout
// --------------------------------------------------
function AppLayout() {
  const styles = useStyles();
  const location = useLocation();

  const token = getToken();

  const isAuthPage = ["/login", "/register"].includes(
    location.pathname.toLowerCase()
  );

  return (
    <>
      {/* Navbar only after login */}
      {token && !isAuthPage && <NavBar />}

      <main
        className={
          isAuthPage ? styles.authContent : styles.mainContent
        }
      >
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              <Navigate
                to={token ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Employees */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <EmplyeesComponets />
              </ProtectedRoute>
            }
          />

          {/* Departments */}
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentComponent />
              </ProtectedRoute>
            }
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendanceComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }/>

          {/* Payroll */}
          <Route
            path="/salary"
            element={
              <ProtectedRoute>
                <SalaryComponent />
              </ProtectedRoute>
            }
          />

          {/* Employee Address */}
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <EmployeeAddressComponent />
              </ProtectedRoute>
            }
          />

          {/* Inactive Users */}
          <Route
            path="/inactiveUsers"
            element={
              <ProtectedRoute>
                <InactiveUsers />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={
              <Navigate
                to={token ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </main>
    </>
  );
}

// --------------------------------------------------
// Main App
// --------------------------------------------------
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;