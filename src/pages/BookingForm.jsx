import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { MdClose, MdCalendarToday, MdAccessTime, MdAttachMoney } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getSlotsByPodIdAndDate, makeBooking } from "../utils/api";
import LoginForm from "../components/LoginForm";

const BookingForm = ({ pod }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, checkUserLoggedIn, login } = useAuth();
    const [selectedDates, setSelectedDates] = useState([
        { id: Date.now(), date: null },
    ]); // Each date has a unique id
    const [selectedSlots, setSelectedSlots] = useState({});
    const slotsForDates = getSlotsByPodIdAndDate(
        pod.pod_id,
        selectedDates.map((dateObj) => dateObj.date)
    );
    const selectRefs = useRef({});
    const [totalCost, setTotalCost] = useState(0);
    const { mutate: book } = makeBooking();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Update totalCost based on selected slots
    useEffect(() => {
        const newTotalCost = Object.values(selectedSlots)
            .flat()
            .reduce(
                (acc, cur) => acc + Number.parseFloat(cur?.unit_price || 0),
                0
            );
        setTotalCost(newTotalCost);
    }, [selectedSlots]);

    const handleBookNow = (e) => {
        e.preventDefault();
        checkUserLoggedIn();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const bookingSlots = Object.values(selectRefs.current).flatMap(
            (ref) => ref?.getValue()?.map((slot) => slot.value) || []
        );

        if (!bookingSlots.length) {
            showToast("You haven't chosen any slot yet", "error");
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmBooking = () => {
        const booking = {
            pod_id: pod.pod_id,
        };

        const bookingSlots = Object.values(selectRefs.current).flatMap(
            (ref) => ref?.getValue()?.map((slot) => slot.value) || []
        );

        const submission = {
            booking,
            bookingSlots: bookingSlots.map((bookingSlot) => ({
                slot_id: bookingSlot.slot_id,
                unit_price: bookingSlot.unit_price,
            })),
        };
        book(submission);
        setShowConfirmModal(false);
    };

    const handleLoginSuccess = async (token) => {
        try {
            await login(token);
            setShowLoginModal(false);
            showToast("Login successful. You can now proceed with booking.", "success");
        } catch (error) {
            showToast("Login failed", "error");
        }
    };

    useEffect(() => {
        const restoreBookingData = async () => {
            const tempBookingData = localStorage.getItem('tempBookingData');
            if (tempBookingData && user) {
                try {
                    const bookingData = JSON.parse(tempBookingData);
                    
                    if (bookingData.pod_id === pod.pod_id) {
                        setSelectedDates(bookingData.selectedDates);
                        
                        setTimeout(() => {
                            setSelectedSlots(bookingData.selectedSlots);
                            
                            Object.entries(bookingData.selectedSlots).forEach(([dateId, slots]) => {
                                if (selectRefs.current[dateId]) {
                                    const options = slots.map(slot => ({
                                        value: slot,
                                        label: `${moment(slot.start_time).format('HH:mm')} - ${moment(slot.end_time).format('HH:mm')} (${slot.unit_price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })})`
                                    }));
                                    selectRefs.current[dateId].setValue(options);
                                }
                            });
                        }, 500);
                    }
                    
                    localStorage.removeItem('tempBookingData');
                } catch (error) {
                    console.error('Error restoring booking data:', error);
                }
            }
        };

        restoreBookingData();
    }, [user, pod.pod_id]);

    const getCurrentDate = () => moment().format("YYYY-MM-DD");
    const getMaxDate = () => moment().add(7, 'days').format("YYYY-MM-DD");

    const availableSlotOptions = (id) => {
        const selectedDateId = selectedDates.findIndex((d) => d.id === id);
        return Array.isArray(slotsForDates[selectedDateId])
            ? slotsForDates[selectedDateId].filter(
                  (option) =>
                      !selectedSlots[id]?.some(
                          (selectedSlot) =>
                              selectedSlot?.slot_id === option.value.slot_id
                      )
              )
            : slotsForDates[selectedDateId];
    };

    // Remove select element based on id
    const handleRemoveSelect = (id) => {
        // Remove both the date and slots by unique date id
        setSelectedDates((prevDates) =>
            prevDates.filter((dateObj) => dateObj.id !== id)
        );
        setSelectedSlots((prevSlots) => {
            const updatedSlots = { ...prevSlots };
            delete updatedSlots[id]; // Remove the corresponding slots for that date id
            return updatedSlots;
        });

        // Clear the value of the specific select
        // if (selectRefs.current[id]) {
        //     selectRefs.current[id].clearValue();
        // }

        // just let the select cook :/
        delete selectRefs.current[id];
    };

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
                    {selectedDates.map((selectedDateObj) => (
                        <div
                            key={selectedDateObj.id}
                            className="flex md:flex-col relative gap-4 bg-white p-4 rounded-lg shadow-md"
                        >
                            <div className="md:w-full">
                                <label
                                    htmlFor="reservationDate"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Select Date (Within 7 days)
                                </label>
                                <button
                                    disabled={selectedDates.length === 1}
                                    className="disabled:opacity-50"
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSelect(selectedDateObj.id)
                                    }
                                >
                                    <MdClose className="text-red-600 text-xl absolute top-2 right-2 rounded-xl enable:hover:text-red-300 transition-all" />
                                </button>
                                <ReactDatePicker
                                    isSearchable
                                    toggleCalendarOnIconClick
                                    showIcon
                                    format="YYYY-MM-DD"
                                    todayButton="Today"
                                    placeholderText="Select A Date"
                                    isClearable
                                    excludeDates={selectedDates.map((dateObj) =>
                                        moment(dateObj.date).toDate()
                                    )}
                                    selected={
                                        selectedDateObj.date
                                            ? moment(
                                                  selectedDateObj.date
                                              ).toDate()
                                            : null
                                    }
                                    minDate={moment(getCurrentDate()).toDate()}
                                    maxDate={moment(getMaxDate()).toDate()}
                                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent p-2"
                                    onChange={(value) => {
                                        const updatedDates = selectedDates.map(
                                            (dateObj) =>
                                                dateObj.id ===
                                                selectedDateObj.id
                                                    ? {
                                                          ...dateObj,
                                                          date: value
                                                              ? moment(
                                                                    value
                                                                ).format(
                                                                    "YYYY-MM-DD"
                                                                )
                                                              : null,
                                                      }
                                                    : dateObj
                                        );
                                        selectRefs.current[
                                            selectedDateObj.id
                                        ]?.clearValue();
                                        setSelectedDates(updatedDates);
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
                                        (selectRefs.current[
                                            selectedDateObj.id
                                        ] = el)
                                    }
                                    isMulti
                                    autoFocus
                                    isSearchable
                                    isClearable
                                    onChange={(e) => {
                                        setSelectedSlots((prev) => ({
                                            ...prev,
                                            [selectedDateObj.id]: e.map(
                                                (slot) => slot.value
                                            ),
                                        }));
                                    }}
                                    options={availableSlotOptions(
                                        selectedDateObj.id
                                    )}
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
                    {selectedDates.length < 7 && (
                        <button
                            type="button"
                            className="w-full flex justify-center items-center gap-2 font-tertiary text-sm uppercase tracking-[1px] hover:scale-105 transition-all my-4"
                            onClick={() => {
                                const newId = Date.now() + Math.random();
                                setSelectedDates((prev) => [
                                    ...prev,
                                    { id: newId, date: null },
                                ]);
                            }}
                        >
                            Add more slot of other date <FaPlus />
                        </button>
                    )}

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

            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    
                        <LoginForm 
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Booking Confirmation</h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                <MdCalendarToday className="text-accent text-xl" />
                                <div>
                                    <p className="font-medium">Number of Days:</p>
                                    <p className="text-gray-600">{selectedDates.filter(date => date.date).length} days</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdAccessTime className="text-accent text-xl" />
                                <div>
                                    <p className="font-medium">Total Slots:</p>
                                    <p className="text-gray-600">
                                        {Object.values(selectedSlots).flat().length} slots
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdAttachMoney className="text-accent text-xl" />
                                <div>
                                    <p className="font-medium">Total Amount:</p>
                                    <p className="text-yellow-600 font-semibold">
                                        {totalCost.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleConfirmBooking}
                                className="flex-1 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingForm;
