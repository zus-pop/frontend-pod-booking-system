import { useState, useEffect } from 'react';
import { ScrollToTop } from '../components';
import { hotelRules } from '../constants/data';
import { useParams } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import Loading from '../components/Loading';

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/stores/${id}`);
        if (!response.ok) {
          throw new Error('Không thể lấy thông tin cửa hàng');
        }
        const data = await response.json();
        setStore(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cửa hàng:', error);
      } finally {
        // Thêm độ trễ 0,5 giây trước khi tắt loading
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchStoreDetails();
  }, [id, API_URL]);

  // Tạm thời thay thế PodTypesDropdown và StoreAddressDropdown bằng select đơn giản
  const PodTypesDropdown = () => (
    <select className="w-full p-2 border rounded">
      <option>Chọn loại Pod</option>
      <option>Pod Single</option>
      <option>Pod Double</option>
      <option>Pod Meeting</option>
    </select>
  );

  const StoreAddressDropdown = () => (
    <select className="w-full p-2 border rounded">
      <option>Chọn địa chỉ cửa hàng</option>
      <option>123 Nguyen Hue, District 1</option>
      <option>456 Le Van Sy, District 3</option>
      <option>789 Tran Hung Dao, District 5</option>
    </select>
  );

  if (loading) {
    return <Loading />;
  }

  if (!store) {
    return <div>Không tìm thấy thông tin cửa hàng</div>;
  }

  return (
    <section>
      <ScrollToTop />

      <div className='bg-room h-[560px] relative flex justify-center items-center bg-cover bg-center' style={{backgroundImage: `url(${store.image})`}}>
        <div className='absolute w-full h-full bg-black/70' />
        <h1 className='text-6xl text-white z-20 font-primary text-center'>{store.store_name} Details</h1>
      </div>

      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row lg:gap-x-8 h-full py-24'>
          {/* ⬅️⬅️⬅️ left side ⬅️⬅️⬅️ */}
          <div className='w-full lg:w-[60%] h-full text-justify'>
            <h2 className='h2'>{store.store_name}</h2>
            
            <img className='mb-8' src={store.image} alt={store.store_name} />

            <div className='mt-12'>
              <h3 className='h3 mb-3'>Utilities</h3>
              <p className='mb-12'>The Poddy offers a delightful blend of functionality and ambiance, making it an ideal place to relax or get work done. With a range of amenities, it provides a perfect setup for students and professionals alike. The decor combines modern and cozy elements, creating a warm and inviting space to unwind or catch up with friends. Additionally, the shop has a great selection of coffee, snacks, and refreshments, ensuring that guests have everything they need for a productive or leisurely visit.</p>

              {/* icons grid */}
              {store.facilities && store.facilities.length > 0 && (
                <div className="grid grid-cols-3 gap-6 mb-12">
                  {store.facilities.map((item, index) => (
                    <div key={index} className='flex items-center gap-x-3 flex-1'>
                      <div className='text-3xl text-accent'>{item.icon && <item.icon />}</div>
                      <div className='text-base'>{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ➡️➡️➡️ right side ➡️➡️➡️ */}
          <div className='w-full lg:w-[40%] h-full'>
            {/* reservation */}
            <div className='py-8 px-6 bg-accent/20 mb-12'>
              <div className='flex flex-col space-y-4 mb-4'>
                <h3>Your Reservation</h3>
                <div className='h-[60px]'><PodTypesDropdown /></div>
                <div className='h-[60px]'><StoreAddressDropdown /></div>
              </div>
              <button className='btn btn-lg btn-primary w-full'>
                Book now
              </button>
            </div>

            <div>
              <h3 className='h3'>POD Rules</h3>
              <p className='mb-6 text-justify'>
                Please follow these rules to experience the best services.
              </p>
              <ul className='flex flex-col gap-y-4'>
                {hotelRules.map(({ rules }, idx) => (
                  <li key={idx} className='flex items-center gap-x-4'>
                    <FaCheck className='text-accent' />
                    {rules}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreDetails;
