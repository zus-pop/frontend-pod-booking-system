import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getSlotsByPodIdAndDate } from "../utils/api";

const BookingForm = ({ pod }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [selectedDates, setSelectedDates] = useState([null]);
    const slotsForDates = getSlotsByPodIdAndDate(pod.pod_id, selectedDates);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const selectRefs = useRef([]);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const newTotalCost = selectedSlots
            .flat()
            .reduce(
                (acc, cur) => acc + Number.parseFloat(cur.value.unit_price),
                0
            );
        setTotalCost(newTotalCost);
    }, [selectedSlots]);

    const handleBookNow = (e) => {
        e.preventDefault();

        if (!user) {
            navigate("/auth", { state: { from: location.pathname } });
            return;
        }

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
            bookingSlots: bookingSlots.map((bookingSlot) => ({
                slot_id: bookingSlot.slot_id,
                unit_price: bookingSlot.unit_price,
            })),
        };
        console.log(submission);

        showToast("Booking function is under development", "info");
    };

    const getCurrentDate = () => {
        return moment().format("YYYY-MM-DD");
    };

    const availableSlotOptions = (index) =>
        Array.isArray(slotsForDates[index])
            ? slotsForDates[index].filter(
                  (option) =>
                      !selectedSlots[index].some(
                          (selectedSlot) =>
                              selectedSlot.value.slot_id ===
                              option.value.slot_id
                      )
              )
            : slotsForDates[index];

    return (
        <>
            <form
                onSubmit={handleBookNow}
                className="py-8 px-6 bg-accent/20 mb-12 rounded-lg"
            >
                <div className="flex flex-col space-y-4 mb-4">
                    <h3 className="text-2xl font-primary font-semibold tracking-[1px] mb-4">
                        Your Reservation
                    </h3>
                    {selectedDates.map((selectedDate, index) => (
                        <div
                            key={index}
                            className="flex md:flex-col relative gap-4 bg-white p-4 rounded-lg shadow-md"
                        >
                            <div className="md:w-full">
                                <label
                                    htmlFor="reservationDate"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Select Date
                                </label>
                                <button
                                    disabled={selectedDates.length === 1}
                                    className="disabled:opacity-50"
                                    type="button"
                                >
                                    <MdClose
                                        onClick={() => {
                                            setSelectedDates((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                            setSelectedSlots((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                            selectRefs.current[
                                                index
                                            ].clearValue();
                                        }}
                                        className="text-red-600 text-xl absolute top-2 right-2 rounded-xl enable:hover:text-red-300 transition-all"
                                    />
                                </button>
                                <ReactDatePicker
                                    isSearchable
                                    toggleCalendarOnIconClick
                                    showIcon
                                    format="YYYY-MM-DD"
                                    todayButton="Today"
                                    placeholderText="Select A Date"
                                    excludeDates={selectedDates.map((date) =>
                                        moment(date).toDate()
                                    )}
                                    selected={
                                        selectedDate
                                            ? moment(selectedDate).toDate()
                                            : null
                                    }
                                    minDate={moment(getCurrentDate()).toDate()}
                                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent p-2"
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
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Select Slot
                                </label>
                                <Select
                                    ref={(el) =>
                                        (selectRefs.current[index] = el)
                                    }
                                    isMulti
                                    autoFocus
                                    isSearchable
                                    isClearable
                                    onChange={(e) => {
                                        const slotDates = [...selectedSlots];
                                        slotDates[index] = e;
                                        setSelectedSlots(slotDates);
                                    }}
                                    options={availableSlotOptions(index)}
                                    isOptionDisabled={(option) =>
                                        !option.value.is_available
                                    }
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <button
                        type="button"
                        className="w-full flex justify-center items-center gap-2 font-tertiary text-sm uppercase tracking-[1px] hover:scale-105 transition-all my-4"
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
                        className="btn btn-lg btn-primary py-4 rounded-lg w-full transition-all mt-6"
                        disabled={!pod.is_available}
                    >
                        Book now
                    </button>
                </div>
            </form>
        </>
    );
};

export default BookingForm;
