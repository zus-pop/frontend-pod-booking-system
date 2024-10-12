import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Stores from '../components/Stores';

const Home = () => {
  return (
    <div>
      <HeroSlider />
      <Stores />
      {/* Các component khác */}
    </div>
  );
};

export default Home;
