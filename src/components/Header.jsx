import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogoDark, LogoWhite } from "../assets";
import { useAuth } from "../context/AuthContext";
import { useStoreContext } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";

const Header = () => {
    const { resetStoreFilterData } = useStoreContext();
    const [header, setHeader] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { showToast } = useToast();
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const headerRef = useRef(null);

    const closeDropdown = useCallback(() => {
        setShowDropdown(false);
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                location.pathname !== "/auth" &&
                location.pathname !== "/booking-details"
            ) {
                setHeader(window.scrollY > 50);
            }
        };

        const handleClickOutside = (event) => {
            if (
                showDropdown &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [location.pathname, showDropdown]);

    const handleLoginClick = () => {
        navigate("/auth", { state: { from: location.pathname } });
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        showToast("Logged out successfully", "success");
        if (location.pathname === "/booking-history") {
            navigate("/");
            showToast("Please log in to view booking history", "info");
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setShowDropdown((prev) => !prev);
    };

    const isDarkHeader =
        !header &&
        (location.pathname === "/" ||
            location.pathname === "/about" ||
            location.pathname === "/solutions" ||
            location.pathname === "/places" ||
            location.pathname === "/contact") &&
        location.pathname !== "/auth";
    const isAuthPage = location.pathname === "/auth";

    return (
        <header
            ref={headerRef}
            className={`${
                isAuthPage
                    ? "bg-white py-6 shadow-lg"
                    : isDarkHeader
                    ? "bg-transparent py-8"
                    : "bg-white py-6 shadow-lg"
            } fixed z-50 w-full transition-all duration-300`}
        >
            <div className="container mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-y-6 lg:gap-y-0">
                {/* Logo */}
                <Link to="/" onClick={resetStoreFilterData}>
                    {isDarkHeader ? (
                        <LogoWhite className="w-[160px]" />
                    ) : (
                        <LogoDark className="w-[160px]" />
                    )}
                </Link>

                {/* Nav */}
                <nav
                    className={`${isDarkHeader ? "text-white" : "text-primary"}
        flex gap-x-4 lg:gap-x-8 font-tertiary tracking-[3px] text-[15px] items-center uppercase`}
                >
                    <Link to="/" className="transition hover:text-accent">
                        Home
                    </Link>
                    <Link to="/about" className="transition hover:text-accent">
                        About
                    </Link>
                    <Link
                        to="/solutions"
                        className="transition hover:text-accent"
                    >
                        Solutions
                    </Link>
                    <Link to="/places" className="transition hover:text-accent">
                        Places
                    </Link>
                    <Link
                        to="/contact"
                        className="transition hover:text-accent"
                    >
                        Contact
                    </Link>
                    {/* Nút đăng nhập hoặc tên người dùng */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className={`${
                                    isDarkHeader
                                        ? "text-white border-white"
                                        : "text-primary border-primary"
                                } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
                            >
                                {user.user_name || user.email}
                            </button>
                            {showDropdown && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                                    onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan truyền khi click vào dropdown
                                >
                                    <Link
                                        to="/booking-history"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        Booking History
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLogout();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className={`${
                                isDarkHeader
                                    ? "text-white border-white"
                                    : "text-primary border-primary"
                            } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
                        >
                            Login
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
