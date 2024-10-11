import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Store = ({ store }) => {
  const { id, name, image, address, district } = store;
  
  // Generate random rating between 4-5
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
  
  // Generate random opening hours
  const openingHours = Math.random() > 0.5 ? 'All day' : '8:00 AM - 10:00 PM';

  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
      <img className='w-full h-48 object-cover' src={image} alt={name} />
      <div className='p-4'>
        <h3 className='font-primary text-xl mb-2'>PODDY Coffee - {district}</h3>
        <div className='flex items-center mb-2'>
          <span className='text-yellow-400 mr-1'>{rating}</span>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-yellow-400 ${i < Math.floor(rating) ? 'opacity-100' : 'opacity-30'}`} />
          ))}
        </div>
        <p className='text-sm text-gray-600 mb-2'>Coffee and workspaces: {address}</p>
        <p className='text-sm text-gray-600 mb-4'>Opening hours: {openingHours}</p>
        <Link 
          to={`/store/${id}`} 
          className='btn btn-secondary btn-sm w-full text-center'
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Store;
