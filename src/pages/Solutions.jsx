import React from 'react';
import { HeroSlider } from '../components';
import { motion } from 'framer-motion';

const Solutions = () => {
  const pods = [
    {
      name: 'Pod Single',
      description: 'Perfect for individual work, our Pod Single offers a quiet, focused environment for maximum productivity.',
      image: 'public/single.webp',
      features: ['Quiet Environment', 'Personal Desk', 'High-Speed WiFi', 'Coffee Service']
    },
    {
      name: 'Pod Double',
      description: 'Ideal for pairs or small teams, Pod Double provides a collaborative space while maintaining privacy.',
      image: 'public/POD_C.png',
      features: ['Collaborative Setup', 'Shared Workspace', 'Meeting Display', 'Premium Coffee']
    },
    {
      name: 'Pod Meeting',
      description: 'Designed for group discussions and presentations, Pod Meeting is equipped with all necessary tools for effective meetings.',
      image: 'public/meeting.png',
      features: ['Conference Setup', 'Presentation Tools', 'Video Conferencing', 'Catering Options']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSlider />
      
      <div className="container mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-500 text-transparent bg-clip-text">
              Pod Solutions
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our innovative workspace solutions designed to enhance your productivity and comfort
          </p>
        </div>

        <div className="space-y-24">
          {pods.map((pod, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <img
                    src={pod.image}
                    alt={pod.name}
                    className="w-full h-[400px] object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-2xl transition-opacity duration-300 group-hover:opacity-0" />
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold">{pod.name}</h2>
                <p className="text-gray-600 text-lg">{pod.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {pod.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Solutions;