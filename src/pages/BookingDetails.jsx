import React, { useState, useEffect, useRef } from "react";
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
    FaStar,
} from "react-icons/fa";
import Loading from "../components/Loading";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import { cancelBook } from "../utils/api";
import { MdClose } from "react-icons/md";

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("booking");
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const { mutate: cancelTheBook } = cancelBook();
    const { user, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();

    // Thêm state để quản lý việc hiển thị modal sản phẩm và lưu trữ sản phẩm
    const [selectedSlotProducts, setSelectedSlotProducts] = useState([]);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    // Thêm ref cho modal content
    const modalContentRef = useRef(null);

    // Thêm các state mới sau state showProductsModal
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Thêm state mới để lưu trữ feedback hiện tại
    const [existingFeedback, setExistingFeedback] = useState(null);

    // Thêm state để quản lý modal xác nhận hủy
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate('/');
            showToast('Please login to view booking information', 'info');
        }
    }, [user, isAuthLoading, navigate, showToast]);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Unable to fetch booking information");
                }
                const data = await response.json();
                setBooking(data);
                // Lưu feedback nếu có
                if (data.rating || data.comment) {
                    setExistingFeedback({
                        rating: data.rating,
                        comment: data.comment
                    });
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
                showToast("Unable to fetch booking details", "error");
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthLoading) {
            fetchBookingDetails();
        }
    }, [id, API_URL, showToast, user, isAuthLoading]);

    useEffect(() => {
        const fetchInitialProducts = async () => {
            if (booking && booking.slots && booking.slots.length > 0) {
                try {
                    const firstSlot = booking.slots[0];
                    const response = await fetch(
                        `${API_URL}/api/v1/bookings/${booking.booking_id}/slots/${firstSlot.slot_id}/products`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Unable to fetch products");
                    }
                    const data = await response.json();
                    setSelectedSlotProducts(data);
                } catch (error) {
                    console.error("Error fetching initial products:", error);
                }
            }
        };

        if (booking) {
            fetchInitialProducts();
        }
    }, [booking, API_URL]);

    const handlePayment = async (payment_url) => {
        if (!payment_url) {
            showToast("Payment URL not found", "error");
            return;
        }
        window.location.href = payment_url;
    };

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            
            if (status) {
                try {
                    const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Unable to fetch booking information");
                    }
                    const data = await response.json();
                    setBooking(data);
                    
                    if (status === 'success') {
                        showToast("Payment successful! Your booking has been confirmed.", "success");
                    } else if (status === 'failed') {
                        showToast("Payment failed. Please try again.", "error");
                    }
                    
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (error) {
                    console.error("Error fetching booking details:", error);
                    showToast("Unable to fetch booking details", "error");
                }
            }
        };

        checkPaymentStatus();
    }, [id, API_URL, showToast]);

    const handleCancel = (booking_id) => {
        setBookingToCancel(booking_id);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            cancelTheBook(bookingToCancel);
            setShowCancelModal(false);
            setBookingToCancel(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'complete':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Sửa lại hàm tính tổng tiền
    const calculateTotalAmount = (payments) => {
        if (!payments || !Array.isArray(payments) || payments.length === 0) {
            return 0;
        }
        
        // Tính tổng từ tất cả các payment
        return payments.reduce((total, payment, index) => {
            // Nếu là payment thứ 2 (index === 1), sử dụng giá từ products
            if (index === 1 && selectedSlotProducts.length > 0) {
                return total + calculateProductTotal(selectedSlotProducts);
            }
            return total + payment.total_cost;
        }, 0);
    };

    // Sửa lại hàm fetchSlotProducts
    const fetchSlotProducts = async (bookingId, slotId) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/bookings/${bookingId}/slots/${slotId}/products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Unable to fetch products");
            }
            const data = await response.json();
            setSelectedSlotProducts(data);
            setShowProductsModal(true);
        } catch (error) {
            console.error("Error fetching products:", error);
            setSelectedSlotProducts([]);
            setShowProductsModal(true);
        }
    };

    // Thêm hàm tính tổng tiền sản phẩm
    const calculateProductTotal = (products) => {
        if (!products || !Array.isArray(products)) {
            return 0;
        }
        return products.reduce((total, product) => {
            return total + (product.unit_price * product.quantity);
        }, 0);
    };

    // Thêm hàm xử lý click outside
    const handleModalClick = (event) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
            setShowProductsModal(false);
        }
    };

    // Thêm hàm submitFeedback sau hàm handleModalClick
    const submitFeedback = async () => {
        if (rating === 0) {
            showToast("Please select a rating", "error");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/v1/bookings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    rating,
                    comment: comment.trim() || null
                })
            });

            if (!response.ok) {
                throw new Error("Unable to submit feedback");
            }

            // Cập nhật existingFeedback sau khi gửi thành công
            setExistingFeedback({
                rating,
                comment: comment.trim() || null
            });

            showToast("Thank you for your feedback!", "success");
            setShowFeedbackModal(false);
            setRating(0);
            setComment('');
        } catch (error) {
            console.error("Error submitting feedback:", error);
            showToast("Unable to submit feedback", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Thêm hàm getStatusStyle để xử lý style cho status
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'not yet':
                return 'bg-yellow-100 text-gray-800';
            case 'checked in':
                return 'bg-green-100 text-green-800';
            case 'checked out':
                return 'bg-purple-100 text-purple-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'refunded':
            case 'confirmed':
            case 'complete':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isAuthLoading || loading) {
        return <Loading />;
    }

    if (!user) {
        return null; // Hoặc có thể hiển thị một thông báo yêu cầu đăng nhập
    }

    if (!booking) {
        return <div>Booking information not found</div>;
    }

    const tabs = [
        { id: "booking", label: "Booking\nInformation", icon: FaCalendarAlt },
        { id: "slot", label: "Slot\nInformation", icon: FaRegClock },
        { id: "user", label: "User\nInformation", icon: FaUser },
        { id: "payment", label: "Payment\nInformation", icon: FaCreditCard },
        { id: "store", label: "Store\nInformation", icon: FaStore },
    ];

    return (
        <section className="bg-gray-100 min-h-screen">
            <ScrollToTop />
            <div className="container mx-auto py-32 px-4">
                <h1 className="font-primary text-[45px] mb-8 text-center">
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
                                    <p>
                                        <strong>Total Amount:</strong>{" "}
                                        <span className="text-yellow-600 font-semibold">
                                            {calculateTotalAmount(booking.payment).toLocaleString('vi-VN', { 
                                                style: 'currency', 
                                                currency: 'VND' 
                                            })}
                                        </span>
                                    </p>

                                    {/* Hiển thị feedback hoặc nút feedback tùy điều kiện */}
                                    {booking.booking_status.toLowerCase() === "complete" && (
                                        <>
                                            {existingFeedback ? (
                                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                                    <h3 className="text-lg font-semibold mb-3">Your Feedback</h3>
                                                    <div className="flex items-center mb-2">
                                                        {[...Array(5)].map((_, index) => (
                                                            <FaStar
                                                                key={index}
                                                                className="mr-1"
                                                                size={24}
                                                                color={index < existingFeedback.rating ? "#ffc107" : "#e4e5e9"}
                                                            />
                                                        ))}
                                                    </div>
                                                    {existingFeedback.comment && (
                                                        <p className="text-gray-600 mt-2">
                                                            "{existingFeedback.comment}"
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowFeedbackModal(true)}
                                                    className="mt-4 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2"
                                                >
                                                    <FaStar /> Rate your experience
                                                </button>
                                            )}
                                        </>
                                        
                                    )}
                                </div>
                            )}

                            {activeTab === "slot" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-4">Slot Information</h2>
                                    {booking.slots && booking.slots.length > 0 ? (
                                        // Nhóm và sắp xếp các slot theo ngày
                                        Object.entries(
                                            booking.slots.reduce((groups, slot) => {
                                                const date = moment(slot.start_time).format('DD/MM/YYYY');
                                                if (!groups[date]) {
                                                    groups[date] = [];
                                                }
                                                groups[date].push(slot);
                                                return groups;
                                            }, {})
                                        )
                                        .sort(([dateA], [dateB]) => moment(dateA, 'DD/MM/YYYY').diff(moment(dateB, 'DD/MM/YYYY')))
                                        .map(([date, dateSlots]) => (
                                            <div key={date} className="mb-8">
                                                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                                    <FaCalendarAlt className="text-accent" />
                                                    {date}
                                                </h3>
                                                <div className="space-y-4">
                                                    {dateSlots.map((slot, index) => (
                                                        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="text-lg font-semibold">Slot Information</h4>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                    slot.status.toLowerCase() === 'refunded' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : getStatusStyle(slot.status)
                                                                }`}>
                                                                    {slot.status}
                                                                </span>
                                                            </div>
                                                            <p><strong>Slot ID:</strong> {slot.slot_id}</p>
                                                            <p><strong>Start Time:</strong> {moment(slot.start_time).format("DD/MM/YYYY HH:mm")}</p>
                                                            <p><strong>End Time:</strong> {moment(slot.end_time).format("DD/MM/YYYY HH:mm")}</p>
                                                            <p>
                                                                <strong>Price:</strong>{" "}
                                                                <span className="text-yellow-600 font-semibold">
                                                                    {slot.price.toLocaleString('vi-VN', { 
                                                                        style: 'currency', 
                                                                        currency: 'VND' 
                                                                    })}
                                                                </span>
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSlotId(slot.slot_id);
                                                                    fetchSlotProducts(booking.booking_id, slot.slot_id);
                                                                }}
                                                                className="mt-2 flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                                                            >
                                                                <FaCoffee /> Ordered Products
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No slot information available for this booking.</p>
                                    )}
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
                                    {booking.payment && booking.payment.length > 0 ? (
                                        booking.payment.map((payment) => (
                                            <div key={payment.payment_id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                                                <h3 className="text-xl font-semibold mb-2">
                                                    {payment.payment_for === 'Slot' ? 'Slot Payment' : 'Product Payment'}
                                                </h3>
                                                <p><strong>Payment ID:</strong> {payment.payment_id}</p>
                                                <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>
                                                <p>
                                                    <strong>Total Cost:</strong>{" "}
                                                    <span className="text-yellow-600 font-semibold">
                                                        {(payment.payment_for === 'Product' && selectedSlotProducts.length > 0 
                                                            ? calculateProductTotal(selectedSlotProducts) 
                                                            : payment.total_cost
                                                        ).toLocaleString('vi-VN', { 
                                                            style: 'currency', 
                                                            currency: 'VND' 
                                                        })}
                                                    </span>
                                                </p>
                                                <p><strong>Payment Date:</strong> {moment(payment.payment_date).format("DD/MM/YYYY HH:mm")}</p>
                                                <p className="mb-2">
                                                    <strong>Payment Status:</strong> 
                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(payment.payment_status)}`}>
                                                        {payment.payment_status}
                                                    </span>
                                                </p>
                                                
                                                {/* Thêm thông báo hoàn tiền nếu payment được refunded */}
                                                {payment.payment_status.toLowerCase() === 'refunded' && (
                                                    <div className="mt-3 p-3 bg-[#aa8453]/10 border border-[#aa8453]/30 rounded-lg">
                                                        <p className="text-[#aa8453] flex items-center">
                                                            <FaInfoCircle className="mr-2" />
                                                            {/* Sử dụng refunded_amount từ API thay vì tính toán */}
                                                            {(() => {
                                                                const refundedSlots = booking.slots.filter(slot => 
                                                                    slot.status.toLowerCase() === 'refunded'
                                                                );
                                                                const slotIds = refundedSlots.map(slot => slot.slot_id);
                                                                
                                                                return `Refunded amount from ${refundedSlots.length > 1 ? 'slots' : 'slot'} ${slotIds.join(' and ')}: `
                                                            })()}
                                                            <span className="font-semibold ml-1">
                                                                {payment.refunded_amount.toLocaleString('vi-VN', { 
                                                                    style: 'currency', 
                                                                    currency: 'VND' 
                                                                })}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No payment information available.</p>
                                    )}
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
                                            onClick={() => handlePayment(booking.payment[booking.payment.length - 1].payment_url)}
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

            {showProductsModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    onClick={handleModalClick}
                >
                    <div 
                        ref={modalContentRef} 
                        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Ordered Products for Slot {selectedSlotId}</h3>
                            <button
                                onClick={() => setShowProductsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>
                        {selectedSlotProducts.length > 0 ? (
                            <>
                                {selectedSlotProducts.map((product) => (
                                    <div key={product.product_id} className="mb-4 p-4 bg-gray-50 rounded-lg flex gap-4">
                                        {product.image && (
                                            <div className="w-1/3">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.product_name} 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <h4 className="text-lg font-semibold">{product.product_name}</h4>
                                            <p className="text-gray-600">{product.description}</p>
                                            <div className="space-y-1">
                                                <p>
                                                    <strong>Price:</strong>{" "}
                                                    <span className="text-yellow-600 font-semibold">
                                                        {product.unit_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                </p>
                                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                                <p>
                                                    <strong>Total:</strong>{" "}
                                                    <span className="text-yellow-600 font-semibold">
                                                        {(product.unit_price * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xl font-semibold">
                                        Total Amount:{" "}
                                        <span className="text-yellow-600">
                                            {calculateProductTotal(selectedSlotProducts).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <FaCoffee className="text-4xl text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg">No products have been added to this slot yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Service Feedback</h3>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            className="hidden"
                                            value={ratingValue}
                                            onClick={() => setRating(ratingValue)}
                                        />
                                        <FaStar
                                            className="cursor-pointer transition-colors"
                                            size={32}
                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        <textarea
                            placeholder="Share your experience (optional)"
                            className="w-full p-3 border rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={submitFeedback}
                                disabled={isSubmitting}
                                className="flex-1 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-400"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Cancel Booking</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleConfirmCancel}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Confirm Cancel
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Keep Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BookingDetails;
