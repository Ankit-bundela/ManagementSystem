
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import RegisterImage from "../assets/images/register.png";
import GoogleLogo from "../assets/images/google.png";
import MicrosoftLogo from "../assets/images/microsoft.png";

const appTheme = createTheme();

const useStyles = makeStyles(
    (theme) => ({
        page: {
            minHeight: "100vh",
            display: "flex",
            background: "#f8fafc",
            fontFamily: "'Inter', 'Roboto', sans-serif",
        },

        leftPanel: {
            width: "48%",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "38px 44px 28px",
            boxSizing: "border-box",
            background:
                "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 48%, #ccfbf1 100%)",

            [theme.breakpoints.down("md")]: {
                display: "none",
            },
        },

        circleOne: {
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(16,185,129,0.10)",
            top: -140,
            right: -130,
        },

        circleTwo: {
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(13,148,136,0.09)",
            bottom: -100,
            left: -100,
        },

        brand: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
            zIndex: 2,
        },

        brandIcon: {
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #059669, #0d9488)",
            borderRadius: 14,
            boxShadow: "0 8px 20px rgba(5,150,105,0.2)",
        },

        brandName: {
            fontSize: 22,
            fontWeight: 800,
            color: "#12352c",
            letterSpacing: "-0.5px",
        },

        brandSubtitle: {
            fontSize: 10,
            color: "#53776b",
            marginTop: 3,
            letterSpacing: 1,
        },

        leftContent: {
            position: "relative",
            zIndex: 2,
            maxWidth: 510,
            marginTop: 25,
        },

        eyebrow: {
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            color: "#047857",
            background: "rgba(255,255,255,0.75)",
            padding: "8px 13px",
            borderRadius: 30,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 22,
        },

        leftHeading: {
            fontSize: "clamp(32px, 3.2vw, 47px)",
            lineHeight: 1.16,
            fontWeight: 800,
            color: "#153d32",
            letterSpacing: "-1.6px",
            margin: "0 0 18px",
        },

        accentText: {
            color: "#059669",
        },

        leftDescription: {
            fontSize: 14,
            lineHeight: 1.8,
            color: "#527267",
            maxWidth: 410,
            margin: 0,
        },

        imageWrap: {
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "12px -10px 0",
            flex: 1,
            minHeight: 180,
        },

        illustration: {
            width: "100%",
            maxWidth: 440,
            maxHeight: 300,
            objectFit: "contain",
            filter: "drop-shadow(0 18px 24px rgba(15,118,80,0.08))",
        },

        leftFooter: {
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#527267",
            fontSize: 12,
        },

        rightPanel: {
            flex: 1,
            minWidth: 0,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxSizing: "border-box",
            background: "#f8fafc",

            [theme.breakpoints.down("sm")]: {
                padding: "18px 12px",
            },
        },

        formCard: {
            width: "100%",
            maxWidth: 455,
            background: "#fff",
            border: "1px solid #edf0f3",
            borderRadius: 22,
            padding: "30px 34px",
            boxSizing: "border-box",
            boxShadow: "0 18px 55px rgba(15,23,42,0.055)",

            [theme.breakpoints.down("sm")]: {
                padding: "25px 19px",
                borderRadius: 17,
            },
        },

        mobileBrand: {
            display: "none",
            alignItems: "center",
            gap: 10,
            marginBottom: 25,

            [theme.breakpoints.down("md")]: {
                display: "flex",
            },
        },

        mobileBrandIcon: {
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "#059669",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        heading: {
            fontSize: 29,
            fontWeight: 800,
            letterSpacing: "-0.8px",
            color: "#172b25",
            margin: "0 0 8px",
        },

        subtitle: {
            color: "#7b8794",
            fontSize: 13,
            lineHeight: 1.7,
            margin: "0 0 21px",
        },

        error: {
            padding: "11px 13px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: 10,
            color: "#be123c",
            fontSize: 12,
            marginBottom: 15,
            lineHeight: 1.5,
        },

        success: {
            padding: "11px 13px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 10,
            color: "#047857",
            fontSize: 12,
            marginBottom: 15,
        },

        field: {
            marginBottom: 14,
        },

        label: {
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "#34463f",
            marginBottom: 7,
        },

        inputWrap: {
            display: "flex",
            alignItems: "center",
            border: "1px solid #e2e8e5",
            background: "#fff",
            borderRadius: 11,
            minHeight: 46,
            padding: "0 12px",
            gap: 10,
            transition: "border-color 0.2s, box-shadow 0.2s",

            "&:focus-within": {
                borderColor: "#10b981",
                boxShadow: "0 0 0 3px rgba(16,185,129,0.11)",
            },
        },

        inputIcon: {
            color: "#94a3a0",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
        },

        input: {
            width: "100%",
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#1e293b",
            fontSize: 13,
            padding: "12px 0",

            "&::placeholder": {
                color: "#a4afac",
            },
        },

        eyeButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            color: "#89958f",
            cursor: "pointer",
            padding: 3,
            flexShrink: 0,
        },

        terms: {
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            margin: "3px 0 18px",
            fontSize: 11,
            lineHeight: 1.7,
            color: "#64716b",
        },

        checkbox: {
            accentColor: "#059669",
            marginTop: 3,
            width: 14,
            height: 14,
            flexShrink: 0,
            cursor: "pointer",
        },

        termsLink: {
            color: "#059669",
            fontWeight: 700,
            textDecoration: "none",

            "&:hover": {
                textDecoration: "underline",
            },
        },

        submitButton: {
            width: "100%",
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            border: "none",
            borderRadius: 11,
            color: "#fff",
            background: "linear-gradient(100deg, #059669, #0d9488)",
            boxShadow: "0 8px 18px rgba(5,150,105,0.18)",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",

            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 11px 23px rgba(5,150,105,0.25)",
            },

            "&:disabled": {
                opacity: 0.65,
                cursor: "not-allowed",
                transform: "none",
            },
        },

        divider: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#9aa49f",
            fontSize: 11,
            margin: "20px 0 16px",

            "&::before, &::after": {
                content: '""',
                flex: 1,
                height: 1,
                background: "#edf0ee",
            },
        },

        socialRow: {
            display: "flex",
            gap: 12,
        },

        socialButton: {
            flex: 1,
            minWidth: 0,
            minHeight: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: "1px solid #e5e9e7",
            borderRadius: 10,
            background: "#fff",
            color: "#34423b",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",

            "&:hover": {
                background: "#f8faf9",
            },
        },

        socialLogo: {
            width: 18,
            height: 18,
            objectFit: "contain",
        },

        footer: {
            textAlign: "center",
            margin: "21px 0 0",
            color: "#7b8794",
            fontSize: 12,
        },

        footerLink: {
            color: "#059669",
            fontWeight: 700,
            textDecoration: "none",
            marginLeft: 4,

            "&:hover": {
                textDecoration: "underline",
            },
        },

        security: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 17,
            color: "#94a39b",
            fontSize: 10,
        },
    }),
    { defaultTheme: appTheme }
);

function Register() {
    const classes = useStyles();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!acceptedTerms) {
            setError(
                "Please accept the Terms of Service and Privacy Policy."
            );
            return;
        }

        try {
            setLoading(true);


            const API_URL = process.env.REACT_APP_API_URL;

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );


            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || "Registration failed.");
                return;
            }

            setSuccess("Registration successful. Redirecting to login...");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAcceptedTerms(false);

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                "Unable to connect to the server. Please check your backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.page}>
            <section className={classes.leftPanel}>
                <div className={classes.circleOne} />
                <div className={classes.circleTwo} />

                <div className={classes.brand}>
                    <div className={classes.brandIcon}>
                        <BusinessRoundedIcon />
                    </div>

                    <div>
                        <div className={classes.brandName}>Employee</div>
                        <div className={classes.brandSubtitle}>
                            MANAGEMENT PORTAL
                        </div>
                    </div>
                </div>

                <div className={classes.leftContent}>
                    <div className={classes.eyebrow}>
                        <CheckCircleRoundedIcon style={{ fontSize: 16 }} />
                        SIMPLE. SECURE. SMART.
                    </div>

                    <h1 className={classes.leftHeading}>
                        Get started with
                        <br />
                        smarter{" "}
                        <span className={classes.accentText}>
                            business
                        </span>
                        <br />
                        management.
                    </h1>

                    <p className={classes.leftDescription}>
                        Create your account and bring your business
                        information, customers, and daily operations
                        together in one place.
                    </p>
                </div>

                <div className={classes.imageWrap}>
                    <img
                        src={RegisterImage}
                        alt="Registration illustration"
                        className={classes.illustration}
                    />
                </div>

                <div className={classes.leftFooter}>
                    <SecurityRoundedIcon style={{ fontSize: 16 }} />
                    A simple workspace for your business
                </div>
            </section>

            <section className={classes.rightPanel}>
                <div className={classes.formCard}>
                    <div className={classes.mobileBrand}>
                        <div className={classes.mobileBrandIcon}>
                            <BusinessRoundedIcon />
                        </div>
                        <div className={classes.brandName}>Employee</div>
                    </div>

                    <h2 className={classes.heading}>Create account</h2>

                    <p className={classes.subtitle}>
                        Join us today. Enter your details to get started.
                    </p>

                    {error && (
                        <div className={classes.error} role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={classes.success} role="status">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className={classes.field}>
                            <label
                                className={classes.label}
                                htmlFor="register-name"
                            >
                                Full name
                            </label>

                            <div className={classes.inputWrap}>
                                <span className={classes.inputIcon}>
                                    <PersonOutlineRoundedIcon fontSize="small" />
                                </span>

                                <input
                                    id="register-name"
                                    className={classes.input}
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={classes.field}>
                            <label
                                className={classes.label}
                                htmlFor="register-email"
                            >
                                Email address
                            </label>

                            <div className={classes.inputWrap}>
                                <span className={classes.inputIcon}>
                                    <MailOutlineRoundedIcon fontSize="small" />
                                </span>

                                <input
                                    id="register-email"
                                    className={classes.input}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={classes.field}>
                            <label
                                className={classes.label}
                                htmlFor="register-password"
                            >
                                Password
                            </label>

                            <div className={classes.inputWrap}>
                                <span className={classes.inputIcon}>
                                    <LockOutlinedIcon fontSize="small" />
                                </span>

                                <input
                                    id="register-password"
                                    className={classes.input}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a password (8+ characters)"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className={classes.eyeButton}
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <VisibilityOffRoundedIcon fontSize="small" />
                                    ) : (
                                        <VisibilityRoundedIcon fontSize="small" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={classes.field}>
                            <label
                                className={classes.label}
                                htmlFor="register-confirm-password"
                            >
                                Confirm password
                            </label>

                            <div className={classes.inputWrap}>
                                <span className={classes.inputIcon}>
                                    <LockOutlinedIcon fontSize="small" />
                                </span>

                                <input
                                    id="register-confirm-password"
                                    className={classes.input}
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className={classes.eyeButton}
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOffRoundedIcon fontSize="small" />
                                    ) : (
                                        <VisibilityRoundedIcon fontSize="small" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className={classes.terms}>
                            <input
                                type="checkbox"
                                className={classes.checkbox}
                                checked={acceptedTerms}
                                onChange={(e) =>
                                    setAcceptedTerms(e.target.checked)
                                }
                            />

                            <span>
                                I agree to the{" "}
                                <Link
                                    to="/terms"
                                    className={classes.termsLink}
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/privacy"
                                    className={classes.termsLink}
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>

                        <button
                            type="submit"
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}

                            {!loading && (
                                <ArrowForwardRoundedIcon fontSize="small" />
                            )}
                        </button>
                    </form>

                    <div className={classes.divider}>or sign up with</div>

                    <div className={classes.socialRow}>
                        <button
                            type="button"
                            className={classes.socialButton}
                            onClick={() =>
                                setError(
                                    "Google sign-up is not configured yet."
                                )
                            }
                        >
                            <img
                                src={GoogleLogo}
                                alt=""
                                className={classes.socialLogo}
                            />
                            Google
                        </button>

                        <button
                            type="button"
                            className={classes.socialButton}
                            onClick={() =>
                                setError(
                                    "Microsoft sign-up is not configured yet."
                                )
                            }
                        >
                            <img
                                src={MicrosoftLogo}
                                alt=""
                                className={classes.socialLogo}
                            />
                            Microsoft
                        </button>
                    </div>

                    <p className={classes.footer}>
                        Already have an account?
                        <Link to="/login" className={classes.footerLink}>
                            Sign in
                        </Link>
                    </p>

                    <div className={classes.security}>
                        <SecurityRoundedIcon style={{ fontSize: 14 }} />
                        Your information is handled securely
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;