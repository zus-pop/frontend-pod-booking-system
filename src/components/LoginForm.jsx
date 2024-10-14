import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phone) => {
    const re = /^[0-9]{10}$/;  // Assumes a 10-digit phone number
    return re.test(phone);
  };

  useEffect(() => {
    if (isLogin) {
      setIsFormValid(email !== '' && password !== '' && validateEmail(email));
    } else {
      setIsFormValid(
        email !== '' &&
        password !== '' &&
        rePassword !== '' &&
        userName !== '' &&
        phoneNumber !== '' &&
        password === rePassword &&
        validateEmail(email) &&
        validatePhoneNumber(phoneNumber)
      );
    }
  }, [isLogin, email, password, rePassword, userName, phoneNumber]);

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneBlur = () => {
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError('Invalid phone number format');
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError('');
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login();
    } else {
      await register();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setRePassword('');
    setUserName('');
    setPhoneNumber('');
    setEmailError('');
    setPhoneError('');
    setEmailTouched(false);
    setPhoneTouched(false);
  };

  const login = async () => {
    try {
      console.log('Sending login request with:', { email });
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login API response:', response);
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      
      if (data.token) {
        showToast('Login successful', 'success');
        onLoginSuccess('Login successful', data.token);
        onClose();
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message, 'error');
    }
  };

  const register = async () => {
    try {
      const userData = { email, password, user_name: userName, phone_number: phoneNumber };
      
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      console.log('Registration API response:', response);
      
      const responseData = await response.text();
      console.log('Full server response:', responseData);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseData);
          errorMessage = errorData.message || 'Registration failed';
          if (errorMessage.includes('email already exists')) {
            throw new Error('Email already exists. Please choose a different email.');
          }
        } catch (parseError) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = responseData;
          errorMessage = tempDiv.textContent || tempDiv.innerText || 'Registration failed';
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseData);
      console.log('Data received after registration:', data);
      showToast('Registration successful', 'success');
      setIsLogin(true);
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm relative flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 text-center border-b">{isLogin ? 'Login' : 'Register'}</h2>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full p-2 text-sm border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Re-enter Password
                  </label>
                  <input
                    id="rePassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                    User Name
                  </label>
                  <input
                    id="userName"
                    type="text"
                    placeholder="Enter your user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    className={`w-full p-2 text-sm border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
                </div>
              </>
            )}
          </div>
        </form>
        
        <div className="p-6 border-t">
          <button 
            type="submit" 
            onClick={handleSubmit}
            className={`w-full bg-blue-600 text-white p-2 rounded-md transition duration-300 font-semibold text-sm ${
              isFormValid ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormValid}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          <div className="text-center text-sm mt-4">
            <button 
              onClick={toggleMode} 
              className="text-blue-600 hover:text-blue-800 transition duration-300"
            >
              {isLogin ? 'Don\'t have an account? Register now' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
