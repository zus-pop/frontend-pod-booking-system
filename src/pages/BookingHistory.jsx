import React, { useState, useEffect, useCallback } from 'react';
import { ScrollToTop } from '../components';
import BookingHistorySlider from '../components/BookingHistorySlider';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Loading from '../components/Loading';

const BookingHistory = () => {
  const { showToast } = useToast();
  const { user, checkUserLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
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
      showToast('Unable to fetch booking history', 'error');
    } finally {
      setLoading(false);
    }
  }, [API_URL, showToast]);

  useEffect(() => {
    const initializeBookingHistory = async () => {
      const isAuthenticated = await checkUserLoggedIn();
      if (!isAuthenticated) {
        navigate('/auth');
        showToast('Please log in to view booking history', 'error');
      } else {
        fetchBookings();
      }
    };

    if (!isLoading) {
      initializeBookingHistory();
    }
  }, [isLoading, checkUserLoggedIn, navigate, showToast, fetchBookings]);

  if (isLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

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
            {bookings.length > 0 ? (
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
                      <tr key={booking.booking_id} className="bg-white border-b">
                        <td className="px-6 py-4">{moment(booking.booking_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td className="px-6 py-4">{booking.booking_status}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleViewDetails(booking.booking_id)}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
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
