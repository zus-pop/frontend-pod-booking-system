import React from 'react';
import { HeroSlider, ScrollToTop } from '../components';

const About = () => {
  return (
    <div>
      <ScrollToTop />
      <HeroSlider />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8">About Poddy Coffee and Workspace</h1>
        <p className="text-lg">
          Poddy Coffee and Workspace is a unique blend of coffee shop and co-working space, 
          designed to provide a comfortable and productive environment for professionals, 
          freelancers, and students alike. Our mission is to create a space where great ideas 
          can flourish, fueled by excellent coffee and supported by state-of-the-art facilities. 
          With multiple locations across Ho Chi Minh City, we offer a variety of workspace 
          options to suit different needs, from individual pods for focused work to meeting 
          rooms for collaborative sessions. At Poddy, we believe in fostering a community of 
          like-minded individuals who inspire and support each other in their professional journeys.
        </p>
      </div>
    </div>
  );
};

export default About;
