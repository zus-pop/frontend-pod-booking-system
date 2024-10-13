import moment from "moment";
import React, { useRef, useState } from "react";
import Select from "react-select";
import { getSlotsByPodIdAndDate } from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function BookingForm({ pod }) {
    const { showToast } = useToast();
    const selectRefs = useRef([]);
    const [selectedDates, setSelectedDates] = useState([""]);
    const slotsForDates = getSlotsByPodIdAndDate(pod.pod_id, selectedDates);

    const handleBookNow = (e) => {
        e.preventDefault();
        const booking = {
            pod_id: pod.pod_id,
        };
        const bookingSlots = selectRefs.current.flatMap((slotsOfDate) =>
            slotsOfDate ? slotsOfDate.getValue().map((slot) => slot.value) : []
        );
        if (!bookingSlots.length) {
            showToast("You haven't chosen any slot yet", "error");
            return;
        }
        const submission = {
            booking,
            bookingSlots,
        };
        console.log(submission);

        showToast("Booking function is under development", "info");
    };
    const getCurrentDate = () => {
        return moment("2024-08-30").format("YYYY-MM-DD");
    };

    return (
        <form
            onSubmit={handleBookNow}
            className="py-8 px-5 rounded-xl bg-accent/20 mb-12"
        >
            <div className="flex flex-col space-y-4 mb-4">
                <h3 className="text-xl font-bold">Your Reservation</h3>
                {selectedDates.map((selectedDate, index) => (
                    <div
                        key={index}
                        className="flex md:flex-col gap-4 border-2 border-black rounded-xl p-2"
                    >
                        <div className="w-1/3 md:w-full">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="reservationDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Select Date
                                </label>
                                <button
                                    type="button"
                                    className="bg-red-600 px-1.5 my-2 rounded-xl disabled:opacity-50 hover:bg-red-500 transition-all"
                                    disabled={selectedDates.length === 1}
                                    onClick={() => {
                                        const newSelectedDates = [
                                            ...selectedDates,
                                        ];
                                        newSelectedDates.splice(index, 1);
                                        selectRefs.current.splice(index, 1);
                                        setSelectedDates(newSelectedDates);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                            <input
                                type="date"
                                id="reservationDate"
                                min={getCurrentDate()}
                                value={selectedDate}
                                onChange={(e) => {
                                    const newMap = selectedDates.map(
                                        (date, i) => {
                                            if (i === index) {
                                                selectRefs.current[
                                                    index
                                                ].clearValue();
                                                return e.target.value;
                                            }
                                            return date;
                                        }
                                    );
                                    setSelectedDates(newMap);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="reservationSlot"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Select Slot
                            </label>
                            <Select
                                ref={(el) => (selectRefs.current[index] = el)}
                                isMulti
                                autoFocus
                                isSearchable
                                options={slotsForDates[index]}
                                isOptionDisabled={(slot) => !slot.is_available}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col">
                <button
                    type="button"
                    className="w-fit hover:scale-110 transition-all py-5"
                    onClick={() => {
                        setSelectedDates((prev) => [...prev, ""]);
                    }}
                >
                    Add more slot of other date +
                </button>
                <button
                    type="submit"
                    className="btn btn-lg btn-primary py-4 rounded-xl w-full transition-all"
                    disabled={!pod.is_available || !selectedDates}
                >
                    Book now
                </button>
            </div>
        </form>
    );
}
