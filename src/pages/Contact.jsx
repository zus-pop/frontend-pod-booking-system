import React, { useState } from 'react';
import { HeroSlider } from '../components';

const Contact = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi tin nhắn ở đây
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto py-24">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-2">Email: info@poddycoffee.com</p>
            <p className="mb-2">Hotline: +84 123 456 789</p>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <textarea 
                className="w-full p-2 border rounded mb-4"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message here..."
              ></textarea>
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;