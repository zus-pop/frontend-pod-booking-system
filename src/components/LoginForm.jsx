import React, { useState } from 'react';

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  };

  const login = async () => {
    try {
      console.log('Đang gửi yêu cầu đăng nhập với:', { email, password });
      const response = await fetch('http://3.27.69.109:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Phản hồi từ API đăng nhập:', response);
      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }
      const data = await response.json();
      console.log('Dữ liệu nhận được sau đăng nhập:', data);
      if (data.token) {
        onLoginSuccess('Đăng nhập thành công', data.token);
        onClose();
      } else {
        throw new Error('Token không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert(error.message);
    }
  };

  const register = async () => {
    try {
      const response = await fetch('http://3.27.69.109:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Đăng ký thất bại');
      }
      alert('Đăng ký thành công');
      // Tự động đăng nhập sau khi đăng ký
      await login();
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 z-10">
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={toggleMode} 
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 transition duration-300 font-semibold"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default LoginForm;