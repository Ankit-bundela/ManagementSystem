import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

import LoginImage from "../assets/images/login.png";
import GoogleLogo from "../assets/images/google.png";
import MicrosoftLogo from "../assets/images/microsoft.png";

const API_URL = "http://localhost:5050";

const useStyles = makeStyles(() => ({
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    background: "#ffffff",
    fontFamily: '"Roboto", "Arial", sans-serif',
    overflow: "hidden",

    "@media (max-width: 768px)": {
      minHeight: "100vh",
      padding: "24px 16px",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
    },
  },

  leftPanel: {
    width: "50%",
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "45px",
    boxSizing: "border-box",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 15% 20%, #ddd6fe 0%, transparent 35%), radial-gradient(circle at 85% 80%, #dbeafe 0%, transparent 35%), linear-gradient(135deg, #f5f3ff 0%, #eef2ff 55%, #eff6ff 100%)",

    "&::before": {
      content: '""',
      position: "absolute",
      width: "300px",
      height: "300px",
      border: "1px solid rgba(99,102,241,0.12)",
      borderRadius: "50%",
      top: "-120px",
      right: "-100px",
    },

    "&::after": {
      content: '""',
      position: "absolute",
      width: "220px",
      height: "220px",
      border: "1px solid rgba(99,102,241,0.12)",
      borderRadius: "50%",
      bottom: "-100px",
      right: "80px",
    },

    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  brand: {
    position: "absolute",
    top: "35px",
    left: "40px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 2,
  },

  brandIcon: {
    width: "46px",
    height: "46px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    boxShadow: "0 8px 22px rgba(79,70,229,0.25)",
    flexShrink: 0,

    "& svg": {
      fontSize: "27px",
    },
  },

  brandName: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    color: "#172554",
    letterSpacing: "-0.6px",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    fontSize: "11px",
    color: "#64748b",
    letterSpacing: "0.5px",
  },

  heroContent: {
    width: "100%",
    maxWidth: "510px",
    zIndex: 1,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 13px",
    borderRadius: "30px",
    background: "rgba(79,70,229,0.09)",
    color: "#4338ca",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.8px",
    marginBottom: "20px",

    "& svg": {
      fontSize: "17px",
    },
  },

  heroTitle: {
    fontSize: "42px",
    lineHeight: 1.2,
    letterSpacing: "-1.5px",
    fontWeight: 800,
    color: "#172554",
    margin: "0 0 16px",

    "& span": {
      color: "#4f46e5",
    },

    "@media (max-width: 1050px)": {
      fontSize: "34px",
    },
  },

  heroDescription: {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#64748b",
    maxWidth: "420px",
    margin: "0 0 20px",
  },

  illustration: {
    width: "100%",
    maxWidth: "440px",
    maxHeight: "350px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
    filter: "drop-shadow(0 15px 25px rgba(79,70,229,0.08))",
  },

  infoCard: {
    position: "absolute",
    bottom: "35px",
    left: "40px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "14px 19px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(255,255,255,0.95)",
    boxShadow: "0 12px 35px rgba(30,41,59,0.07)",
    backdropFilter: "blur(12px)",
    zIndex: 2,
  },

  infoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,

    "& svg": {
      fontSize: "25px",
    },
  },

  infoTitle: {
    margin: 0,
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "13px",
  },

  infoText: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#64748b",
  },

  rightPanel: {
    width: "50%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "35px 24px",
    boxSizing: "border-box",
    background: "#ffffff",

    "@media (max-width: 768px)": {
      width: "100%",
      minHeight: "auto",
      padding: 0,
      background: "transparent",
    },
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    padding: "38px",
    boxSizing: "border-box",
    background: "#ffffff",
    border: "1px solid #eef2f7",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(15,23,42,0.07)",

    "@media (max-width: 768px)": {
      maxWidth: "460px",
      padding: "30px 24px",
      borderRadius: "20px",
      boxShadow: "0 15px 45px rgba(15,23,42,0.07)",
    },

    "@media (max-width: 380px)": {
      padding: "24px 18px",
    },
  },

  mobileBrand: {
    display: "none",

    "@media (max-width: 768px)": {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "28px",
    },
  },

  formTitle: {
    margin: "0 0 9px",
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.8px",
    color: "#0f172a",

    "@media (max-width: 380px)": {
      fontSize: "27px",
    },
  },

  formDescription: {
    margin: "0 0 25px",
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#64748b",
  },

  securityNote: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    margin: "-10px 0 24px",
    color: "#64748b",
    fontSize: "12px",

    "& svg": {
      color: "#10b981",
      fontSize: "18px",
    },
  },

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "12px 14px",
    marginBottom: "18px",
    borderRadius: "11px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    fontSize: "13px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    marginBottom: "9px",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "15px",
    color: "#818cf8",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1,

    "& svg": {
      fontSize: "21px",
    },
  },

  input: {
    width: "100%",
    height: "50px",
    boxSizing: "border-box",
    padding: "0 45px",
    border: "1px solid #e2e8f0",
    borderRadius: "11px",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#0f172a",
    background: "#ffffff",
    transition: "border-color 0.2s, box-shadow 0.2s",

    "&::placeholder": {
      color: "#a0aabd",
    },

    "&:hover": {
      borderColor: "#c7d2fe",
    },

    "&:focus": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
    },
  },

  passwordToggle: {
    position: "absolute",
    right: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    padding: 0,

    "&:hover": {
      background: "#f1f5f9",
      color: "#4f46e5",
    },

    "& svg": {
      fontSize: "21px",
    },
  },

  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    margin: "2px 0 25px",
    fontSize: "12px",
    flexWrap: "wrap",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#64748b",
    cursor: "pointer",

    "& input": {
      accentColor: "#4f46e5",
      width: "15px",
      height: "15px",
      cursor: "pointer",
    },
  },

  textLink: {
    color: "#4f46e5",
    fontWeight: 700,
    textDecoration: "none",

    "&:hover": {
      textDecoration: "underline",
    },
  },

  loginButton: {
    width: "100%",
    minHeight: "51px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "11px",
    background: "linear-gradient(100deg, #4f46e5, #6366f1)",
    color: "#ffffff",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(79,70,229,0.2)",
    transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",

    "&:hover": {
      background: "linear-gradient(100deg, #4338ca, #4f46e5)",
      boxShadow: "0 11px 24px rgba(79,70,229,0.27)",
      transform: "translateY(-1px)",
    },

    "&:disabled": {
      opacity: 0.65,
      cursor: "not-allowed",
      transform: "none",
    },

    "& svg": {
      fontSize: "20px",
    },
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    margin: "24px 0",
    color: "#94a3b8",
    fontSize: "12px",
    whiteSpace: "nowrap",

    "&::before, &::after": {
      content: '""',
      flex: 1,
      height: "1px",
      background: "#e9edf4",
    },
  },

  socialRow: {
    display: "flex",
    gap: "12px",

    "@media (max-width: 350px)": {
      flexDirection: "column",
    },
  },

  socialButton: {
    flex: 1,
    minWidth: 0,
    height: "46px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "9px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",

    "&:hover": {
      background: "#f8fafc",
      borderColor: "#cbd5e1",
    },

    "& img": {
      width: "19px",
      height: "19px",
      objectFit: "contain",
    },
  },

  footer: {
    margin: "25px 0 0",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.8,
  },
}));

export default function Login() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // Handle non-JSON responses safely
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token) {
        setError("Login failed: authentication token was not returned.");
        return;
      }

      // Store JWT and user information
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Navigate to the dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} sign-in is not configured yet.`);
  };

  return (
    <div className={classes.page}>
      {/* LEFT PANEL */}
      <section className={classes.leftPanel}>
        <div className={classes.brand}>
          <div className={classes.brandIcon}>
            <BusinessRoundedIcon />
          </div>

          <div>
            <h2 className={classes.brandName}>Employee</h2>
            <p className={classes.brandSubtitle}>
              MANAGEMENT PORTAL
            </p>
          </div>
        </div>

        <div className={classes.heroContent}>
          <span className={classes.eyebrow}>
            <DashboardCustomizeRoundedIcon />
            EMPLOYEE MANAGEMENT SYSTEM
          </span>

          <h1 className={classes.heroTitle}>
            Welcome back to
            <br />
            <span>smarter management.</span>
          </h1>

          <p className={classes.heroDescription}>
            Manage employees, departments, attendance and financial
            records from one simple and secure dashboard.
          </p>

          <img
            src={LoginImage}
            alt="Employee management dashboard illustration"
            className={classes.illustration}
          />
        </div>

        <div className={classes.infoCard}>
          <div className={classes.infoIcon}>
            <CheckCircleRoundedIcon />
          </div>

          <div>
            <p className={classes.infoTitle}>
              Your workspace, simplified
            </p>

            <p className={classes.infoText}>
              Everything you need in one place.
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className={classes.rightPanel}>
        <div className={classes.loginCard}>
          {/* MOBILE BRAND */}
          <div className={classes.mobileBrand}>
            <div className={classes.brandIcon}>
              <BusinessRoundedIcon />
            </div>

            <div>
              <h2 className={classes.brandName}>Employee</h2>
              <p className={classes.brandSubtitle}>
                MANAGEMENT PORTAL
              </p>
            </div>
          </div>

          <h1 className={classes.formTitle}>Welcome back!</h1>

          <p className={classes.formDescription}>
            Sign in to continue to your account.
          </p>

          <div className={classes.securityNote}>
            <SecurityRoundedIcon />
            Secure access to your workspace
          </div>

          {error && (
            <div className={classes.error} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className={classes.field}>
              <label htmlFor="login-email" className={classes.label}>
                Email address
              </label>

              <div className={classes.inputWrap}>
                <span className={classes.inputIcon}>
                  <MailOutlineRoundedIcon />
                </span>

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={classes.input}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={classes.field}>
              <label htmlFor="login-password" className={classes.label}>
                Password
              </label>

              <div className={classes.inputWrap}>
                <span className={classes.inputIcon}>
                  <LockOutlinedIcon />
                </span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classes.input}
                  style={{ paddingRight: "52px" }}
                  required
                />

                <button
                  type="button"
                  className={classes.passwordToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className={classes.options}>
              <label className={classes.remember}>
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className={classes.textLink}
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className={classes.loginButton}
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in to your account
                  <ArrowForwardRoundedIcon />
                </>
              )}
            </button>
          </form>

          <div className={classes.divider}>Or continue with</div>

          {/* SOCIAL LOGIN */}
          <div className={classes.socialRow}>
            <button
              type="button"
              className={classes.socialButton}
              onClick={() => handleSocialLogin("Google")}
            >
              <img src={GoogleLogo} alt="" />
              Google
            </button>

            <button
              type="button"
              className={classes.socialButton}
              onClick={() => handleSocialLogin("Microsoft")}
            >
              <img src={MicrosoftLogo} alt="" />
              Microsoft
            </button>
          </div>

          <p className={classes.footer}>
            Don't have an account?{" "}
            <Link to="/register" className={classes.textLink}>
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
