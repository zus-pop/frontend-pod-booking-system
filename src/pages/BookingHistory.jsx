import React, { useState, useEffect } from 'react';
import { ScrollToTop } from '../components';
import BookingHistorySlider from '../components/BookingHistorySlider';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([
    { id: 1, podName: 'Pod A', date: '2023-06-01', time: '09:00-10:00', status: 'Pending' },
    { id: 2, podName: 'Pod B', date: '2023-06-02', time: '14:00-15:00', status: 'Confirmed' },
    { id: 3, podName: 'Pod C', date: '2023-06-03', time: '11:00-12:00', status: 'Pending' },
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      showToast('Please log in to view booking history', 'error');
    }
  }, [user, navigate, showToast]);

  const handlePayment = (id) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? {...booking, status: 'Confirmed'} : booking
    ));
    showToast('Payment successful', 'success');
  };

  const handleCancel = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    showToast('Booking cancelled', 'success');
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
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
            <h1 className="text-4xl font-primary mb-8">Booking History</h1>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Pod Name</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Time</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="bg-white border-b">
                      <td className="px-6 py-4">{booking.podName}</td>
                      <td className="px-6 py-4">{booking.date}</td>
                      <td className="px-6 py-4">{booking.time}</td>
                      <td className="px-6 py-4">{booking.status}</td>
                      <td className="px-6 py-4">
                        {booking.status === 'Pending' && (
                          <>
                            <button onClick={() => handlePayment(booking.id)} className="font-medium text-blue-600 hover:underline mr-2">Pay</button>
                            <button onClick={() => handleCancel(booking.id)} className="font-medium text-red-600 hover:underline">Cancel</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingHistory;
