import { useState, useEffect } from 'react';

const SearchForm = ({ onSearch, stores }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addresses, setAddresses] = useState(['All Address']);

  useEffect(() => {
    if (stores && stores.length > 0) {
      const uniqueAddresses = ['All Address', ...new Set(stores.map(store => store.address))];
      setAddresses(uniqueAddresses);
    }
  }, [stores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(selectedAddress === 'All Address' ? '' : selectedAddress);
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='h-[50px] w-full'>
      <div className='flex w-full h-full'>
        <div className='flex-1'>
          <select
            value={selectedAddress}
            onChange={handleAddressChange}
            className='w-full h-full px-4 text-sm text-primary outline-none cursor-pointer bg-white border border-gray-300 rounded-l-md focus:ring-2 focus:ring-accent transition-all duration-300 ease-in-out'
          >
            {addresses.map((address, index) => (
              <option key={index} value={address}>{address}</option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='btn btn-primary rounded-r-md px-6 text-sm font-sans bg-black text-white hover:bg-accent transition-all duration-300 ease-in-out uppercase tracking-wider'
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
