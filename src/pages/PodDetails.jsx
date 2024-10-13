import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScrollToTop } from "../components";
import { FaCheck } from "react-icons/fa";
import Loading from "../components/Loading";
import { useToast } from "../context/ToastContext";
import BookingForm from "./BookingForm";

const PodDetails = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [pod, setPod] = useState(null);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();

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
                        <BookingForm pod={pod} />

                        <div>
                            <h3 className="h3">POD Rules</h3>
                            <p className="mb-6 text-justify">
                                Please follow these rules to experience the best
                                services.
                            </p>
                            <ul className="flex flex-col gap-y-4">
                                {/* Thay thế bằng rules thực tế của pod nếu có */}
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
