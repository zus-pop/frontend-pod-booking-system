import { createContext, useContext, useState } from "react";

const StoreInfo = createContext();

export const StoreProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStores, setFilteredStores] = useState([]);
  const [totalStores, setTotalStores] = useState(0);

  const resetStoreFilterData = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setFilteredStores([]);
    setTotalStores(0);
  };

  const value = {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    filteredStores,
    setFilteredStores,
    totalStores,
    setTotalStores,
    resetStoreFilterData
  };

  return (
    <StoreInfo.Provider value={value}>
      {children}
    </StoreInfo.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreInfo);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};
