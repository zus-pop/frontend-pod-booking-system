import React, { useState, useEffect, useCallback } from 'react';
import { ScrollToTop } from '../components';
import BookingHistorySlider from '../components/BookingHistorySlider';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BookingHistory = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/auth/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [API_URL, user]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      showToast('Please log in to view booking history', 'error');
    } else {
      fetchBookings();
    }
  }, [user, navigate, showToast, fetchBookings]);

  const fetchBookingDetails = async (bookingId) => {
    if (bookingDetails[bookingId]) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/bookings/${bookingId}/slots`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      const data = await response.json();
      setBookingDetails(prevDetails => ({...prevDetails, [bookingId]: data}));
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const toggleDetails = async (bookingId) => {
    if (expandedBookingId === bookingId) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(bookingId);
      await fetchBookingDetails(bookingId);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (!user) {
    return null;
  }

  return (
    <section className="relative min-h-screen">
      <ScrollToTop />
      <div className="absolute inset-0 z-0">
        <BookingHistorySlider />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
            <h1 className="text-4xl font-primary mb-8">Booking History</h1>
            {isInitialLoad ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Booking Date</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <React.Fragment key={booking.booking_id}>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-4">{moment(booking.booking_date).format('DD/MM/YYYY HH:mm')}</td>
                          <td className="px-6 py-4">{booking.booking_status}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => toggleDetails(booking.booking_id)}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {expandedBookingId === booking.booking_id ? 'Hide details' : 'View details'}
                            </button>
                          </td>
                        </tr>
                        {expandedBookingId === booking.booking_id && (
                          <tr>
                            <td colSpan="3" className="px-6 py-4">
                              <div className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Booking details:</h4>
                                {bookingDetails[booking.booking_id] ? (
                                  bookingDetails[booking.booking_id].map((detail, index) => (
                                    <div key={index} className="mb-2">
                                      <p>Slot ID: {detail.slot_id}</p>
                                      <p>Pod ID: {detail.pod_id}</p>
                                      <p>Start time: {moment(detail.start_time).format('DD/MM/YYYY HH:mm')}</p>
                                      <p>End time: {moment(detail.end_time).format('DD/MM/YYYY HH:mm')}</p>
                                      <p>Unit price: {formatCurrency(detail.unit_price)}</p>
                                      <p>Total price: {formatCurrency(detail.price)}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p>Loading details...</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">No booking history found.</p>
                <p className="mt-2 text-gray-500">You haven't made any bookings yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingHistory;
