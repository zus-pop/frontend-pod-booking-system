import { SearchForm, HeroSlider, Rooms, ScrollToTop } from '../components';
import { useState } from 'react';
import { roomData } from '../db/data';

const Home = () => {
  const [filteredRooms, setFilteredRooms] = useState(roomData);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 3;

  const handleSearch = (district) => {
    if (district === '') {
      setFilteredRooms(roomData);
    } else {
      const filtered = roomData.filter(room => room.district.toLowerCase() === district.toLowerCase());
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const nextPage = () => {
    setCurrentPage(prev => (prev % totalPages) + 1);
  };

  return (
    <div>
      <ScrollToTop />

      <HeroSlider />

      <div className='container mx-auto relative'>
        <div className='bg-accent/20 mt-4 p-4 lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:-top-12 lg:z-30 lg:shadow-xl'>
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      <Rooms 
        rooms={currentRooms} 
        nextPage={nextPage} 
        currentPage={currentPage} 
        totalPages={totalPages}
      />
    </div>
  );
};

export default Home;
