import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Store = ({ store }) => {
  if (!store) {
    return null;
  }

  const { store_id, store_name, image, address, hotline } = store;
  
  // Tạo số sao ngẫu nhiên từ 4-5
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);

  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2'>
      {image && <img className='w-full h-48 object-cover' src={image} alt={store_name} />}
      <div className='p-4 flex-grow flex flex-col'>
        <h3 className='font-primary text-xl mb-2 transition-colors duration-200 ease-in-out hover:text-accent'>{store_name}</h3>
        <div className='flex items-center mb-2'>
          <span className='text-yellow-400 mr-1'>{rating}</span>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-yellow-400 ${i < Math.floor(rating) ? 'opacity-100' : 'opacity-30'}`} />
          ))}
        </div>
        <div className='flex-grow'>
          <p className='text-sm text-gray-600 mb-2'>Address: {address}</p>
          <p className='text-sm text-gray-600'>Hotline: {hotline}</p>
        </div>
        <Link 
          to={`/store/${store_id}`} 
          className='w-full text-center mt-4 py-2 text-sm font-sans bg-black text-white hover:bg-accent transition-colors duration-200 ease-in-out uppercase tracking-wider'
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Store;
