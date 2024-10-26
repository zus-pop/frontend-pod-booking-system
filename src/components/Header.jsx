import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoWhite, LogoDark } from '../assets';
import { useStoreContext } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import moment from 'moment';

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
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

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
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [location.pathname, showDropdown, showNotifications]);

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
      
      // Tính toán số lượng thông báo chưa đọc
      const unreadNotifications = data.notifications.filter(notification => !notification.is_read);
      setUnreadCount(unreadNotifications.length);
      
      console.log('Unread count:', unreadNotifications.length); // Kiểm tra log
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  const handleLoginClick = () => {
    navigate('/auth', { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    showToast('Logged out successfully', 'success');
    
    // Kiểm tra nếu đang ở trang booking history hoặc booking detail
    if (location.pathname === '/booking-history' || location.pathname.startsWith('/booking-details')) {
      navigate('/');
      showToast('Please log in to view booking information', 'info');
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  };

  const isDarkHeader = !header && (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/solutions' || location.pathname === '/places' || location.pathname === '/contact') && location.pathname !== '/auth';
  const isAuthPage = location.pathname === '/auth';

  const handleReadNotification = async (notificationId) => {
    try {
      if (!notificationId) {
        throw new Error('Notification ID is undefined');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notification as read');
      }

      // Cập nhật state local
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.notification_id === notificationId ? { ...notification, is_read: true } : notification
        )
      );

      // Cập nhật số lượng thông báo chưa đọc
      setUnreadCount(prevCount => {
        const newCount = prevCount > 0 ? prevCount - 1 : 0;
        console.log('New unread count:', newCount); // Thêm log để kiểm tra
        return newCount;
      });

    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast('Failed to mark notification as read', 'error');
    }
  };

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
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div ref={notificationRef} className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.notification_id}
                          className={`px-4 py-3 border-b border-gray-100 ${
                            notification.is_read ? 'bg-white' : 'bg-blue-100'
                          } hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer`}
                          onClick={() => handleReadNotification(notification.notification_id)}
                        >
                          <p className="text-sm font-sans text-gray-800 tracking-wide capitalize mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs font-sans text-gray-500 capitalize">
                            {moment(notification.created_at).fromNow().replace(/\b\w/g, c => c.toUpperCase())}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 font-sans">
                        No new notifications
                      </div>
                    )}
                  </div>
                  {notifications.length >= 10 && (
                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                      <button 
                        className="text-xs font-sans text-accent hover:underline w-full text-center capitalize tracking-wide"
                        onClick={() => {/* Xử lý xem tất cả thông báo */}}
                      >
                        View all notifications
                      </button>
                    </div>
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
