import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { FaCheck } from 'react-icons/fa';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';

const PodDetails = () => {
  const { id } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPodDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/pods/${id}`);
        if (!response.ok) {
          throw new Error('Không thể lấy thông tin pod');
        }
        const data = await response.json();
        setPod(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin pod:', error);
        showToast('Không thể lấy thông tin pod', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPodDetails();
  }, [id, API_URL, showToast]);

  useEffect(() => {
    // Giả lập việc lấy slots từ API
    if (selectedDate) {
      // Trong tương lai, thay thế bằng cuộc gọi API thực tế
      const mockSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00'];
      setAvailableSlots(mockSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const handleBookNow = () => {
    if (!selectedDate || !selectedSlot) {
      showToast('', 'error');
      return;
    }
    showToast('Booking function is under development', 'info');
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return <Loading />;
  }

  if (!pod) {
    return <div>Không tìm thấy thông tin pod</div>;
  }

  return (
    <section>
      <ScrollToTop />

      <div className='bg-room h-[560px] relative flex justify-center items-center bg-cover bg-center' style={{backgroundImage: `url(${pod.image})`}}>
        <div className='absolute w-full h-full bg-black/70' />
        <h1 className='text-6xl text-white z-20 font-primary text-center'>{pod.pod_name} Details</h1>
      </div>

      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row lg:gap-x-8 h-full py-24'>
          {/* Left side */}
          <div className='w-full lg:w-[60%] h-full text-justify'>
            <h2 className='h2'>{pod.pod_name}</h2>
            
            <img className='mb-8' src={pod.image} alt={pod.pod_name} />

            <div className='mt-12'>
              <h3 className='h3 mb-3'>Pod Description</h3>
              <p className='mb-12'>{pod.description || 'No description available.'}</p>

              {/* Pod details */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className='flex items-center gap-x-3'>
                  <div className='text-base'>Type: {pod.type_id}</div>
                </div>
                <div className='flex items-center gap-x-3'>
                  <div className='text-base'>Status: 
                    <span className={pod.is_available ? 'text-green-500' : 'text-red-500'}>
                      {pod.is_available ? ' Available' : ' Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className='w-full lg:w-[40%] h-full'>
            {/* Booking section */}
            <div className='py-8 px-6 bg-accent/20 mb-12'>
              <div className='flex flex-col space-y-4 mb-4'>
                <h3 className='text-xl font-bold'>Your Reservation</h3>
                <div className='flex gap-4'>
                  <div className='w-1/2'>
                    <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="reservationDate"
                      min={getCurrentDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className='w-1/2'>
                    <label htmlFor="reservationSlot" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Slot
                    </label>
                    <select
                      id="reservationSlot"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled={!selectedDate}
                    >
                      <option value="">Choose a slot</option>
                      {availableSlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button 
                className='btn btn-lg btn-primary w-full'
                onClick={handleBookNow}
                disabled={!pod.is_available || !selectedDate || !selectedSlot}
              >
                Book now
              </button>
            </div>

            <div>
              <h3 className='h3'>POD Rules</h3>
              <p className='mb-6 text-justify'>
                Please follow these rules to experience the best services.
              </p>
              <ul className='flex flex-col gap-y-4'>
                {/* Thay thế bằng rules thực tế của pod nếu có */}
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  Respect quiet hours
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  Keep the pod clean
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  No smoking inside the pod
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodDetails;
