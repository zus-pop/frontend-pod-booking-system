import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ScrollToTop } from "../components";
import { FaCheck } from "react-icons/fa";
import Loading from "../components/Loading";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import BookingForm from "./BookingForm";

const PodDetails = () => {
    const { id } = useParams();
    const [pod, setPod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPodDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/pods/${id}`);
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin pod");
                }
                const data = await response.json();
                setPod(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin pod:", error);
                showToast("Không thể lấy thông tin pod", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchPodDetails();
    }, [id, API_URL, showToast]);

    useEffect(() => {
        // Giả lập việc lấy slots từ API
        if (selectedDate) {
            // Trong tương lai, thay thế bằng cuộc gọi API thực tế
            const mockSlots = [
                "09:00 - 10:00",
                "10:00 - 11:00",
                "11:00 - 12:00",
                "13:00 - 14:00",
                "14:00 - 15:00",
            ];
            setAvailableSlots(mockSlots);
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDate]);

    const handleBookNow = () => {
        if (!user) {
            navigate('/auth', { state: { from: location.pathname } });
            return;
        }
        // Xử lý logic đặt phòng ở đây
        showToast("Booking function is under development", "info");
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    if (loading) {
        return <Loading />;
    }

    if (!pod) {
        return <div>Không tìm thấy thông tin pod</div>;
    }

    return (
        <section>
            <ScrollToTop />

            <div
                className="bg-room h-[560px] relative flex justify-center items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${pod.image})` }}
            >
                <div className="absolute w-full h-full bg-black/70" />
                <h1 className="text-6xl text-white z-20 font-primary text-center">
                    {pod.pod_name} Details
                </h1>
            </div>

            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row lg:gap-x-8 h-full py-24">
                    {/* Left side */}
                    <div className="w-full lg:w-[60%] h-full text-justify">
                        <h2 className="h2">{pod.pod_name}</h2>

                        <img
                            className="mb-8"
                            src={pod.image}
                            alt={pod.pod_name}
                        />

                        <div className="mt-12">
                            <h3 className="h3 mb-3">Pod Description</h3>
                            <p className="mb-12">
                                {pod.description || "No description available."}
                            </p>

                            {/* Pod details */}
                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="flex items-center gap-x-3">
                                    <div className="text-base">
                                        Type: {pod.type_id}
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <div className="text-base">
                                        Status:
                                        <span
                                            className={
                                                pod.is_available
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {pod.is_available
                                                ? " Available"
                                                : " Unavailable"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="w-full lg:w-[40%] h-full">
                        {/* Booking section */}
                        <BookingForm pod={pod} onBookNow={handleBookNow} />

                        <div>
                            <h3 className="h3">POD Rules</h3>
                            <p className="mb-6 text-justify">
                                Please follow these rules to experience the best
                                services.
                            </p>
                            <ul className="flex flex-col gap-y-4">
                                {/* Thay thế bằng rules thực tế của pod nếu c */}
                                <li className="flex items-center gap-x-4">
                                    <FaCheck className="text-accent" />
                                    Respect quiet hours
                                </li>
                                <li className="flex items-center gap-x-4">
                                    <FaCheck className="text-accent" />
                                    Keep the pod clean
                                </li>
                                <li className="flex items-center gap-x-4">
                                    <FaCheck className="text-accent" />
                                    No smoking inside the pod
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PodDetails;
