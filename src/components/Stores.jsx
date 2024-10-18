import React, { useState, useEffect, useCallback } from "react";
import Store from "./Store";
import SearchForm from "./SearchForm";
import Pagination from "./Pagination";
import Loading from "./Loading";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
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
            setFilteredStores(data.stores);
            setTotalStores(data.total);
        } catch (error) {
            console.error("Error fetching stores:", error);
            setStores([]);
            setFilteredStores([]);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchStores(currentPage);
    }, [fetchStores, currentPage]);

    const handleSearch = (address) => {
        if (address === "") {
            setFilteredStores(stores);
        } else {
            const filtered = stores.filter(
                (store) => store.address === address
            );
            setFilteredStores(filtered);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <section className="py-12">
            <div className="container mx-auto lg:px-0">
                <div className="text-center mb-8">
                    <h2 className="font-primary text-[45px] mb-4">Stores</h2>
                </div>
                <div className="mb-8">
                    <SearchForm onSearch={handleSearch} stores={stores} />
                </div>
                <div className="grid grid-cols-1 max-w-xs mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-6xl lg:mx-auto">
                    {filteredStores.length > 0 ? (
                        filteredStores.map((store) => (
                            <div
                                className="w-full max-w-xs mx-auto"
                                key={store.store_id}
                            >
                                <Store store={store} />
                            </div>
                        ))
                    ) : (
                        <p>No stores found</p>
                    )}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalStores}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
};

export default Stores;
