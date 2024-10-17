import { useQueries } from "@tanstack/react-query";
import moment from "moment";


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
                            unit_price: slot.price,
                            is_available: slot.is_available
                        },
                    }));
                }
            })
        )
    });
    return results;
};