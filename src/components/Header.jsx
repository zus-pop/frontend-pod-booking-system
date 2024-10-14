import React from 'react';
import { useStoreContext } from '../context/StoreContext';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoWhite, LogoDark } from '../assets';
import LoginForm from './LoginForm';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { resetStoreFilterData } = useStoreContext();
  const [header, setHeader] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { showToast } = useToast();
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Áp dụng hiệu ứng cuộn cho tất cả các trang, bao gồm cả Booking History
      setHeader(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLoginSuccess = async (message, token) => {
    setShowLoginForm(false);
    await login(token);
    showToast(message, 'success');
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    showToast('Logged out successfully', 'success');
    if (location.pathname === '/booking-history') {
      navigate('/');
      showToast('Please log in to view booking history', 'info');
    }
  };

  const handleBookingHistoryClick = () => {
    setShowDropdown(false);
    navigate('/booking-history');
  };

  // Xác định xem có nên sử dụng kiểu header tối hay sáng
  const isDarkHeader = !header;

  return (
    <>
      <header className={`${isDarkHeader ? 'bg-transparent py-8' : 'bg-white py-6 shadow-lg'} fixed z-50 w-full transition-all duration-300`}>
        <div className='container mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-y-6 lg:gap-y-0'>
          {/* Logo */}
          <Link to="/" onClick={resetStoreFilterData}>
            {isDarkHeader ? <LogoWhite className='w-[160px]' /> : <LogoDark className='w-[160px]' />}
          </Link>

          {/* Nav */}
          <nav className={`${isDarkHeader ? 'text-white' : 'text-primary'}
          flex gap-x-4 lg:gap-x-8 font-tertiary tracking-[3px] text-[15px] items-center uppercase`}>
            <Link to="/" className='transition hover:text-accent'>Home</Link>
            <Link to="/about" className='transition hover:text-accent'>About</Link>
            <Link to="/solutions" className='transition hover:text-accent'>Solutions</Link>
            <Link to="/places" className='transition hover:text-accent'>Places</Link>
            <Link to="/contact" className='transition hover:text-accent'>Contact</Link>
            {/* Nút đăng nhập hoặc tên người dùng */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`${
                    isDarkHeader ? 'text-white border-white' : 'text-primary border-primary'
                  } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
                >
                  {user.user_name || user.email}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      to="/booking-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Booking History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginForm(true)}
                className={`${
                  isDarkHeader ? 'text-white border-white' : 'text-primary border-primary'
                } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Modal LoginForm */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <LoginForm onClose={() => setShowLoginForm(false)} onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
