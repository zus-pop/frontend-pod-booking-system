import { useMutation, useQueries } from "@tanstack/react-query";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";


export const getSlotsByPodIdAndDate = (pod_id, dates) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const results = useQueries({
        queries: dates.map((date) => ({
            queryKey: ['slot', pod_id, date],
            queryFn: async () => {
                if (date === null || date === undefined) {
                    return [];
                }
                const response = await fetch(`${API_URL}/api/v1/slots/?pod_id=${pod_id}&date=${date}`);
                if (!response.ok) {
                    console.log("No slots found");
                    return [];
                }
                return await response.json();
            },
        })),
        combine: (result) => (
            result.map(({ data: slots, isSuccess }) => {
                if (isSuccess) {
                    return slots.map(slot => ({
                        label: `${moment(slot.start_time).format("HH:mm:ss")} - ${moment(slot.end_time).format("HH:mm:ss")} | ${Number(slot.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
                        value: {
                            slot_id: slot.slot_id,
                            unit_price: Number.parseFloat(slot.price),
                            is_available: slot.is_available
                        },
                    }));
                }
            })
        )
    });
    return results;
};

export const makeBooking = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: async (submission) => {
            const response = await fetch(`${API_URL}/api/v1/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(submission),
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            return data;
        },
        onSuccess: (data) => {
            console.log(data);
            showToast("Success", "success");
            window.location.href = data.payment_url;
        },
        onError: (err) => {
            console.log("Error: ", err.message);
            showToast(err.message);
        },
        onMutate: () => {
            // Show a loading indicator while the mutation is in progress
            showToast("Processing...");
        }
    });
    return { mutate };
};

export const cancelBook = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const { mutate } = useMutation({
        mutationFn: async (bookingId) => {
            const response = await fetch(`${API_URL}/api/v1/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ booking_status: "Canceled" }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data;
        },
        onSuccess: () => {
            showToast("Canceled", "success");
        },
        onMutate: () => {
            // Show a loading indicator while the mutation is in progress
            showToast("Processing...");
        },
        onError: (err) => {
            showToast(`${err.message}`, "error");
        }
    });
    return { mutate };
};

export const syncGoogleCalendar = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { showToast } = useToast();
    const { mutate } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/api/v1/google-calendar/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data;
        },
        onSuccess: (data) => {
            showToast(data.message, "success");
        },
        onMutate: () => {
            // Show a loading indicator while the mutation is in progress
            showToast("Syncing...");
        },
        onError: (err) => {
            showToast(`${err.message}`, "error");
        }
    });
    return { mutate };
};