import { useStoreContext } from '../context/StoreContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoWhite, LogoDark } from '../assets';
import LoginForm from './LoginForm';

const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { resetStoreFilterData } = useStoreContext();
  const [header, setHeader] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = ['Home', 'About', 'Solutions', 'Places', 'Contact'];
  useEffect(() => {
    window.addEventListener('scroll', () =>
      window.scrollY > 50 ? setHeader(true) : setHeader(false)
    );
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData(token);
    }
  };

  const getUserData = async (token) => {
    try {
      
      const response = await fetch(`${API_URL}/api/v1/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 403) {
        localStorage.removeItem('token');
        setUser(null);
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu người dùng');
      }
      const data = await response.json();
      console.log('Dữ liệu người dùng nhận được:', data);
      setUser(data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu người dùng:', error);
      setLoginMessage(error.message);
      setTimeout(() => setLoginMessage(''), 3000);
    }
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLoginSuccess = (message, token) => {
    
    setShowLoginForm(false);
    setLoginMessage(message);
    setTimeout(() => setLoginMessage(''), 3000);
    localStorage.setItem('token', token);
    getUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    setLoginMessage('Đã đăng xuất thành công');
    setTimeout(() => setLoginMessage(''), 3000);
  };

  return (
    <>
      <header className={`${header ? 'bg-white py-6 shadow-lg' : 'bg-transparent py-8'} fixed z-50 w-full transition-all duration-300`}>
        <div className='container mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-y-6 lg:gap-y-0'>
          {/* Logo */}
          <Link to="/" onClick={resetStoreFilterData}>
            {header ? <LogoDark className='w-[160px]' /> : <LogoWhite className='w-[160px]' />}
          </Link>

          {/* Nav */}
          <nav className={`${header ? 'text-primary' : 'text-white'}
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
                    header ? 'text-primary border-primary' : 'text-white border-white'
                  } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
                >
                  {user.user_name || user.email}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
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
                onClick={handleLoginClick}
                className={`${
                  header ? 'text-primary border-primary' : 'text-white border-white'
                } border-2 px-4 py-2 rounded-full transition hover:text-accent hover:border-accent`}
              >
                Login
              </button>
            )}
          </nav>
        </div>
        {/* Thông báo đăng nhập thành công */}
        {loginMessage && (
          <div className="absolute top-full left-0 right-0 bg-green-500 text-white text-center py-2">
            {loginMessage}
          </div>
        )}
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
