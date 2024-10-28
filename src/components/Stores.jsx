import React, { useState, useEffect, useCallback } from "react";
import Store from "./Store";
import SearchForm from "./SearchForm";
import Pagination from "./Pagination";
import Loading from "./Loading";
import { debounce } from 'lodash';

const Stores = () => {
    const [stores, setStores] = useState([]); // Lưu tất cả stores
    const [displayedStores, setDisplayedStores] = useState([]); // Stores hiển thị theo trang
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
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
            setTotalItems(data.total);
        } catch (error) {
            console.error("Error fetching paginated stores:", error);
            setDisplayedStores([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    // Fetch tất cả stores khi component mount
    useEffect(() => {
        fetchAllStores();
    }, [fetchAllStores]);

    // Xử lý tìm kiếm
    const handleSearch = debounce(async (searchValue) => {
        setSearchTerm(searchValue);
        setCurrentPage(1); // Reset về trang 1 khi search

        if (!searchValue.trim()) {
            // Nếu ô tìm kiếm rỗng, hiển thị stores theo phân trang
            await fetchPaginatedStores(1);
            return;
        }

        // Tìm kiếm trong danh sách stores
        const filtered = stores.filter(store => 
            store.address.toLowerCase().includes(searchValue.toLowerCase())
        );

        setSearchResults(filtered);
        setTotalItems(filtered.length);
        
        // Hiển thị 3 kết quả đầu tiên
        setDisplayedStores(filtered.slice(0, ITEMS_PER_PAGE));
    }, 300);

    // Xử lý chuyển trang
    const handlePageChange = async (page) => {
        setCurrentPage(page);
        
        if (searchTerm) {
            // Nếu đang search, phân trang từ kết quả search
            const startIndex = (page - 1) * ITEMS_PER_PAGE;
            setDisplayedStores(searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE));
        } else {
            // Nếu không search, fetch trang mới từ API
            await fetchPaginatedStores(page);
        }
    };

    // Load trang đầu tiên khi component mount
    useEffect(() => {
        if (!searchTerm) {
            fetchPaginatedStores(currentPage);
        }
    }, [fetchPaginatedStores, currentPage, searchTerm]);

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
                    <SearchForm onSearch={handleSearch} />
                </div>
                <div className="grid grid-cols-1 max-w-xs mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-6xl lg:mx-auto">
                    {displayedStores.length > 0 ? (
                        displayedStores.map((store) => (
                            <div className="w-full max-w-xs mx-auto" key={store.store_id}>
                                <Store store={store} />
                            </div>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">No stores found</p>
                    )}
                </div>
                {totalItems > ITEMS_PER_PAGE && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Stores;
