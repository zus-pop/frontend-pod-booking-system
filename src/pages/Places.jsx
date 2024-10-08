import React, { useState } from 'react';
import { useRoomContext } from '../context/RoomContext';
import Room from '../components/Room';
import { HeroSlider } from '../components';

const Places = () => {
  const { rooms } = useRoomContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room => 
    room.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto py-24">
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="Search by district" 
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="flex flex-col space-y-4">
              {filteredRooms.map(room => (
                <Room key={room.id} room={room} />
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-4">
            {/* Here you would integrate a map component */}
            <div className="bg-gray-200 h-full rounded">Map placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;