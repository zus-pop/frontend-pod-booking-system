import React, { useState, useEffect, useCallback } from 'react';
import Store from './Store';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchStores = useCallback(async () => {
    try {
      console.log('Đang gọi API với URL:', `${API_URL}/api/v1/stores`);
      const response = await fetch(`${API_URL}/api/v1/stores`);
      console.log('Trạng thái response:', response.status);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách cửa hàng');
      }
      const data = await response.json();
      console.log('Dữ liệu nhận được từ API:', data);
      // Lọc ra các store có image không phải null
      const validStores = data.filter(store => store.image !== null);
      setStores(validStores);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cửa hàng:', error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsLoading(true);
    fetchStores();
  }, [fetchStores]);

  console.log('Rendering Stores component với stores:', stores);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <section className='py-24'>
      <div className='container mx-auto lg:px-0'>
        <div className='text-center mb-12'>
          <h2 className='font-primary text-[45px] mb-4'>STORES</h2>
        </div>
        <div className='grid grid-cols-1 max-w-xs mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-6xl lg:mx-auto'>
          {stores.length > 0 ? (
            stores.map((store) => (
              <div className="w-full max-w-xs mx-auto" key={store.store_id}>
                <Store store={store} />
              </div>
            ))
          ) : (
            <p>Không có cửa hàng nào được tìm thấy.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Stores;
