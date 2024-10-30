import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { ScrollToTop } from "../components";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            showToast("You have already logged in.", "info");
            navigate("/");
        }
    }, [user, navigate, showToast]);

    useEffect(() => {
        if (isLogin) {
            setIsFormValid(email !== "" && password !== "");
        }
    }, [
        isLogin,
        email,
        password,
        rePassword,
        userName,
        phoneNumber,
        emailError,
        passwordError,
    ]);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError("");
    };

    const handleEmailBlur = () => {
        if (email && !validateEmail(email)) {
            setEmailError("Please enter a valid email address");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleRePasswordChange = (e) => {
        setRePassword(e.target.value);
        setPasswordError("");
    };

    const handleRePasswordBlur = () => {
        if (rePassword && password !== rePassword) {
            setPasswordError("Passwords do not match");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            if (email && password) {
                // Kiểm tra email và password có giá trị
                await loginUser();
            } else {
                showToast("Please enter both email and password", "error");
            }
        } else {
            if (isRegisterFormValid) {
                await registerUser();
            } else {
                showToast(
                    "Please fill in all required fields correctly",
                    "error"
                );
            }
        }
    };

    const loginUser = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (data.token) {
                showToast("Login successful", "success");
                await login(data.token);
                navigate(location.state?.from || "/", { replace: true });
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Login error:", error);
            showToast(error.message, "error");
        }
    };

    const registerUser = async () => {
        try {
            const userData = {
                email,
                password,
                user_name: userName,
                phone_number: phoneNumber,
            };

            const response = await fetch(`${API_URL}/api/v1/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            showToast("Registration successful", "success");
            setIsLogin(true);
        } catch (error) {
            console.error("Registration error:", error);
            showToast(error.message, "error");
        }
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            if (value.length <= 10) {
                setPhoneNumber(value);
                setPhoneError("");
            }
        }
    };

    const handlePhoneBlur = () => {
        if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
            setPhoneError("Phone number must be exactly 10 digits");
        }
    };

    const isRegisterFormValid = useMemo(() => {
        return (
            email &&
            validateEmail(email) &&
            password &&
            password === rePassword &&
            phoneNumber &&
            validatePhoneNumber(phoneNumber) &&
            !emailError &&
            !passwordError &&
            !phoneError
        );
    }, [email, password, rePassword, phoneNumber, emailError, passwordError, phoneError]);

    return (
        <>
            <ScrollToTop />
            {!user && (
                <section className="min-h-screen pt-40">
                    <div className="container px-6">
                        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
                            {/* Left column container with background */}
                            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                                <img
                                    src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                    className="w-full"
                                    alt="Phone image"
                                />
                            </div>

                            {/* Right column container with form */}
                            <div className="md:w-8/12 lg:ms-6 lg:w-5/12">
                                <form onSubmit={handleSubmit}>
                                    {!isLogin && (
                                        <div className="relative mb-6">
                                            <input
                                                type="text"
                                                className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                                id="userNameInput"
                                                value={userName}
                                                onChange={(e) =>
                                                    setUserName(e.target.value)
                                                }
                                                placeholder="User Name"
                                            />
                                            <label
                                                htmlFor="userNameInput"
                                                className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out ${
                                                    userName
                                                        ? "-translate-y-[1.15rem] scale-[0.8] text-primary"
                                                        : ""
                                                } peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}
                                            >
                                                User Name
                                            </label>
                                        </div>
                                    )}

                                    {/* Email input */}
                                    <div className="relative mb-6">
                                        <input
                                            type="email"
                                            className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                            id="emailInput"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={handleEmailBlur}
                                            placeholder="Email address"
                                        />
                                        <label
                                            htmlFor="emailInput"
                                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out ${
                                                email
                                                    ? "-translate-y-[1.15rem] scale-[0.8] text-primary"
                                                    : ""
                                            } peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}
                                        >
                                            Email Address
                                        </label>
                                        {emailError && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {emailError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password input */}
                                    <div className="relative mb-6">
                                        <input
                                            type="password"
                                            className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                            id="passwordInput"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Password"
                                        />
                                        <label
                                            htmlFor="passwordInput"
                                            className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out ${
                                                password
                                                    ? "-translate-y-[1.15rem] scale-[0.8] text-primary"
                                                    : ""
                                            } peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}
                                        >
                                            Password
                                        </label>
                                    </div>

                                    {!isLogin && (
                                        <>
                                            {/* Re-Password input */}
                                            <div className="relative mb-6">
                                                <input
                                                    type="password"
                                                    className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                                    id="rePasswordInput"
                                                    value={rePassword}
                                                    onChange={
                                                        handleRePasswordChange
                                                    }
                                                    onBlur={handleRePasswordBlur}
                                                    placeholder="Re-enter Password"
                                                />
                                                <label
                                                    htmlFor="rePasswordInput"
                                                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out ${
                                                        rePassword
                                                            ? "-translate-y-[1.15rem] scale-[0.8] text-primary"
                                                            : ""
                                                    } peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}
                                                >
                                                    Re-enter Password
                                                </label>
                                                {passwordError && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {passwordError}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Number input */}
                                            <div className="relative mb-6">
                                                <input
                                                    type="tel"
                                                    className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                                    id="phoneNumberInput"
                                                    value={phoneNumber}
                                                    onChange={handlePhoneChange}
                                                    onBlur={handlePhoneBlur}
                                                    placeholder="Phone Number"
                                                />
                                                <label
                                                    htmlFor="phoneNumberInput"
                                                    className={`pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out ${
                                                        phoneNumber
                                                            ? "-translate-y-[1.15rem] scale-[0.8] text-primary"
                                                            : ""
                                                    } peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[1.15rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}
                                                >
                                                    Phone Number
                                                </label>
                                                {phoneError && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {phoneError}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        className={`inline-block w-full rounded px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white transition duration-150 ease-in-out ${
                                            isLogin || isRegisterFormValid
                                                ? "bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700"
                                                : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                        disabled={!isLogin && !isRegisterFormValid}
                                    >
                                        {isLogin ? "Sign In" : "Register"}
                                    </button>
                                </form>

                                {/* Toggle between Login and Register */}
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {isLogin
                                            ? "Create an account"
                                            : "Back to Login"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default AuthPage;
