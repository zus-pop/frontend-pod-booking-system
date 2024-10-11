import Store from './Store';
import { FaArrowRight } from 'react-icons/fa';

const Stores = ({ stores, nextPage, currentPage, totalPages }) => {
  const showPagination = totalPages > 1;

  return (
    <section className='py-24'>
      <div className='container mx-auto lg:px-0'>
        <div className='text-center mb-12'>
          <h2 className='font-primary text-[45px] mb-4'>STORES</h2>
        </div>
        <div className='relative'>
          <div className='grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0'>
            {stores && stores.length > 0 ? (
              stores.map((store) => (
                <Store store={store} key={store.id} />
              ))
            ) : (
              <p>Không có cửa hàng nào được tìm thấy.</p>
            )}
          </div>
          {showPagination && (
            <button 
              onClick={nextPage} 
              className='absolute top-1/2 -right-12 transform -translate-y-1/2 p-2 text-primary hover:text-accent'
            >
              <FaArrowRight size={24} />
            </button>
          )}
        </div>
        {showPagination && (
          <div className='text-center mt-8'>
            <span>{currentPage} / {totalPages}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Stores;
