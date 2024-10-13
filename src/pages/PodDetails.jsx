import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { FaCheck } from 'react-icons/fa';
import Loading from '../components/Loading';
import LoginForm from '../components/LoginForm';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const PodDetails = () => {
  const { id } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, checkUserLoggedIn } = useAuth();

  useEffect(() => {
    const fetchPodDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        showToast('Please login to view Pod details', 'error');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/v1/pods/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch pod details');
        }
        const data = await response.json();
        setPod(data);
      } catch (error) {
        console.error('Error fetching pod details:', error);
        showToast('Failed to fetch pod details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPodDetails();
  }, [id, API_URL, showToast, navigate]);

  const handleBookNow = () => {
    if (!user) {
      setShowLoginForm(true);
    } else {
      // Xử lý đặt pod ở đây
      showToast('Booking function is under development', 'info');
    }
  };

  const handleLoginSuccess = async (message, token) => {
    setShowLoginForm(false);
    localStorage.setItem('token', token);
    await checkUserLoggedIn();
    showToast(message, 'success');
  };

  if (loading) {
    return <Loading />;
  }

  if (!pod) {
    return <div>No pod details found</div>;
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
                <h3>Book This Pod</h3>
                <p>Type: {pod.type_id}</p>
                <p>Status: 
                  <span className={pod.is_available ? 'text-green-500' : 'text-red-500'}>
                    {pod.is_available ? ' Available' : ' Unavailable'}
                  </span>
                </p>
                {/* Có thể thêm các trường khác như ngày, giờ ở đây */}
              </div>
              <button 
                className='btn btn-lg btn-primary w-full'
                onClick={handleBookNow}
                disabled={!pod.is_available}
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

      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <LoginForm onClose={() => setShowLoginForm(false)} onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </section>
  );
};

export default PodDetails;
