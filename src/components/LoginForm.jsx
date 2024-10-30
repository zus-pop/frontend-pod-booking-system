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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { showToast } = useToast();

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <input
                type="password"
                value={rePassword}
                onChange={handleRePasswordChange}
                onBlur={handleRePasswordBlur}
                placeholder="Confirm Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                placeholder="Phone Number"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full p-2 rounded text-white font-medium
            ${isFormValid 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;