import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components";
import { useAuth } from "../context/AuthContext";
import { useStoreContext } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { initializeSocket } from "../utils/socket";
import LoginForm from './LoginForm';

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
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);
    const [allNotifications, setAllNotifications] = useState([]);
    const [isViewingAll, setIsViewingAll] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const closeDropdown = useCallback(() => {
        setShowDropdown(false);
    }, [user]);
    useEffect(() => {
        const socket = initializeSocket(localStorage.getItem("token"));
        const callback = () => {
            loadInitialNotifications();
        };
        if (socket) {
            socket.on("notification", callback);
        }
        return () => {
            if (socket) {
                socket.off("notification");
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                location.pathname === "/about" || 
                location.pathname === "/policy" ||
                
                location.pathname === "/booking-history" ||
                location.pathname.startsWith("/booking-history/")
            ) {
                setHeader(true);
            } else if (
                location.pathname === "/" || 
                location.pathname.startsWith("/store/") ||
                location.pathname.startsWith("/pod/") ||
                location.pathname === "/solutions" ||
                location.pathname === "/places"
            ) {
                setHeader(window.scrollY > 50);
            }
        };

        if (
            location.pathname === "/about" || 
            location.pathname === "/policy" ||
            location.pathname === "/auth" ||
            location.pathname === "/booking-history" ||
            location.pathname.startsWith("/booking-history/")
        ) {
            setHeader(true);
        } else if (location.pathname !== "/booking-history") {
            setHeader(window.scrollY > 50);
        }

        const handleClickOutside = (event) => {
            if (
                showDropdown &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
            if (
                showNotifications &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('button[aria-label="Toggle mobile menu"]')
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            loadInitialNotifications();
        }
    }, [user]);

    const fetchNotifications = async (page = 1, limit = 10) => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/v1/auth/notifications?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return null;
        }
    };

    const loadInitialNotifications = async () => {
        const data = await fetchNotifications();
        if (data) {
            setNotifications(data.notifications);
            setTotalNotifications(data.total);
            updateUnreadCount(data.notifications);
        }
    };

    const loadAllNotifications = async () => {
        const data = await fetchNotifications(1, totalNotifications);
        if (data) {
            setAllNotifications(data.notifications);
            updateUnreadCount(data.notifications);
            setIsViewingAll(true);
        }
    };

    const updateUnreadCount = (notificationsList) => {
        const unreadNotifications = notificationsList.filter(
            (notification) => !notification.is_read
        );
        setUnreadCount(unreadNotifications.length);
    };

    const toggleNotifications = (e) => {
        e.stopPropagation();
        if (showDropdown) {
            setShowDropdown(false);
        }
        setShowNotifications(prev => !prev);
    };

    const handleLoginClick = () => {
        if (showNotifications) {
            setShowNotifications(false);
        }
        setShowLoginForm(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        showToast("Logged out successfully", "success");

        // Kiểm tra nếu đang ở trang booking history hoặc booking detail
        if (
            location.pathname === "/booking-history" ||
            location.pathname.startsWith("/booking-details")
        ) {
            navigate("/");
            showToast("Please log in to view booking information", "info");
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        if (showNotifications) {
            setShowNotifications(false);
        }
        setShowDropdown(prev => !prev);
    };

    const isDarkHeader = 
        location.pathname === "/" || 
        location.pathname.startsWith("/store/") ||
        location.pathname.startsWith("/pod/") ||
        location.pathname === "/solutions" ||
        location.pathname === "/places";

    const handleViewAllNotifications = () => {
        loadAllNotifications();
    };

    const handleReadNotification = async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error("Notification ID is undefined");
            }

            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/v1/auth/notifications/${notificationId}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to mark notification as read"
                );
            }

            // Sau khi cập nhật trạng thái đã đọc
            const updatedNotifications = isViewingAll
                ? allNotifications
                : notifications;
            const updatedList = updatedNotifications.map((notification) =>
                notification.notification_id === notificationId
                    ? { ...notification, is_read: true }
                    : notification
            );
            if (isViewingAll) {
                setAllNotifications(updatedList);
            } else {
                setNotifications(updatedList);
            }
            updateUnreadCount(updatedList);
        } catch (error) {
            console.error("Error marking notification as read:", error);
            showToast("Failed to mark notification as read", "error");
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        
        if (location.pathname === '/') {
            closeMobileMenu();
            return;
        }
        
        navigate('/');
        resetStoreFilterData();
        closeMobileMenu();
    };

    const handleLoginSuccess = async (token) => {
        await login(token);
        setShowLoginForm(false);
        
        // Kiểm tra xem có dữ liệu booking tạm thời không
        const tempBookingData = localStorage.getItem('tempBookingData');
        if (tempBookingData) {
            const bookingData = JSON.parse(tempBookingData);
            navigate(`/pod/${bookingData.pod_id}`, { replace: true });
        }
    };

    return (
        <>
            <header
                ref={headerRef}
                className={`${
                    header ? "bg-white py-6 shadow-lg" : "py-8"
                } fixed z-50 w-full transition-all duration-300`}
            >
                <div className="container mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-4 lg:gap-y-0 px-4">
                    {/* Logo và Mobile Menu Button */}
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            className="flex items-center"
                            onClick={handleHomeClick}
                        >
                            <Logo isDark={header || !isDarkHeader} />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-2xl p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className={isDarkHeader && !header ? "text-white" : "text-primary"} />
                            ) : (
                                <FaBars className={isDarkHeader && !header ? "text-white" : "text-primary"} />
                            )}
                        </button>
                    </div>

                    {/* Navigation menu - responsive */}
                    <nav
                        ref={mobileMenuRef}
                        className={`${
                            isMobileMenuOpen ? "flex flex-col" : "hidden"
                        } lg:flex lg:flex-row lg:items-center lg:gap-x-4 ${
                            isMobileMenuOpen ? "bg-white shadow-lg absolute top-full left-0 w-full" : ""
                        } lg:static lg:bg-transparent lg:shadow-none py-4 lg:py-0 px-4 lg:px-0`}
                    >
                        {/* Menu Items */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-x-4 w-full">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className={`${
                                    isMobileMenuOpen ? "text-primary" : 
                                    (isDarkHeader && !header ? "text-white" : "text-primary")
                                } hover:text-accent py-3 lg:py-0 border-b lg:border-none text-center lg:text-left`}
                            >
                                HOME
                            </Link>
                            <Link
                                to="/about"
                                onClick={closeMobileMenu}
                                className={`${
                                    isMobileMenuOpen ? "text-primary" : 
                                    (isDarkHeader && !header ? "text-white" : "text-primary")
                                } hover:text-accent py-3 lg:py-0 border-b lg:border-none text-center lg:text-left`}
                            >
                                ABOUT
                            </Link>
                            <Link
                                to="/policy"
                                onClick={closeMobileMenu}
                                className={`${
                                    isMobileMenuOpen ? "text-primary" : 
                                    (isDarkHeader && !header ? "text-white" : "text-primary")
                                } hover:text-accent py-3 lg:py-0 border-b lg:border-none text-center lg:text-left`}
                            >
                                POLICY
                            </Link>
                            <Link
                                to="/solutions"
                                onClick={closeMobileMenu}
                                className={`${
                                    isMobileMenuOpen ? "text-primary" : 
                                    (isDarkHeader && !header ? "text-white" : "text-primary")
                                } hover:text-accent py-3 lg:py-0 border-b lg:border-none text-center lg:text-left`}
                            >
                                SOLUTIONS
                            </Link>
                            <Link
                                to="/places"
                                onClick={closeMobileMenu}
                                className={`${
                                    isMobileMenuOpen ? "text-primary" : 
                                    (isDarkHeader && !header ? "text-white" : "text-primary")
                                } hover:text-accent py-3 lg:py-0 border-b lg:border-none text-center lg:text-left`}
                            >
                                PLACES
                            </Link>

                            {/* Notifications section */}
                            {user && (
                                <div className="relative py-3 lg:py-0 text-center lg:text-left">
                                    <button
                                        onClick={toggleNotifications}
                                        className={`${
                                            isMobileMenuOpen ? "text-primary" :
                                            (isDarkHeader && !header
                                                ? "text-white"
                                                : "text-primary")
                                        } transition relative p-2`}
                                    >
                                        <FaBell className="text-2xl" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNotifications && (
                                        <div
                                            ref={notificationRef}
                                            className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                                                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                                                    Notifications
                                                </h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                                {(isViewingAll
                                                    ? allNotifications
                                                    : notifications
                                                ).length > 0 ? (
                                                    (isViewingAll
                                                        ? allNotifications
                                                        : notifications
                                                    ).map((notification) => (
                                                        <div
                                                            key={
                                                                notification.notification_id
                                                            }
                                                            className={`px-4 py-3 border-b border-gray-100 ${
                                                                notification.is_read
                                                                    ? "bg-white"
                                                                    : "bg-blue-100"
                                                            } hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer`}
                                                            onClick={() =>
                                                                handleReadNotification(
                                                                    notification.notification_id
                                                                )
                                                            }
                                                        >
                                                            <p className="text-sm font-sans text-gray-800 tracking-wide capitalize mb-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs font-sans text-gray-500 capitalize">
                                                                {moment(
                                                                    notification.created_at
                                                                ).format(
                                                                    "MMMM Do YYYY, HH:mm:s"
                                                                )}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-center text-gray-500 font-sans">
                                                        No new notifications
                                                    </div>
                                                )}
                                            </div>
                                            {!isViewingAll &&
                                                notifications.length >= 10 && (
                                                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                                                        <button
                                                            className="text-xs font-sans text-accent hover:underline w-full text-center capitalize tracking-wide"
                                                            onClick={
                                                                handleViewAllNotifications
                                                            }
                                                        >
                                                            View all notifications
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Login/User section */}
                            <div className="py-3 lg:py-0 text-center lg:text-left">
                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className={`${
                                                isMobileMenuOpen ? "text-primary border-primary" :
                                                (isDarkHeader && !header
                                                    ? "text-white border-white"
                                                    : "text-primary border-primary")
                                            } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent w-full lg:w-auto text-left`}
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
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize font-tertiary tracking-[1px]"
                                                    onClick={closeDropdown}
                                                >
                                                    Booking history
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLogout();
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-tertiary tracking-[1px]"
                                                >
                                                    Log out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLoginClick}
                                        className={`${
                                            isMobileMenuOpen ? "text-primary border-primary" :
                                            (isDarkHeader && !header
                                                ? "text-white border-white"
                                                : "text-primary border-primary")
                                        } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent w-full lg:w-auto`}
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Thêm LoginForm Modal */}
            {showLoginForm && (
                <LoginForm
                    onClose={() => setShowLoginForm(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
};

export default Header;
