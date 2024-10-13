import { useQueries } from "@tanstack/react-query";
import moment from "moment";

export const getSlotsByPodIdAndDate = (pod_id, dates) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const results = useQueries({
        queries: dates.map(date => ({
            queryKey: ['slot', pod_id, date],
            queryFn: async () => {
                const response = await fetch(`${API_URL}/api/v1/slots/?pod_id=${pod_id}&date=${date}`);
                return await response.json();
            },
        })),
    });
    // console.log(results);
    if (!pod_id || !dates.length || !dates[0]) {
        return [];
    }
    return results.length ? results.map(({ data: slots, isSuccess }) => {
        if (isSuccess) {
            return Array.isArray(slots) ? slots.map(slot => ({
                label: `${moment(slot.start_time).format("HH:mm:ss")} - ${moment(slot.end_time).format("HH:mm:ss")}`,
                value: {
                    slot_id: slot.slot_id,
                    price: slot.unit_price
                },
                is_available: slot.is_available
            })) : [];
        }
    }) : [];
};