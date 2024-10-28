import React, { useState, useEffect, useCallback } from 'react';
import Store from '../components/Store';
import { HeroSlider } from '../components';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const Places = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const ITEMS_PER_PAGE = 3;

  const fetchStores = useCallback(async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/v1/stores?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error("Error fetching stores");
      }
      const data = await response.json();
      setStores(data.stores);
      setTotalStores(data.total);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStores(currentPage);
  }, [fetchStores, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto py-24">
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          {stores.map(store => (
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
    </div>
  );
};

export default Places;
