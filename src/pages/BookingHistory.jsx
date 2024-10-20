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

const BookingHistory = () => {
    const { showToast } = useToast();
    const { user, checkUserLoggedIn, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    const { mutate: sync } = syncGoogleCalendar();

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            const response = await fetch(`${API_URL}/api/v1/auth/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            const data = await response.json();
            setBookings(data);
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
        const response = await fetch(`${API_URL}/api/v1/google-calendar`);
        if (response.ok) {
            const data = await response.json();
            window.open(
                data.redirect_url,
                "Google-Authenticate",
                "left=50,top=50,width=600,height=800"
            );
            window.addEventListener(
                "message",
                async (event) => {
                    if (event.data === "oauth-success") {
                        sync();
                    }
                },
                { once: true }
            );
        }
    };

    useEffect(() => {
        const initializeBookingHistory = async () => {
            const isAuthenticated = await checkUserLoggedIn();
            if (!isAuthenticated) {
                navigate("/auth");
                showToast("Please log in to view booking history", "error");
            } else {
                fetchBookings();
            }
        };

        initializeBookingHistory();
    }, []);

    if (isLoading || loading) {
        return <Loading />;
    }

    if (!user) {
        return null; // This will prevent any flash of content before redirect
    }

    const handleViewDetails = (bookingId) => {
        navigate(`/booking-history/${bookingId}`);
    };

    return (
        <section className="relative min-h-screen">
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
                                                    {booking.booking_status}
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
