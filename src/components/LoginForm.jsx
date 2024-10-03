import React, { useState, useEffect } from 'react';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setIsFormValid(email.trim() !== '' && password.trim() !== '');
    } else {
      setIsFormValid(
        email.trim() !== '' &&
        password.trim() !== '' &&
        rePassword.trim() !== '' &&
        password === rePassword &&
        username.trim() !== ''
      );
    }
  }, [isLogin, email, password, rePassword, username]);

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
  };

  const login = async () => {
    try {
      console.log('Sending login request with:', { email, password });
      const response = await fetch('http://3.27.69.109:3000/api/v1/auth/login', {
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
      console.log('Data received after login:', data);
      if (data.token) {
        onLoginSuccess('Login successful', data.token);
        onClose();
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const register = async () => {
    try {
      const userData = { email, password, user_name: username, phone_number: phoneNumber };
      console.log('Registration data before sending:', JSON.stringify(userData, null, 2));
      const response = await fetch('http://3.27.69.109:3000/api/v1/auth/register', {
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
      alert('Registration successful');
      setIsLogin(true);
      // Keep the data for failed registration
      // setEmail('');
      // setPassword('');
      // setRePassword('');
      // setUsername('');
      // setPhoneNumber('');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 z-10">
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number (optional)
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">
                Re-enter Password <span className="text-red-500">*</span>
              </label>
              <input
                id="rePassword"
                type="password"
                placeholder="Re-enter your password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <button 
            type="submit" 
            className={`w-full bg-blue-600 text-white p-3 rounded-md transition duration-300 font-semibold ${
              isFormValid ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormValid}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={toggleMode} 
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            {isLogin ? 'Don\'t have an account? Register now' : 'Already have an account? Login'}
          </button>
        </div>
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 transition duration-300 font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginForm;