import { SearchForm, HeroSlider, Stores, ScrollToTop } from '../components';
import { useState } from 'react';
import { storeData } from '../db/data';

const Home = () => {
  const [filteredStores, setFilteredStores] = useState(storeData);
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 3;

  const handleSearch = (district) => {
    if (district === '') {
      setFilteredStores(storeData);
    } else {
      const filtered = storeData.filter(store => store.district.toLowerCase() === district.toLowerCase());
      setFilteredStores(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);

  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

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

      <Stores 
        stores={currentStores} 
        nextPage={nextPage} 
        currentPage={currentPage} 
        totalPages={totalPages}
      />
    </div>
  );
};

export default Home;
