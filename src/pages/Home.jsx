import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Stores from '../components/Stores';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { setShowNotifications, setShowDropdown, setShowLoginForm } = useAuth();

  const handleSliderClick = () => {
    setShowNotifications(false);
    setShowDropdown(false);
    setShowLoginForm(false);
  };

  return (
    <div>
      <HeroSlider onSliderClick={handleSliderClick} />
      <Stores />
    </div>
  );
};

export default Home;
