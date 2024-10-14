import moment from "moment";
import { useRef, useState } from "react";
import Select from "react-select";
import { getSlotsByPodIdAndDate } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { IoIosCloseCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import ReactDatePicker from "react-datepicker";

export default function BookingForm({ pod }) {
    const { showToast } = useToast();
    const selectRefs = useRef([]);
    const [selectedDates, setSelectedDates] = useState([null]);
    const slotsForDates = getSlotsByPodIdAndDate(pod.pod_id, selectedDates);
    const [totalCost, setTotalCost] = useState(0);

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
        // modify soon
    };

    const availableSlotOptions = (index) =>
        Array.isArray(slotsForDates[index])
            ? slotsForDates[index].filter(
                  (option) =>
                      !selectRefs.current[index]
                          .getValue()
                          .some(
                              (selectedSlot) =>
                                  selectedSlot.value.slot_id ===
                                  option.value.slot_id
                          )
              )
            : slotsForDates[index];

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
                        className="flex md:flex-col relative gap-4 border-2 border-black rounded-xl p-2"
                    >
                        <div className="md:w-full">
                            <label
                                htmlFor="reservationDate"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Select Date
                            </label>
                            <button
                                disabled={selectedDates.length === 1}
                                className="disabled:opacity-50"
                            >
                                <IoIosCloseCircle
                                    onClick={() => {
                                        const newSelectedDates = [
                                            ...selectedDates,
                                        ];
                                        newSelectedDates.splice(index, 1);
                                        selectRefs.current.splice(index, 1);
                                        setSelectedDates(newSelectedDates);
                                    }}
                                    className="text-red-600 text-base md:text-md lg:text-lg xl:text-xl absolute top-0 right-2 my-2 rounded-xl enable:hover:text-red-300 transition-all"
                                />
                            </button>
                            <ReactDatePicker
                                isSearchable
                                toggleCalendarOnIconClick
                                showIcon
                                format="YYYY-MM-DD"
                                todayButton="Today"
                                placeholderText="Select A Date"
                                isClearable
                                excludeDates={selectedDates.map((date) =>
                                    moment(date).toDate()
                                )}
                                selected={
                                    selectedDate
                                        ? moment(selectedDate).toDate()
                                        : null
                                }
                                minDate={moment(getCurrentDate()).toDate()}
                                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                onChange={(value) => {
                                    const newMap = selectedDates.map(
                                        (date, i) => {
                                            if (i === index) {
                                                selectRefs.current[
                                                    index
                                                ].clearValue();
                                                return value
                                                    ? moment(value).format(
                                                          "YYYY-MM-DD"
                                                      )
                                                    : null;
                                            }
                                            return date;
                                        }
                                    );
                                    setSelectedDates(newMap);
                                }}
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
                                isClearable
                                onChange={(e) => {
                                    const newTotalCost = e.reduce(
                                        (acc, curr) =>
                                            acc +
                                            Number.parseFloat(curr.value.price),
                                        0
                                    );
                                    setTotalCost((prev) => prev + newTotalCost);
                                }}
                                options={availableSlotOptions(index)}
                                isOptionDisabled={(option) =>
                                    !option.value.is_available
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col">
                <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 font-bold hover:scale-110 transition-all"
                    onClick={() => {
                        setSelectedDates((prev) => [...prev, ""]);
                    }}
                >
                    Add more slot of other date <FaPlus />
                </button>

                <div className="p-6 my-5 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Total Cost
                    </h2>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-600">
                            Total:
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                            {totalCost.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-lg btn-primary py-4 rounded-xl w-full transition-all"
                    disabled={!pod.is_available}
                >
                    Book now
                </button>
            </div>
        </form>
    );
}
