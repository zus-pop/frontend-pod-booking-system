import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { showToast } = useToast();

  // Thêm ref cho form container
  const formRef = useRef(null);

  // Kiểm tra form validation
  useEffect(() => {
    if (isLogin) {
      setIsFormValid(email !== '' && password !== '' && !emailError);
    } else {
      setIsFormValid(
        email !== '' && 
        password !== '' && 
        rePassword !== '' && 
        userName !== '' && 
        phoneNumber !== '' && 
        !emailError && 
        !passwordError && 
        !phoneError
      );
    }
  }, [isLogin, email, password, rePassword, userName, phoneNumber, emailError, passwordError, phoneError]);

  // Sửa lại useEffect để handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError('');
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
    setPasswordError('');
  };

  const handleRePasswordBlur = () => {
    if (rePassword && password !== rePassword) {
      setPasswordError('Passwords do not match');
    }
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    setPhoneError('');
  };

  const handlePhoneBlur = () => {
    if (phoneNumber && !validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (email && password) {
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message);
          }
          if (data.token) {
            onLoginSuccess(data.token);
          }
        } catch (error) {
          showToast(error.message, 'error');
        }
      } else {
        showToast('Please enter both email and password', 'error');
      }
    } else {
      if (!isFormValid) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            user_name: userName,
            phone_number: phoneNumber,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        showToast('Registration successful! Please login.', 'success');
        setIsLogin(true);
        // Reset các trường đăng ký
        setRePassword('');
        setUserName('');
        setPhoneNumber('');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div ref={formRef} className="bg-white rounded-xl w-[400px] relative">
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          {/* Header section */}
          <div className="relative flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-500 text-transparent bg-clip-text">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="group">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Email"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-yellow-600 transition-colors duration-200"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-yellow-600 transition-colors duration-200"
              />
            </div>

            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div>
                  <input
                    type="password"
                    value={rePassword}
                    onChange={handleRePasswordChange}
                    onBlur={handleRePasswordBlur}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-yellow-600 transition-colors duration-200"
                  />
                  {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-yellow-600 transition-colors duration-200"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    placeholder="Phone Number"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:border-yellow-600 transition-colors duration-200"
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2.5 rounded-lg text-white font-semibold ${
                isFormValid 
                  ? 'bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-500 hover:opacity-90 transition-opacity' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="relative">
                {isLogin ? 'Sign In' : 'Create Account'}
              </span>
            </button>
          </form>

          {/* Switch between Login/Register */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;