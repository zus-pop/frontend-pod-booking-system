import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const Room = ({ room }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/room/${room.id}`);
    } else {
      setShowLoginForm(true);
    }
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginForm(false);
    navigate(`/room/${room.id}`);
  };

  return (
    <div>
      {/* ... hiển thị thông tin phòng ... */}
      <button onClick={handleBookNow}>Đặt ngay</button>
      {showLoginForm && (
        <LoginForm
          onLogin={handleLoginSuccess}
          onClose={() => setShowLoginForm(false)}
        />
      )}
    </div>
  );
};

export default Room;
