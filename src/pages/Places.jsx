import React, { useState, useEffect, useCallback } from 'react';
import Store from '../components/Store';
import { HeroSlider } from '../components';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm';
import { debounce } from 'lodash';

const Places = () => {
  const [stores, setStores] = useState([]); // Tất cả stores
  const [displayedStores, setDisplayedStores] = useState([]); // Stores đang hiển thị
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const ITEMS_PER_PAGE = 3;

  // Fetch tất cả stores
  const fetchAllStores = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/stores?limit=1000`);
      if (!response.ok) throw new Error("Error fetching stores");
      const data = await response.json();
      setStores(data.stores);
      return data.stores;
    } catch (error) {
      console.error("Error fetching all stores:", error);
      return [];
    }
  }, [API_URL]);

  // Fetch stores theo trang
  const fetchPaginatedStores = useCallback(async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/v1/stores?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error("Error fetching stores");
      const data = await response.json();
      setDisplayedStores(data.stores);
      setTotalStores(data.total);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setDisplayedStores([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Load tất cả stores khi component mount
  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  // Load stores theo trang khi component mount hoặc trang thay đổi
  useEffect(() => {
    if (!searchTerm) {
      fetchPaginatedStores(currentPage);
    }
  }, [fetchPaginatedStores, currentPage, searchTerm]);

  // Xử lý tìm kiếm
  const handleSearch = debounce(async (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);

    if (!searchValue.trim()) {
      await fetchPaginatedStores(1);
      return;
    }

    const filtered = stores.filter(store => 
      store.address.toLowerCase().includes(searchValue.toLowerCase())
    );

    setSearchResults(filtered);
    setTotalStores(filtered.length);
    setDisplayedStores(filtered.slice(0, ITEMS_PER_PAGE));
  }, 300);

  // Xử lý chuyển trang
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    
    if (searchTerm) {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      setDisplayedStores(searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE));
    } else {
      await fetchPaginatedStores(page);
    }
  };

  // Google Map component
  const GoogleMap = () => (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125412.37141037246!2d106.62936770915074!3d10.800654291746905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zSOG7kyBDaMOtIE1pbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1696165410038!5m2!1svi!2s"
        className="w-full h-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto py-24">
        <div className="flex gap-8">
          {/* Left side - Store list */}
          <div className="w-1/2">
            <SearchForm onSearch={handleSearch} />
            <div className="flex flex-col space-y-8">
              {displayedStores.map(store => (
                <div key={store.store_id} className="w-full">
                  <Store store={store} />
                </div>
              ))}
              {totalStores > ITEMS_PER_PAGE && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalStores}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right side - Google Map */}
          <div className="w-1/2 sticky top-24 h-[calc(100vh-6rem)]">
            <GoogleMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;
