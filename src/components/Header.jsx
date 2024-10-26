import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoWhite, LogoDark } from '../assets';
import { useStoreContext } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const { resetStoreFilterData } = useStoreContext();
  const [header, setHeader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { showToast } = useToast();
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/auth' && location.pathname !== '/booking-details') {
        setHeader(window.scrollY > 50);
      }
    };

    const handleClickOutside = (event) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [location.pathname, showDropdown]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/notifications?page=1&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data.notifications);
      setTotalNotifications(data.total);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLoginClick = () => {
    navigate('/auth', { state: { from: location.pathname } });
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

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  };

  const isDarkHeader = !header && (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/solutions' || location.pathname === '/places' || location.pathname === '/contact') && location.pathname !== '/auth';
  const isAuthPage = location.pathname === '/auth';

  return (
    <header 
      ref={headerRef}
      className={`${
        isAuthPage 
          ? 'bg-white py-6 shadow-lg' 
          : isDarkHeader 
            ? 'bg-transparent py-8' 
            : 'bg-white py-6 shadow-lg'
      } fixed z-50 w-full transition-all duration-300`}
    >
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
          
          {/* Biểu tượng thông báo chỉ hiển thị khi user đã đăng nhập */}
          {user && (
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className={`${
                  isDarkHeader ? 'text-white hover:text-accent' : 'text-primary hover:text-accent'
                } transition relative`}
              >
                <FaBell className="text-xl" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {notification.message}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nút đăng nhập hoặc tên người dùng */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className={`${
                  isDarkHeader ? 'text-white border-white' : 'text-primary border-primary'
                } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
              >
                {user.user_name || user.email}
              </button>
              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan truyền khi click vào dropdown
                >
                  <Link
                    to="/booking-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    Booking History
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
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
  );
};

export default Header;
