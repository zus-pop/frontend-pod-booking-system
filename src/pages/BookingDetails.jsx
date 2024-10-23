import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollToTop } from "../components";
import {
    FaCheck,
    FaClock,
    FaUser,
    FaCreditCard,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaInfoCircle,
    FaStore,
    FaCoffee,
    FaRegClock,
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
    const [activeTab, setActiveTab] = useState("booking");
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const { mutate: cancelTheBook } = cancelBook();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/bookings/${id}`);
                if (!response.ok) {
                    throw new Error("Unable to fetch booking information");
                }
                const data = await response.json();
                setBooking(data);
            } catch (error) {
                console.error("Error fetching booking information:", error);
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
        if (confirm("Are you sure you want to cancel this booking?")) {
            cancelTheBook(booking_id);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'paid':
                    return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
                case 'failed':
                    return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!booking) {
        return <div>Booking information not found</div>;
    }

    const tabs = [
        { id: "booking", label: "Booking\nInformation", icon: FaCalendarAlt },
        { id: "slot", label: "Slot\nInformation", icon: FaRegClock },
        { id: "user", label: "User\nInformation", icon: FaUser },
        { id: "payment", label: "Payment\nInformation", icon: FaCreditCard },
        { id: "product", label: "Product\nInformation", icon: FaCoffee },
        { id: "store", label: "Store\nInformation", icon: FaStore },
    ];

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
                        {/* Navbar */}
                        <div className="flex justify-between mb-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center p-2 ${
                                        activeTab === tab.id
                                            ? "text-accent border-b-2 border-accent"
                                            : "text-gray-500"
                                    }`}
                                >
                                    <tab.icon className="text-2xl mb-1" />
                                    <span className="text-sm whitespace-pre-line text-center">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            {activeTab === "booking" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Booking Information</h2>
                                    <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                                    <p><strong>Booking Date:</strong> {moment(booking.booking_date).format("DD/MM/YYYY HH:mm")}</p>
                                    <p>
                                        <strong>Status:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.booking_status)}`}>
                                            {booking.booking_status}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {activeTab === "slot" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Slot Information</h2>
                                    <p><strong>Slot ID:</strong> 13</p>
                                    <p><strong>Start Time:</strong> 21/10/2024 08:00</p>
                                    <p><strong>End Time:</strong> 21/10/2024 08:30</p>
                                </div>
                            )}

                            {activeTab === "user" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">User Information</h2>
                                    <p><strong>Name:</strong> {booking.user.user_name}</p>
                                    <p><strong>Email:</strong> {booking.user.email}</p>
                                </div>
                            )}

                            {activeTab === "payment" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
                                    <p><strong>Payment ID:</strong> {booking.payment.payment_id}</p>
                                    <p><strong>Transaction ID:</strong> {booking.payment.transaction_id}</p>
                                    <p><strong>Total Cost:</strong> {booking.payment.total_cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    <p><strong>Payment Date:</strong> {moment(booking.payment.payment_date).format("DD/MM/YYYY HH:mm")}</p>
                                    <p>
                                        <strong>Payment Status:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.payment.payment_status)}`}>
                                            {booking.payment.payment_status}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {activeTab === "product" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
                                    {booking.products.map((product) => (
                                        <div key={product.product_id} className="mb-4">
                                            {product.image && (
                                                <img src={product.image} alt={product.product_name} className="w-full h-48 object-cover mb-2" />
                                            )}
                                            <p><strong>Product Name:</strong> {product.product_name}</p>
                                            <p><strong>Description:</strong> {product.description}</p>
                                            <p><strong>Price:</strong> {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                            <p><strong>Quantity:</strong> {product.quantity}</p>
                                            <p><strong>Total:</strong> {(product.quantity * product.unit_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "store" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Store Information</h2>
                                    <img src={booking.pod.store.image} alt={booking.pod.store.store_name} className="w-full h-48 object-cover mb-4" />
                                    <p><strong>Store Name:</strong> {booking.pod.store.store_name}</p>
                                    <p><strong>Address:</strong> {booking.pod.store.address}</p>
                                    <p><strong>Phone Number:</strong> {booking.pod.store.hotline}</p>
                                </div>
                            )}
                        </div>

                        {booking.booking_status === "Pending" && (
                            <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden border border-accent">
                                <div className="bg-accent text-white p-4">
                                    <h2 className="text-2xl font-semibold flex items-center">
                                        <FaExclamationTriangle className="mr-2" /> Action Required
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="mb-4 text-gray-700">
                                        Your booking is pending. Please choose an action:
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => handlePayment(booking.payment.payment_url)}
                                            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition duration-300 flex-1 flex items-center justify-center"
                                        >
                                            <FaCreditCard className="mr-2" /> Pay Now
                                        </button>
                                        <button
                                            onClick={() => handleCancel(booking.booking_id)}
                                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 flex-1 flex items-center justify-center"
                                        >
                                            <FaExclamationTriangle className="mr-2" /> Cancel Booking
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
                                    <strong>Type:</strong> {booking.pod.type.type_name}
                                </p>
                                <p className="mb-4">
                                    <strong>Capacity:</strong> {booking.pod.type.capacity} people
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingDetails;
