import React, { useState } from 'react';

const LoginForm = ({ onLogin, onRegister, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
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