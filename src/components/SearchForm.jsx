import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchForm = ({ onSearch, placeholder = "Search by district..." }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Gọi onSearch ngay khi giá trị thay đổi
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form submit và reload trang
    onSearch(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className='h-[50px] w-full max-w-[600px] mx-auto mb-12'>
      <div className='relative flex w-full h-full'>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className='w-full h-full px-4 pr-12 text-sm text-primary outline-none bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-accent transition-all duration-300 ease-in-out'
        />
        <button 
          type="submit"
          className='absolute right-0 h-full px-4 text-gray-500 hover:text-accent transition-colors duration-300'
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
