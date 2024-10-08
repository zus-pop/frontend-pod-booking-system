import { useRoomContext } from '../context/RoomContext';
import { SpinnerDotted } from 'spinners-react';
import { useState } from 'react';
import Room from './Room';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const Rooms = () => {
  const { rooms, loading } = useRoomContext();
  const [showMore, setShowMore] = useState(false);

  const visibleRooms = showMore ? rooms.slice(3, 6) : rooms.slice(0, 3);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className='py-24'>
      {loading && (
        <div className='h-screen w-full fixed bottom-0 top-0 bg-black/80 z-50 grid place-items-center'>
          <SpinnerDotted />
        </div>
      )}

      <div className='container mx-auto lg:px-0'>
        <div className='text-center mb-12'>
          <p className='font-tertiary uppercase text-[15px] tracking-[6px] text-gray-500'>Coffee And Workspaces</p>
          <h2 className='font-primary text-[45px] mb-4'>STORES</h2>
        </div>

        <div className='flex items-center'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 flex-grow'>
            {visibleRooms.map(room => (
              <Room key={room.id} room={room} />
            ))}
          </div>
          
          {rooms.length > 3 && (
            <button 
              onClick={toggleShowMore}
              className='ml-8 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-accent-hover transition duration-300'
            >
              {showMore ? <FaArrowLeft size={24} /> : <FaArrowRight size={24} />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
