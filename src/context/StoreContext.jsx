import { createContext, useContext, useState } from "react";
import { storeData } from "../db/data";

const StoreInfo = createContext();

export const StoreContext = ({ children }) => {
  const [stores, setStores] = useState(storeData);

  const shareWithChildren = {
    stores,
  };

  return (
    <StoreInfo.Provider value={shareWithChildren}>
      {children}
    </StoreInfo.Provider>
  );
};

export const useStoreContext = () => useContext(StoreInfo);
