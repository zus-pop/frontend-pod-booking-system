import React from 'react';
import { HeroSlider } from '../components';

const Solutions = () => {
  const pods = [
    {
      name: 'Pod Single',
      description: 'Perfect for individual work, our Pod Single offers a quiet, focused environment for maximum productivity.'
    },
    {
      name: 'Pod Double',
      description: 'Ideal for pairs or small teams, Pod Double provides a collaborative space while maintaining privacy.'
    },
    {
      name: 'Pod Meeting',
      description: 'Designed for group discussions and presentations, Pod Meeting is equipped with all necessary tools for effective meetings.'
    }
  ];

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8">Our Pod Solutions</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pods.map((pod, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{pod.name}</h2>
              <p>{pod.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Solutions;