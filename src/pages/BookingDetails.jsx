import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollToTop } from "../components";
import {
    FaCheck,
    FaClock,
    FaUser,
    FaCreditCard,
    FaCalendarAlt,
    FaBox,
    FaExclamationTriangle,
} from "react-icons/fa";
import Loading from "../components/Loading";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import { cancelBook } from "../utils/api";

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const { mutate: cancelTheBook } = cancelBook();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/v1/bookings/${id}`
                );
                if (!response.ok) {
                    throw new Error("Unable to fetch booking information");
                }
                const data = await response.json();
                setBooking(data);
            } catch (error) {
                console.error("Error fetching booking details:", error);
                showToast("Unable to fetch booking information", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id, API_URL, showToast]);

    const handlePayment = async (payment_url) => {
        window.open(payment_url);
    };

    const handleCancel = async (booking_id) => {
        if (confirm("Are you sure want to cancel?")) {
            cancelTheBook(booking_id);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!booking) {
        return (
            <div className="container mx-auto py-24 text-center">
                Booking information not found
            </div>
        );
    }

    return (
        <section className="bg-gray-100 min-h-screen">
            <ScrollToTop />
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    Booking Details
                </h1>
                <div className="flex flex-col lg:flex-row lg:gap-x-8">
                    {/* Left side - Booking Details */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                            <div className="bg-blue-600 text-white p-4">
                                <h2 className="text-2xl font-semibold">
                                    Booking Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="flex items-center">
                                    <FaCalendarAlt className="mr-2 text-blue-600" />{" "}
                                    <strong>Booking ID:</strong>{" "}
                                    {booking.booking_id}
                                </p>
                                <p className="flex items-center">
                                    <FaClock className="mr-2 text-blue-600" />{" "}
                                    <strong>Booking Date:</strong>{" "}
                                    {moment(booking.booking_date).format(
                                        "DD/MM/YYYY HH:mm"
                                    )}
                                </p>
                                <p className="flex items-center">
                                    <FaCheck className="mr-2 text-blue-600" />{" "}
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`ml-2 px-2 py-1 rounded ${
                                            booking.booking_status ===
                                            "Confirmed"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-yellow-200 text-yellow-800"
                                        }`}
                                    >
                                        {booking.booking_status}
                                    </span>
                                </p>
                                {booking.rating && (
                                    <>
                                        <p className="flex items-center">
                                            <strong>Rating:</strong>{" "}
                                            {booking.rating} ⭐
                                        </p>
                                        <p className="flex items-center">
                                            <strong>Comment:</strong> "
                                            {booking.comment}"
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                            <div className="bg-green-600 text-white p-4">
                                <h2 className="text-2xl font-semibold">
                                    User Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="flex items-center">
                                    <FaUser className="mr-2 text-green-600" />{" "}
                                    <strong>Name:</strong>{" "}
                                    {booking.user.user_name}
                                </p>
                                <p className="flex items-center">
                                    <FaUser className="mr-2 text-green-600" />{" "}
                                    <strong>Email:</strong> {booking.user.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                            <div className="bg-purple-600 text-white p-4">
                                <h2 className="text-2xl font-semibold">
                                    Payment Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="flex items-center">
                                    <FaCreditCard className="mr-2 text-purple-600" />{" "}
                                    <strong>Payment ID:</strong>{" "}
                                    {booking.payment.payment_id}
                                </p>
                                <p className="flex items-center">
                                    <FaCreditCard className="mr-2 text-purple-600" />{" "}
                                    <strong>Transaction ID:</strong>{" "}
                                    {booking.payment.transaction_id}
                                </p>
                                <p className="flex items-center">
                                    <FaCreditCard className="mr-2 text-purple-600" />{" "}
                                    <strong>Total Cost:</strong>{" "}
                                    {Number(
                                        booking.payment.total_cost
                                    ).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </p>
                                <p className="flex items-center">
                                    <FaCalendarAlt className="mr-2 text-purple-600" />{" "}
                                    <strong>Payment Date:</strong>{" "}
                                    {moment(
                                        booking.payment.payment_date
                                    ).format("DD/MM/YYYY HH:mm")}
                                </p>
                                <p className="flex items-center">
                                    <FaCheck className="mr-2 text-purple-600" />{" "}
                                    <strong>Payment Status:</strong>{" "}
                                    <span
                                        className={`ml-2 px-2 py-1 rounded ${
                                            booking.payment.payment_status ===
                                            "Paid"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-red-200 text-red-800"
                                        }`}
                                    >
                                        {booking.payment.payment_status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                            <div className="bg-yellow-600 text-white p-4">
                                <h2 className="text-2xl font-semibold">
                                    Time Slot Information
                                </h2>
                            </div>
                            <div className="p-6">
                                {booking.slots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 p-4 bg-yellow-50 rounded-lg"
                                    >
                                        <p className="font-semibold text-lg mb-2">
                                            Time Slot {index + 1}:
                                        </p>
                                        <p className="flex items-center">
                                            <FaClock className="mr-2 text-yellow-600" />{" "}
                                            Start:{" "}
                                            {moment(slot.start_time).format(
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </p>
                                        <p className="flex items-center">
                                            <FaClock className="mr-2 text-yellow-600" />{" "}
                                            End:{" "}
                                            {moment(slot.end_time).format(
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </p>
                                        <p className="flex items-center">
                                            <FaCreditCard className="mr-2 text-yellow-600" />{" "}
                                            Price:{" "}
                                            {Number(slot.price).toLocaleString(
                                                "en-US",
                                                {
                                                    style: "currency",
                                                    currency: "VND",
                                                }
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                            <div className="bg-red-600 text-white p-4">
                                <h2 className="text-2xl font-semibold">
                                    Ordered Products
                                </h2>
                            </div>
                            <div className="p-6">
                                {booking.products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 p-4 bg-red-50 rounded-lg"
                                    >
                                        <p className="font-semibold text-lg mb-2">
                                            {product.product_name}
                                        </p>
                                        <p className="flex items-center">
                                            <FaBox className="mr-2 text-red-600" />{" "}
                                            Quantity: {product.quantity}
                                        </p>
                                        <p className="flex items-center">
                                            <FaCreditCard className="mr-2 text-red-600" />{" "}
                                            Price:{" "}
                                            {Number(
                                                product.unit_price
                                            ).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {booking.booking_status === "Pending" && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                                <div className="bg-orange-600 text-white p-4">
                                    <h2 className="text-2xl font-semibold flex items-center">
                                        <FaExclamationTriangle className="mr-2" />{" "}
                                        Actions Required
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="mb-4 text-gray-700">
                                        Your booking is pending. Please choose
                                        an action:
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() =>
                                                handlePayment(
                                                    booking.payment.payment_url
                                                )
                                            }
                                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 flex-1 flex items-center justify-center"
                                        >
                                            <FaCreditCard className="mr-2" />{" "}
                                            Pay Now
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleCancel(booking.booking_id)
                                            }
                                            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 flex-1 flex items-center justify-center"
                                        >
                                            <FaExclamationTriangle className="mr-2" />{" "}
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - Pod Details */}
                    <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden sticky top-24">
                            <img
                                src={booking.pod.image}
                                alt={booking.pod.pod_name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">
                                    {booking.pod.pod_name}
                                </h2>
                                <p className="mb-4 text-gray-600">
                                    {booking.pod.description}
                                </p>
                                <p className="mb-2">
                                    <strong>Type:</strong>{" "}
                                    {booking.pod.type.type_name}
                                </p>
                                <p className="mb-4">
                                    <strong>Capacity:</strong>{" "}
                                    {booking.pod.type.capacity} people
                                </p>
                                <h3 className="text-xl font-semibold mt-4 mb-2">
                                    Utilities
                                </h3>
                                <ul className="space-y-2">
                                    {booking.pod.utilities.map((utility) => (
                                        <li
                                            key={utility.utility_id}
                                            className="flex items-center"
                                        >
                                            <FaCheck className="text-green-500 mr-2" />
                                            {utility.utility_name}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className="text-xl font-semibold mt-4 mb-2">
                                    Store Information
                                </h3>
                                <p className="mb-1">
                                    <strong>Store Name:</strong>{" "}
                                    {booking.pod.store.store_name}
                                </p>
                                <p className="mb-1">
                                    <strong>Address:</strong>{" "}
                                    {booking.pod.store.address}
                                </p>
                                <p>
                                    <strong>Hotline:</strong>{" "}
                                    {booking.pod.store.hotline}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingDetails;
