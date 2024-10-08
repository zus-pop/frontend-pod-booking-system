import { useState } from 'react';
import { useRoomContext } from '../context/RoomContext';

const SearchForm = ({ onSearch }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const { rooms } = useRoomContext();

  const districts = ['Tất cả quận', ...new Set(rooms.map(room => room.district))];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(selectedDistrict === 'Tất cả quận' ? '' : selectedDistrict);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='h-[70px] w-full'>
      <div className='flex w-full h-full'>
        <div className='flex-1'>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className='w-full h-full px-8 text-primary outline-none cursor-pointer'
          >
            {districts.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='btn btn-primary'
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
