import React, { useState, useEffect, useCallback } from "react";
import { ScrollToTop } from "../components";
import BookingHistorySlider from "../components/BookingHistorySlider";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { SiGooglecalendar } from "react-icons/si";
import moment from "moment";
import Loading from "../components/Loading";
import { syncGoogleCalendar } from "../utils/api";
import Pagination from "../components/Pagination";

const BookingHistory = () => {
    const { showToast } = useToast();
    const { user, checkUserLoggedIn, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    const { mutate: sync } = syncGoogleCalendar();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const ITEMS_PER_PAGE = 4;

    const fetchBookings = async (page) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            const response = await fetch(`${API_URL}/api/v1/auth/bookings?page=${page}&limit=${ITEMS_PER_PAGE}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            const data = await response.json();
            setBookings(data.bookings);
            setTotalBookings(data.total);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!(await checkUserLoggedIn())) {
            return navigate("/auth", { state: { from: location.pathname } });
        }
        try {
            const response = await fetch(`${API_URL}/api/v1/google-calendar`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            window.open(
                data.redirect_url,
                "Google-Authenticate",
                "left=50,top=50,width=600,height=800"
            );
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    useEffect(() => {
        const initializeBookingHistory = async () => {
            const isAuthenticated = await checkUserLoggedIn();
            if (!isAuthenticated) {
                navigate("/auth");
                showToast("Please log in to view booking history", "error");
            } else {
                fetchBookings(currentPage);
            }
        };
        const goToCalendar = (event) => {
            if (event.data === "oauth-success") {
                sync();
            }
        };
        initializeBookingHistory();
        window.addEventListener("message", goToCalendar);
        return () => {
            window.removeEventListener("message", goToCalendar);
        };
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading || loading) {
        return <Loading />;
    }

    if (!user) {
        return null; // This will prevent any flash of content before redirect
    }

    const handleViewDetails = (bookingId) => {
        navigate(`/booking-history/${bookingId}`);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="relative min-h-screen bg-gray-100">
            <ScrollToTop />
            <div className="absolute inset-0 z-0">
                <BookingHistorySlider />
            </div>
            <div className="relative z-10 flex items-center justify-center min-h-screen pt-32">
                <div className="container mx-auto px-4">
                    <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
                        <div className="flex justify-around items-center my-5">
                            <h1 className="text-4xl font-primary">
                                Booking History
                            </h1>
                            <button
                                disabled={bookings.length === 0}
                                onClick={handleSync}
                                className="relative flex gap-2 items-center justify-center px-6 py-3 
    bg-white text-blue-600 font-medium rounded-full 
    border-2 border-blue-500 shadow-sm 
    transition-transform transform hover:scale-105 hover:shadow-lg 
    focus:outline-none focus:ring-4 focus:ring-blue-300 
    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {
                                    <SiGooglecalendar className="text-xl text-blue-500" />
                                }{" "}
                                {"Sync to Google Calendar"}
                            </button>
                        </div>
                        {bookings.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Booking Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Details
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking) => (
                                                <tr
                                                    key={booking.booking_id}
                                                    className="bg-white border-b"
                                                >
                                                    <td className="px-6 py-4">
                                                        {moment(
                                                            booking.booking_date
                                                        ).format(
                                                            "DD/MM/YYYY HH:mm"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.booking_status)}`}>
                                                            {booking.booking_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    booking.booking_id
                                                                )
                                                            }
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalBookings}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-xl text-gray-600">
                                    No booking history found.
                                </p>
                                <p className="mt-2 text-gray-500">
                                    You haven't made any bookings yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingHistory;
